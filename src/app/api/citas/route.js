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
      query += " WHERE fecha = ?";
      params.push(fecha);
    }

    query += " ORDER BY fecha DESC, hora ASC";
    if (id_cliente) {
      query = "Select * from citas where id_paciente=?";
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
