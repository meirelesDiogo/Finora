import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { createSessionToken, sessionCookie } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, senha } = await request.json();
    const result = await pool.query("SELECT cod_usuario, senha FROM usuarios WHERE email = $1", [String(email || "").trim().toLowerCase()]);
    if (!result.rowCount || !(await bcrypt.compare(String(senha || ""), result.rows[0].senha)))
      return NextResponse.json({ mensagem: "E-mail ou senha incorretos." }, { status: 401 });
    const response = NextResponse.json({ mensagem: "Login realizado." });
    response.cookies.set(sessionCookie, createSessionToken(result.rows[0].cod_usuario), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
    return response;
  } catch (error) {
    console.error("Falha no login:", error);
    return NextResponse.json({ mensagem: "Não foi possível entrar. Confira a conexão com o banco." }, { status: 500 });
  }
}
