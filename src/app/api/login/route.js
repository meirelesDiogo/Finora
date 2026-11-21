import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionToken, sessionCookie } from "@/lib/auth";
import { respostaConfiguracaoAusente, variavelDeAmbienteAusente } from "@/lib/configuracao";

export async function POST(request) {
  try {
    const ausente = variavelDeAmbienteAusente();
    if (ausente) return NextResponse.json({ mensagem: respostaConfiguracaoAusente(ausente) }, { status: 503 });
    const { email, senha } = await request.json();
    const user = await prisma.usuarios.findUnique({ where: { email: String(email || "").trim().toLowerCase() }, select: { cod_usuario: true, senha: true } });
    if (!user || !(await bcrypt.compare(String(senha || ""), user.senha)))
      return NextResponse.json({ mensagem: "E-mail ou senha incorretos." }, { status: 401 });
    const response = NextResponse.json({ mensagem: "Login realizado." });
    response.cookies.set(sessionCookie, createSessionToken(user.cod_usuario), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
    return response;
  } catch (error) {
    console.error("Falha no login:", error);
    return NextResponse.json({ mensagem: "Não foi possível entrar. Confira a conexão com o banco." }, { status: 500 });
  }
}
