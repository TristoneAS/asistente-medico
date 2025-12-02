import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET() {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Normalizar a medianoche

    // Calcular fechas objetivo (3, 2 y 1 día desde hoy)
    const fechaEn3Dias = new Date(hoy);
    fechaEn3Dias.setDate(hoy.getDate() + 3);
    const fechaEn2Dias = new Date(hoy);
    fechaEn2Dias.setDate(hoy.getDate() + 2);
    const fechaEn1Dia = new Date(hoy);
    fechaEn1Dia.setDate(hoy.getDate() + 1);

    // Formatear fechas a YYYY-MM-DD
    const fecha3Str = fechaEn3Dias.toISOString().split("T")[0];
    const fecha2Str = fechaEn2Dias.toISOString().split("T")[0];
    const fecha1Str = fechaEn1Dia.toISOString().split("T")[0];

    // Obtener todas las citas activas que están en las fechas objetivo
    const [citas] = await conn.query(
      `SELECT id_cita, fecha, hora, id_paciente, nombre_paciente 
       FROM citas 
       WHERE status = 'activa' 
       AND fecha IN (?, ?, ?)`,
      [fecha3Str, fecha2Str, fecha1Str]
    );

    let notificacionesCreadas = 0;
    const errores = [];

    for (const cita of citas) {
      try {
        // Calcular días restantes
        const fechaCita = new Date(cita.fecha);
        fechaCita.setHours(0, 0, 0, 0);
        const diasRestantes = Math.ceil(
          (fechaCita - hoy) / (1000 * 60 * 60 * 24)
        );

        // Solo crear notificación si faltan exactamente 3, 2 o 1 día
        if (diasRestantes !== 3 && diasRestantes !== 2 && diasRestantes !== 1) {
          continue;
        }

        // Formatear fecha para el mensaje
        const fechaFormateada = fechaCita.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        // Formatear hora
        const horaFormateada = cita.hora
          ? String(cita.hora).slice(0, 5)
          : "";

        // Crear texto de notificación según días restantes
        let textoNotificacion = "";
        if (diasRestantes === 3) {
          textoNotificacion = `Tu cita del día ${fechaFormateada} a las ${horaFormateada} se aproxima en 3 días.`;
        } else if (diasRestantes === 2) {
          textoNotificacion = `Tu cita del día ${fechaFormateada} a las ${horaFormateada} se aproxima en 2 días.`;
        } else if (diasRestantes === 1) {
          textoNotificacion = `Tu cita del día ${fechaFormateada} a las ${horaFormateada} se aproxima mañana.`;
        }

        // Verificar si ya existe una notificación similar para evitar duplicados
        const [notificacionesExistentes] = await conn.query(
          `SELECT id FROM notificaciones 
           WHERE id_cliente = ? 
           AND texto = ? 
           AND status = 'sin leer'`,
          [cita.id_paciente, textoNotificacion]
        );

        // Solo crear si no existe
        if (notificacionesExistentes.length === 0) {
          await conn.query(
            `INSERT INTO notificaciones (id_cliente, status, texto) VALUES (?, ?, ?)`,
            [cita.id_paciente, "sin leer", textoNotificacion]
          );
          notificacionesCreadas++;
        }
      } catch (error) {
        console.error(
          `Error al procesar cita ${cita.id_cita}:`,
          error
        );
        errores.push(`Cita ${cita.id_cita}: ${error.message}`);
      }
    }

    return NextResponse.json({
      message: `Proceso completado. Se crearon ${notificacionesCreadas} notificaciones.`,
      notificacionesCreadas,
      citasProcesadas: citas.length,
      errores: errores.length > 0 ? errores : undefined,
    });
  } catch (error) {
    console.error("Error al verificar recordatorios:", error);
    return NextResponse.json(
      { error: "Error interno al verificar recordatorios", details: error.message },
      { status: 500 }
    );
  }
}

