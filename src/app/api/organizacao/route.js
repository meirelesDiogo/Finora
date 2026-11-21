import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { currentUserId } from "@/lib/auth";
export async function POST(request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ mensagem: "Faça login para continuar." }, { status: 401 });
  const { tipo, nome, descricao } = await request.json();
  const clean = String(nome || "").trim();
  if (!clean || clean.length > (tipo === "projeto" ? 150 : 100)) return NextResponse.json({ mensagem: "Informe um nome válido." }, { status: 400 });
  try {
    const result = tipo === "projeto"
      ? await pool.query("INSERT INTO projetos(cod_usuario,nome,descricao) VALUES($1,$2,$3) RETURNING cod_projeto", [userId,clean,String(descricao||"").trim()||null])
      : ["RECEITA","DESPESA"].includes(tipo)
        ? await pool.query("INSERT INTO categorias(cod_usuario,nome,tipo) VALUES($1,$2,$3) RETURNING cod_categoria", [userId,clean,tipo])
        : null;
    if (!result) return NextResponse.json({ mensagem: "Tipo inválido." }, { status: 400 });
    return NextResponse.json({ mensagem: "Salvo com sucesso." }, { status: 201 });
  } catch (error) { if (error.code === "23505") return NextResponse.json({ mensagem: "Esse nome já está em uso." }, { status: 409 }); return NextResponse.json({ mensagem: "Não foi possível salvar." }, { status: 500 }); }
}
