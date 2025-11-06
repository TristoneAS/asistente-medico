import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";

export async function POST(req) {
  try {
    const {
      fecha,
      hora,
      id_paciente,
      nombre_paciente,
      fecha_nacimiento,
      motivo,
      telefono,
      direccion,
      status,
    } = await req.json();

    if (!fecha || !hora || !nombre_paciente) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    await conn.query(
      `INSERT INTO citas (fecha, hora,id_paciente, nombre_paciente,fecha_nacimiento,motivo,telefono,direccion,status) VALUES (?,?,?,?, ?, ?,?,?,?)`,
      [
        fecha,
        hora,
        id_paciente,
        nombre_paciente,
        fecha_nacimiento,
        motivo,
        telefono,
        direccion,
        status,
      ]
    );

    return NextResponse.json({ message: "Cita registrada ✅" });
  } catch (error) {
    console.error(error);
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "La hora ya está ocupada" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Error al registrar cita" },
      { status: 500 }
    );
  }
}
