import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const { email, senha } = await request.json();

    const resultado = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (resultado.rows.length === 0) {
      return NextResponse.json({
        existe: false,
        mensagem: "Usuário não encontrado!",
      });
    }

    return NextResponse.json({
      existe: true,
      mensagem: "Usuário encontrado!",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { mensagem: "Erro ao consultar o banco." },
      { status: 500 }
    );
  }
}