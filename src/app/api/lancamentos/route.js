import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/auth";

const idDoBanco = (value) => /^\d+$/.test(String(value ?? "")) ? BigInt(value) : null;
const dataValida = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ""))) return false;
  const data = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(data.valueOf()) && data.toISOString().slice(0, 10) === value;
};
const dataUtc = (value) => new Date(`${value}T00:00:00.000Z`);
const responderErroBanco = (error, mensagem) => {
  console.error(mensagem, error);
  return NextResponse.json({ mensagem }, { status: 500 });
};

export async function GET(request) {
  const sessionId = await currentUserId();
  if (!sessionId) return NextResponse.json({ mensagem: "Faça login para continuar." }, { status: 401 });
  const userId = idDoBanco(sessionId);
  if (!userId) return NextResponse.json({ mensagem: "Sessão inválida." }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const mes = Number(searchParams.get("mes")) || new Date().getMonth() + 1;
  const ano = Number(searchParams.get("ano")) || new Date().getFullYear();
  if (mes < 1 || mes > 12 || ano < 1900 || ano > 2100)
    return NextResponse.json({ mensagem: "Período inválido." }, { status: 400 });
  const inicio = new Date(Date.UTC(ano, mes - 1, 1));
  const fim = new Date(Date.UTC(ano, mes, 1));

  try {
    const where = { cod_usuario: userId, data_lancamento: { gte: inicio, lt: fim } };
    const [lancamentos, categorias, projetos, receitas, despesas] = await Promise.all([
      prisma.lancamentos.findMany({
        where,
        include: { categoria: { select: { nome: true } }, projeto: { select: { nome: true } } },
        orderBy: [{ data_lancamento: "desc" }, { cod_lancamento: "desc" }],
        take: 1000,
      }),
      prisma.categorias.findMany({ where: { cod_usuario: userId }, select: { cod_categoria: true, nome: true, tipo: true }, orderBy: [{ tipo: "asc" }, { nome: "asc" }] }),
      prisma.projetos.findMany({ where: { cod_usuario: userId }, select: { cod_projeto: true, nome: true }, orderBy: { nome: "asc" } }),
      prisma.lancamentos.aggregate({ where: { ...where, tipo: "RECEITA" }, _sum: { valor: true } }),
      prisma.lancamentos.aggregate({ where: { ...where, tipo: "DESPESA" }, _sum: { valor: true } }),
    ]);
    return NextResponse.json({
      lancamentos: lancamentos.map((item) => ({
        cod_lancamento: String(item.cod_lancamento), descricao: item.descricao,
        valor: Number(item.valor), tipo: item.tipo, data_lancamento: item.data_lancamento,
        categoria: item.categoria.nome, projeto: item.projeto?.nome ?? null,
      })),
      categorias: categorias.map((item) => ({ ...item, cod_categoria: String(item.cod_categoria) })),
      projetos: projetos.map((item) => ({ ...item, cod_projeto: String(item.cod_projeto) })),
      totais: { receitas: Number(receitas._sum.valor ?? 0), despesas: Number(despesas._sum.valor ?? 0) },
    });
  } catch (error) {
    return responderErroBanco(error, "Falha ao consultar lançamentos:");
  }
}

function validarFormulario(body) {
  const descricao = String(body.descricao ?? "").trim();
  const valor = Number(body.valor);
  const categoriaId = idDoBanco(body.categoria);
  const projetoId = body.projeto ? idDoBanco(body.projeto) : null;
  const tipo = body.tipo;
  const data = body.data;
  if (!descricao || descricao.length > 255 || !Number.isFinite(valor) || valor <= 0
    || !categoriaId || (body.projeto && !projetoId)
    || !["RECEITA", "DESPESA"].includes(tipo) || !dataValida(data)) return null;
  return { descricao, valor, categoriaId, projetoId, tipo, data: dataUtc(data) };
}

async function conferirVinculos(tx, userId, formulario) {
  const categoria = await tx.categorias.findFirst({
    where: { cod_usuario: userId, cod_categoria: formulario.categoriaId, tipo: formulario.tipo },
    select: { cod_categoria: true },
  });
  if (!categoria) return false;
  if (!formulario.projetoId) return true;
  const projeto = await tx.projetos.findFirst({
    where: { cod_usuario: userId, cod_projeto: formulario.projetoId },
    select: { cod_projeto: true },
  });
  return Boolean(projeto);
}

export async function POST(request) {
  const sessionId = await currentUserId();
  if (!sessionId) return NextResponse.json({ mensagem: "Faça login para continuar." }, { status: 401 });
  const userId = idDoBanco(sessionId);
  const formulario = validarFormulario(await request.json());
  if (!userId || !formulario) return NextResponse.json({ mensagem: "Confira os dados do lançamento." }, { status: 400 });
  try {
    const criado = await prisma.$transaction(async (tx) => {
      if (!(await conferirVinculos(tx, userId, formulario))) return null;
      return tx.lancamentos.create({ data: {
        cod_usuario: userId, cod_categoria: formulario.categoriaId, cod_projeto: formulario.projetoId,
        descricao: formulario.descricao, valor: formulario.valor, tipo: formulario.tipo,
        data_lancamento: formulario.data,
      } });
    });
    if (!criado) return NextResponse.json({ mensagem: "Categoria ou projeto inválido." }, { status: 400 });
    return NextResponse.json({ mensagem: "Lançamento registrado." }, { status: 201 });
  } catch (error) {
    return responderErroBanco(error, "Falha ao registrar lançamento:");
  }
}

export async function PUT(request) {
  const sessionId = await currentUserId();
  if (!sessionId) return NextResponse.json({ mensagem: "Faça login para continuar." }, { status: 401 });
  const userId = idDoBanco(sessionId);
  const body = await request.json();
  const lancamentoId = idDoBanco(body.id);
  const formulario = validarFormulario(body);
  if (!userId || !lancamentoId || !formulario) return NextResponse.json({ mensagem: "Confira os dados do lançamento." }, { status: 400 });
  try {
    const atualizado = await prisma.$transaction(async (tx) => {
      if (!(await conferirVinculos(tx, userId, formulario))) return 0;
      const result = await tx.lancamentos.updateMany({
        where: { cod_usuario: userId, cod_lancamento: lancamentoId },
        data: {
          cod_categoria: formulario.categoriaId, cod_projeto: formulario.projetoId,
          descricao: formulario.descricao, valor: formulario.valor, tipo: formulario.tipo,
          data_lancamento: formulario.data,
        },
      });
      return result.count;
    });
    if (!atualizado) return NextResponse.json({ mensagem: "Lançamento, categoria ou projeto não encontrado." }, { status: 404 });
    return NextResponse.json({ mensagem: "Lançamento atualizado." });
  } catch (error) {
    return responderErroBanco(error, "Falha ao atualizar lançamento:");
  }
}

export async function DELETE(request) {
  const sessionId = await currentUserId();
  if (!sessionId) return NextResponse.json({ mensagem: "Faça login para continuar." }, { status: 401 });
  const userId = idDoBanco(sessionId);
  const lancamentoId = idDoBanco(new URL(request.url).searchParams.get("id"));
  if (!userId || !lancamentoId) return NextResponse.json({ mensagem: "Lançamento inválido." }, { status: 400 });
  try {
    const result = await prisma.lancamentos.deleteMany({ where: { cod_usuario: userId, cod_lancamento: lancamentoId } });
    return result.count
      ? NextResponse.json({ mensagem: "Lançamento removido." })
      : NextResponse.json({ mensagem: "Lançamento não encontrado." }, { status: 404 });
  } catch (error) {
    return responderErroBanco(error, "Falha ao excluir lançamento:");
  }
}
