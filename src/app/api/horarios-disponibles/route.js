import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fecha = searchParams.get("fecha");
    const dia = searchParams.get("dia");
    if (!fecha) return NextResponse.json([], { status: 200 });

    // Obtener horarios del médico
    const [horarios] = await conn.query(
      `SELECT hora_inicio, hora_fin, duracion_cita FROM horarios_medico where dia_semana=?`,
      [dia]
    );

    // Obtener citas ya registradas
    const [citas] = await conn.query(`SELECT hora FROM citas WHERE fecha = ?`, [
      fecha,
    ]);
    // Truncar segundos para que coincida con HH:mm
    const horasOcupadas = citas.map((c) => c.hora.slice(0, 5));

    // Generar horas disponibles
    const disponibles = [];
    horarios.forEach((h) => {
      const inicio = new Date(`${fecha}T${h.hora_inicio}`);
      const fin = new Date(`${fecha}T${h.hora_fin}`);
      let current = new Date(inicio);

      while (current < fin) {
        const tiempo = current.toTimeString().slice(0, 5); // HH:mm
        if (!horasOcupadas.includes(tiempo)) {
          disponibles.push(tiempo);
        }
        current.setMinutes(current.getMinutes() + h.duracion_cita);
      }
    });

    // Eliminar duplicados y ordenar
    const horasUnicas = [...new Set(disponibles)].sort();

    // Preparar respuesta
    const response = horasUnicas.map((hora) => ({
      hora,
      id: `${fecha}-${hora}`,
      fecha,
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 500 });
  }
}
