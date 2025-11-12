import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fecha = searchParams.get("fecha");
  const id_cliente = searchParams.get("id_cliente");

  try {
    let query = "SELECT * FROM citas";
    let params = [];

    if (fecha) {
      // Para consultas por fecha (admin), mostrar solo citas activas
      query += " WHERE fecha = ? AND status = 'activa'";
      params.push(fecha);
    }

    query += " ORDER BY fecha DESC, hora ASC";
    if (id_cliente) {
      // Solo mostrar citas activas para los pacientes
      query = "SELECT * FROM citas WHERE id_paciente = ? AND status = 'activa' ORDER BY fecha DESC, hora ASC";
      params = [id_cliente];
    }
    const [rows] = await conn.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al consultar citas:", error);
    return NextResponse.json(
      { error: "Error interno al obtener las citas" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { fecha, status } = await req.json();

    if (!fecha || !status) {
      return NextResponse.json(
        { error: "Faltan datos requeridos (fecha, status)" },
        { status: 400 }
      );
    }

    // Actualizar todas las citas de la fecha especificada
    const [result] = await conn.query(
      "UPDATE citas SET status = ? WHERE fecha = ?",
      [status, fecha]
    );

    return NextResponse.json({
      message: `Se actualizaron ${result.affectedRows} citas`,
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Error al actualizar citas:", error);
    return NextResponse.json(
      { error: "Error interno al actualizar las citas" },
      { status: 500 }
    );
  }
}
