import { NextResponse } from "next/server";
import { conn } from "@/libs/mysql";
export async function PUT(request, { params }) {
  try {
    const { id } = params;

    const result = await conn.query(
      "UPDATE notificaciones SET status='leido' WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Notificación no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Notificación marcada como leída" });
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
