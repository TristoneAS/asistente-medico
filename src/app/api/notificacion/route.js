import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(req) {
  try {
    const { id_cliente, status, texto } = await req.json();

    await conn.query(
      `INSERT INTO notificaciones (id_cliente, status,texto) VALUES (?,?,?)`,
      [id_cliente, status, texto]
    );

    return NextResponse.json({ message: "Notificacion enviada ✅" });
  } catch (error) {
    console.error(error);
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "No se envio la notificacion" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Error al registrar cita" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_cliente = searchParams.get("id_cliente");
    const leidas = searchParams.get("leido");
    console.log("las leidas son" + leidas);

    let query = "SELECT * from notificaiones";
    let params = [];
    if (id_cliente && leidas == "true") {
      query =
        "SELECT * from notificaciones WHERE id_cliente = ? and status='leido' order by id asc";
      params = [id_cliente];
    } else if (id_cliente) {
      query =
        "SELECT * from notificaciones WHERE id_cliente = ? and status='sin leer' order by id asc";
      params = [id_cliente];
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
