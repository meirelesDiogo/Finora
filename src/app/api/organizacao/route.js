import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { currentUserId } from "@/lib/auth";

export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ mensagem: "Faça login para continuar." }, { status: 401 });
  const [categorias, projetos] = await Promise.all([
    pool.query("SELECT c.cod_categoria,c.nome,c.tipo,COUNT(l.cod_lancamento)::int AS lancamentos FROM categorias c LEFT JOIN lancamentos l ON l.cod_usuario=c.cod_usuario AND l.cod_categoria=c.cod_categoria WHERE c.cod_usuario=$1 GROUP BY c.cod_categoria ORDER BY c.tipo,c.nome", [userId]),
    pool.query("SELECT p.cod_projeto,p.nome,p.descricao,COUNT(l.cod_lancamento)::int AS lancamentos,COALESCE(SUM(l.valor) FILTER(WHERE l.tipo='RECEITA'),0)::float AS receitas,COALESCE(SUM(l.valor) FILTER(WHERE l.tipo='DESPESA'),0)::float AS despesas FROM projetos p LEFT JOIN lancamentos l ON l.cod_usuario=p.cod_usuario AND l.cod_projeto=p.cod_projeto WHERE p.cod_usuario=$1 GROUP BY p.cod_projeto ORDER BY p.nome", [userId]),
  ]);
  return NextResponse.json({ categorias: categorias.rows, projetos: projetos.rows });
}

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

export async function DELETE(request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ mensagem: "Faça login para continuar." }, { status: 401 });
  const params = new URL(request.url).searchParams;
  const tipo = params.get("tipo");
  const id = params.get("id");
  if (!/^\d+$/.test(id || "") || !["categoria", "projeto"].includes(tipo))
    return NextResponse.json({ mensagem: "Item inválido." }, { status: 400 });
  try {
    const result = tipo === "categoria"
      ? await pool.query("DELETE FROM categorias WHERE cod_usuario=$1 AND cod_categoria=$2", [userId,id])
      : await pool.query("DELETE FROM projetos WHERE cod_usuario=$1 AND cod_projeto=$2", [userId,id]);
    return result.rowCount
      ? NextResponse.json({ mensagem: "Item removido." })
      : NextResponse.json({ mensagem: "Item não encontrado." }, { status: 404 });
  } catch (error) {
    if (error.code === "23503") return NextResponse.json({ mensagem: "Este item já está ligado a lançamentos e não pode ser removido." }, { status: 409 });
    console.error("Falha ao remover item:", error);
    return NextResponse.json({ mensagem: "Não foi possível remover o item." }, { status: 500 });
  }
}
