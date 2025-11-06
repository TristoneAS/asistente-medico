import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const telefono = searchParams.get("telefono");
    let query = "SELECT COALESCE(MAX(id), 0) + 1 AS nuevo_id FROM usuarios;";
    let params = [];
    if (telefono) {
      query = "SELECT * FROM usuarios where telefono=?";
      params = [telefono];
    }
    const [rows] = await conn.query(query, params);
    console.log(rows);
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    const usuario = await request.json();
    delete usuario.confirmar_contraseña;
    const [resultado] = await conn.query("INSERT INTO usuarios SET ?", [
      usuario,
    ]);

    return NextResponse.json({
      id: resultado.insertId,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
