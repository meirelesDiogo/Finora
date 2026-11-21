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
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || String(senha || "").length < 8)
      return NextResponse.json({ mensagem: "Informe um e-mail válido e uma senha com pelo menos 8 caracteres." }, { status: 400 });
    const hash = await bcrypt.hash(senha, 12);
    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.usuarios.create({ data: { email: normalizedEmail, senha: hash } });
      await tx.categorias.createMany({
        data: [
          ["Salário", "RECEITA"], ["Outras receitas", "RECEITA"],
          ["Moradia", "DESPESA"], ["Alimentação", "DESPESA"], ["Transporte", "DESPESA"],
          ["Saúde", "DESPESA"], ["Lazer", "DESPESA"], ["Outras despesas", "DESPESA"],
          ["Investimento", "DESPESA"],
        ].map(([nome, tipo]) => ({ cod_usuario: created.cod_usuario, nome, tipo })),
      });
      return created;
    });
    const id = user.cod_usuario;
    const response = NextResponse.json({ mensagem: "Conta criada com sucesso." }, { status: 201 });
    response.cookies.set(sessionCookie, createSessionToken(id), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
    return response;
  } catch (error) {
    if (error.code === "P2002") return NextResponse.json({ mensagem: "Este e-mail já está cadastrado." }, { status: 409 });
    console.error("Falha no cadastro:", error);
    return NextResponse.json({ mensagem: "Não foi possível criar a conta. Confira DATABASE_URL e SESSION_SECRET nas variáveis da Vercel." }, { status: 500 });
  }
}
