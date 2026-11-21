import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { createSessionToken, sessionCookie } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, senha } = await request.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || String(senha || "").length < 8)
      return NextResponse.json({ mensagem: "Informe um e-mail válido e uma senha com pelo menos 8 caracteres." }, { status: 400 });
    const hash = await bcrypt.hash(senha, 12);
    const result = await pool.query("INSERT INTO usuarios(email, senha) VALUES($1,$2) RETURNING cod_usuario", [normalizedEmail, hash]);
    const id = result.rows[0].cod_usuario;
    await pool.query("INSERT INTO categorias(cod_usuario,nome,tipo) VALUES ($1,'Salário','RECEITA'),($1,'Outras receitas','RECEITA'),($1,'Moradia','DESPESA'),($1,'Alimentação','DESPESA'),($1,'Transporte','DESPESA'),($1,'Saúde','DESPESA'),($1,'Lazer','DESPESA'),($1,'Outras despesas','DESPESA')", [id]);
    const response = NextResponse.json({ mensagem: "Conta criada com sucesso." }, { status: 201 });
    response.cookies.set(sessionCookie, createSessionToken(id), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
    return response;
  } catch (error) {
    if (error.code === "23505") return NextResponse.json({ mensagem: "Este e-mail já está cadastrado." }, { status: 409 });
    console.error("Falha no cadastro:", error);
    return NextResponse.json({ mensagem: "Não foi possível criar sua conta. Confira a configuração do banco." }, { status: 500 });
  }
}
