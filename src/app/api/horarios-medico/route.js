import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

// GET: obtener todos los horarios
export async function GET() {
  try {
    const [rows] = await conn.query(
      `SELECT id_horario, dia_semana, hora_inicio, hora_fin, duracion_cita
       FROM horarios_medico
       ORDER BY FIELD(dia_semana,'lunes','martes','miércoles','jueves','viernes','sábado','domingo'), hora_inicio`
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener horarios:", error);
    return NextResponse.json(
      { error: "Error al obtener horarios" },
      { status: 500 }
    );
  }
}

// POST: agregar un nuevo horario
export async function POST(req) {
  try {
    const body = await req.json();
    const { dia_semana, hora_inicio, hora_fin, duracion_cita } = body;

    if (!dia_semana || !hora_inicio || !hora_fin || !duracion_cita) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    await conn.query(
      `INSERT INTO horarios_medico (dia_semana, hora_inicio, hora_fin, duracion_cita)
       VALUES (?, ?, ?, ?)`,
      [dia_semana, hora_inicio, hora_fin, duracion_cita]
    );

    return NextResponse.json({ message: "Horario guardado correctamente ✅" });
  } catch (error) {
    console.error("Error al guardar horario:", error);
    return NextResponse.json(
      { error: "Error al guardar horario" },
      { status: 500 }
    );
  }
}

// PUT: actualizar un horario existente
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id_horario, dia_semana, hora_inicio, hora_fin, duracion_cita } =
      body;

    if (
      !id_horario ||
      !dia_semana ||
      !hora_inicio ||
      !hora_fin ||
      !duracion_cita
    ) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const [result] = await conn.query(
      `UPDATE horarios_medico
       SET dia_semana = ?, hora_inicio = ?, hora_fin = ?, duracion_cita = ?
       WHERE id_horario = ?`,
      [dia_semana, hora_inicio, hora_fin, duracion_cita, id_horario]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Horario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Horario actualizado correctamente ✅",
    });
  } catch (error) {
    console.error("Error al actualizar horario:", error);
    return NextResponse.json(
      { error: "Error al actualizar horario" },
      { status: 500 }
    );
  }
}

// DELETE: eliminar un horario
export async function DELETE(req) {
  try {
    const body = await req.json();
    const { id_horario } = body;

    if (!id_horario) {
      return NextResponse.json({ error: "Falta id_horario" }, { status: 400 });
    }

    const [result] = await conn.query(
      `DELETE FROM horarios_medico WHERE id_horario = ?`,
      [id_horario]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Horario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Horario eliminado correctamente ✅" });
  } catch (error) {
    console.error("Error al eliminar horario:", error);
    return NextResponse.json(
      { error: "Error al eliminar horario" },
      { status: 500 }
    );
  }
}
