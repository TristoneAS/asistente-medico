import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

function pad(n) {
  return String(n).padStart(2, "0");
}

function generarSlots(horaInicio, horaFin, duracion) {
  const [hiH, hiM] = horaInicio.split(":").map(Number);
  const [hfH, hfM] = horaFin.split(":").map(Number);
  const inicio = hiH * 60 + hiM;
  const fin = hfH * 60 + hfM;

  const slots = [];
  for (let t = inicio; t + duracion <= fin; t += duracion) {
    const hh = pad(Math.floor(t / 60));
    const mm = pad(t % 60);
    slots.push(`${hh}:${mm}`);
  }
  return slots;
}

export async function GET() {
  try {
    const hoy = new Date();
    const diasSemana = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];

    const diasRango = 30;
    const fechasDisponibles = [];

    // ---- obtener horarios ----
    const [horariosMedico] = await conn.query(
      "SELECT dia_semana, hora_inicio, hora_fin, duracion_cita FROM horarios_medico"
    );
    const horariosPorDia = {};
    horariosMedico.forEach((h) => {
      const key = h.dia_semana.toLowerCase();
      if (!horariosPorDia[key]) horariosPorDia[key] = [];
      horariosPorDia[key].push(h);
    });

    // ---- obtener todas las citas ----
    const fechaInicio = hoy.toISOString().slice(0, 10);
    const fin = new Date(hoy);
    fin.setDate(hoy.getDate() + diasRango);
    const fechaFin = fin.toISOString().slice(0, 10);
    // Considerar todas las citas (activas y canceladas) para calcular disponibilidad
    // Las horas canceladas también deben aparecer como no disponibles
    const [citas] = await conn.query(
      "SELECT fecha, hora FROM citas WHERE fecha BETWEEN ? AND ?",
      [fechaInicio, fechaFin]
    );

    const citasPorFecha = {};
    for (const c of citas) {
      const fecha =
        typeof c.fecha === "string"
          ? c.fecha
          : c.fecha.toISOString().slice(0, 10);
      const hora = String(c.hora).slice(0, 5);
      if (!citasPorFecha[fecha]) citasPorFecha[fecha] = new Set();
      citasPorFecha[fecha].add(hora);
    }

    // ---- recorrer los próximos días ----
    for (let i = 0; i < diasRango; i++) {
      const d = new Date();
      d.setDate(hoy.getDate() + i);

      // 🔹 Convertir a "fecha local" para que getDay() sea correcto
      const offsetMs = d.getTimezoneOffset() * 60000;
      const localDate = new Date(d.getTime() - offsetMs);

      const fechaStr = localDate.toISOString().slice(0, 10);

      const dayIndex = localDate.getDay(); // ahora sí día local correcto
      const diaNombre = diasSemana[dayIndex];
      const horarios = horariosPorDia[diaNombre] || [];

      if (horarios.length === 0) continue;

      const ocupadas = citasPorFecha[fechaStr] || new Set();
      let hayLibre = false;

      for (const h of horarios) {
        const slots = generarSlots(h.hora_inicio, h.hora_fin, h.duracion_cita);
        for (const slot of slots) {
          if (!ocupadas.has(slot)) {
            hayLibre = true;
            break;
          }
        }
        if (hayLibre) break;
      }

      console.log(
        `[DEBUG] ${fechaStr} (${diaNombre}) -> ${
          hayLibre ? "DISPONIBLE" : "LLENO"
        }`
      );

      if (hayLibre) fechasDisponibles.push(fechaStr);
    }

    return NextResponse.json(fechasDisponibles);
  } catch (err) {
    console.error("Error en /api/dias-disponibles:", err);
    return NextResponse.json([], { status: 500 });
  }
}
