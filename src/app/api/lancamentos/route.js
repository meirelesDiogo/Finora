import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { currentUserId } from "@/lib/auth";

export async function GET(request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ mensagem: "Faça login para continuar." }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const mes = Number(searchParams.get("mes")) || new Date().getMonth() + 1;
  const ano = Number(searchParams.get("ano")) || new Date().getFullYear();
  const [lancamentos, categorias, projetos, totais] = await Promise.all([
    pool.query("SELECT l.cod_lancamento,l.descricao,l.valor::float,l.tipo,l.data_lancamento,c.nome AS categoria,p.nome AS projeto FROM lancamentos l JOIN categorias c USING(cod_categoria) LEFT JOIN projetos p USING(cod_projeto) WHERE l.cod_usuario=$1 AND EXTRACT(MONTH FROM l.data_lancamento)=$2 AND EXTRACT(YEAR FROM l.data_lancamento)=$3 ORDER BY l.data_lancamento DESC,l.cod_lancamento DESC", [userId, mes, ano]),
    pool.query("SELECT cod_categoria,nome,tipo FROM categorias WHERE cod_usuario=$1 ORDER BY tipo,nome", [userId]),
    pool.query("SELECT cod_projeto,nome FROM projetos WHERE cod_usuario=$1 ORDER BY nome", [userId]),
    pool.query("SELECT COALESCE(SUM(valor) FILTER(WHERE tipo='RECEITA'),0)::float receitas,COALESCE(SUM(valor) FILTER(WHERE tipo='DESPESA'),0)::float despesas FROM lancamentos WHERE cod_usuario=$1 AND EXTRACT(MONTH FROM data_lancamento)=$2 AND EXTRACT(YEAR FROM data_lancamento)=$3", [userId, mes, ano]),
  ]);
  return NextResponse.json({ lancamentos: lancamentos.rows, categorias: categorias.rows, projetos: projetos.rows, totais: totais.rows[0] });
}

export async function POST(request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ mensagem: "Faça login para continuar." }, { status: 401 });
  const body = await request.json();
  const descricao = String(body.descricao || "").trim();
  const valor = Number(body.valor);
  const tipo = body.tipo;
  const data = body.data;
  const categoria = Number(body.categoria);
  const projeto = body.projeto ? Number(body.projeto) : null;
  if (!descricao || descricao.length > 255 || !Number.isFinite(valor) || valor <= 0 || !["RECEITA", "DESPESA"].includes(tipo) || !/^\d{4}-\d{2}-\d{2}$/.test(data || "") || !Number.isInteger(categoria))
    return NextResponse.json({ mensagem: "Confira os dados do lançamento." }, { status: 400 });
  try {
    const result = await pool.query("INSERT INTO lancamentos(cod_usuario,cod_categoria,cod_projeto,descricao,valor,tipo,data_lancamento) SELECT $1,c.cod_categoria,p.cod_projeto,$4,$5,$6,$7 FROM categorias c LEFT JOIN projetos p ON p.cod_usuario=$1 AND p.cod_projeto=$3 WHERE c.cod_usuario=$1 AND c.cod_categoria=$2 AND c.tipo=$6 AND ($3::bigint IS NULL OR p.cod_projeto IS NOT NULL) RETURNING cod_lancamento", [userId,categoria,projeto,descricao,valor,tipo,data]);
    if (!result.rowCount) return NextResponse.json({ mensagem: "Categoria ou projeto inválido." }, { status: 400 });
    return NextResponse.json({ mensagem: "Lançamento registrado." }, { status: 201 });
  } catch (error) { console.error(error); return NextResponse.json({ mensagem: "Não foi possível salvar o lançamento." }, { status: 500 }); }
}

export async function DELETE(request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ mensagem: "Faça login para continuar." }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  const result = await pool.query("DELETE FROM lancamentos WHERE cod_usuario=$1 AND cod_lancamento=$2", [userId,id]);
  return result.rowCount ? NextResponse.json({ mensagem: "Lançamento removido." }) : NextResponse.json({ mensagem: "Lançamento não encontrado." }, { status: 404 });
}
