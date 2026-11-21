import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { currentUserId } from "@/lib/auth";

export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ mensagem: "Faça login para continuar." }, { status: 401 });
  const [mensal,categorias,projetos] = await Promise.all([
    pool.query(`WITH meses AS (SELECT generate_series(date_trunc('month',CURRENT_DATE)-interval '5 months',date_trunc('month',CURRENT_DATE),interval '1 month')::date AS inicio) SELECT to_char(m.inicio,'YYYY-MM') AS periodo,COALESCE(SUM(l.valor) FILTER(WHERE l.tipo='RECEITA'),0)::float AS receitas,COALESCE(SUM(l.valor) FILTER(WHERE l.tipo='DESPESA'),0)::float AS despesas FROM meses m LEFT JOIN lancamentos l ON l.cod_usuario=$1 AND l.data_lancamento>=m.inicio AND l.data_lancamento<(m.inicio+interval '1 month') GROUP BY m.inicio ORDER BY m.inicio`, [userId]),
    pool.query("SELECT c.nome,COALESCE(SUM(l.valor),0)::float AS total,COUNT(l.cod_lancamento)::int AS quantidade FROM categorias c LEFT JOIN lancamentos l ON l.cod_usuario=c.cod_usuario AND l.cod_categoria=c.cod_categoria AND l.tipo='DESPESA' AND date_trunc('month',l.data_lancamento)=date_trunc('month',CURRENT_DATE) WHERE c.cod_usuario=$1 AND c.tipo='DESPESA' GROUP BY c.cod_categoria ORDER BY total DESC", [userId]),
    pool.query("SELECT p.nome,COALESCE(SUM(l.valor) FILTER(WHERE l.tipo='RECEITA'),0)::float AS receitas,COALESCE(SUM(l.valor) FILTER(WHERE l.tipo='DESPESA'),0)::float AS despesas FROM projetos p LEFT JOIN lancamentos l ON l.cod_usuario=p.cod_usuario AND l.cod_projeto=p.cod_projeto WHERE p.cod_usuario=$1 GROUP BY p.cod_projeto ORDER BY p.nome", [userId]),
  ]);
  return NextResponse.json({ mensal:mensal.rows, categorias:categorias.rows, projetos:projetos.rows });
}
