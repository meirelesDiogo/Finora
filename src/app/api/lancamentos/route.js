import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/auth";
import { TIPOS_RENDA_FIXA } from "@/lib/investimentos";

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
    await prisma.$executeRaw`INSERT INTO categorias(cod_usuario,nome,tipo)
      VALUES (${userId},'Investimento','DESPESA')
      ON CONFLICT (cod_usuario,nome,tipo) DO NOTHING`;
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
    select: { cod_categoria: true, nome: true, tipo: true },
  });
  if (!categoria) return null;
  if (!formulario.projetoId) return categoria;
  const projeto = await tx.projetos.findFirst({
    where: { cod_usuario: userId, cod_projeto: formulario.projetoId },
    select: { cod_projeto: true },
  });
  return projeto ? categoria : null;
}

export async function POST(request) {
  const sessionId = await currentUserId();
  if (!sessionId) return NextResponse.json({ mensagem: "Faça login para continuar." }, { status: 401 });
  const userId = idDoBanco(sessionId);
  const body = await request.json();
  const formulario = validarFormulario(body);
  if (!userId || !formulario) return NextResponse.json({ mensagem: "Confira os dados do lançamento." }, { status: 400 });
  const investimento = body.investimento && typeof body.investimento === "object" ? body.investimento : null;
  try {
    const criado = await prisma.$transaction(async (tx) => {
      const categoria = await conferirVinculos(tx, userId, formulario);
      if (!categoria) return { erro: "Categoria ou projeto inválido.", status: 400 };
      const eInvestimento = categoria.nome === "Investimento" && categoria.tipo === "DESPESA";
      if (eInvestimento !== Boolean(investimento))
        return { erro: eInvestimento ? "Selecione o ativo que receberá este investimento." : "O detalhe de investimento só pode ser usado com a categoria Investimento.", status: 400 };

      let operacao = null;
      if (investimento) {
        const ativoId = idDoBanco(investimento.cod_ativo);
        const quantidade = Number(investimento.quantidade);
        const precoInformado = Number(investimento.preco_unitario || 1);
        const cambioInformado = Number(investimento.cambio_brl || 1);
        const custos = Number(investimento.custos || 0);
        if (!ativoId || !Number.isFinite(quantidade) || quantidade <= 0
          || !Number.isFinite(precoInformado) || precoInformado <= 0
          || !Number.isFinite(cambioInformado) || cambioInformado <= 0
          || !Number.isFinite(custos) || custos < 0)
          return { erro: "Confira os dados da aplicação.", status: 400 };

        const ativos = await tx.$queryRawUnsafe(
          "SELECT tipo FROM ativos_investimento WHERE cod_usuario=$1 AND cod_ativo=$2 FOR UPDATE",
          userId, ativoId,
        );
        if (!ativos.length) return { erro: "Selecione um investimento válido da sua carteira.", status: 400 };
        const rendaFixa = TIPOS_RENDA_FIXA.has(ativos[0].tipo);
        const preco = rendaFixa ? 1 : precoInformado;
        const cambio = rendaFixa ? 1 : cambioInformado;
        const valorEsperado = Math.round(((quantidade * preco * cambio) + custos + Number.EPSILON) * 100) / 100;
        if (Math.abs(formulario.valor - valorEsperado) > 0.01)
          return { erro: "O valor da despesa precisa corresponder ao valor aplicado mais os custos.", status: 400 };
        operacao = { ativoId, tipo: rendaFixa ? "APORTE" : "COMPRA", quantidade, preco, cambio, custos, rendaFixa };
      }

      const lancamento = await tx.lancamentos.create({ data: {
        cod_usuario: userId, cod_categoria: formulario.categoriaId, cod_projeto: formulario.projetoId,
        descricao: formulario.descricao, valor: formulario.valor, tipo: formulario.tipo,
        data_lancamento: formulario.data,
      } });
      if (operacao) {
        await tx.$executeRawUnsafe(
          "INSERT INTO operacoes_investimento(cod_usuario,cod_lancamento,cod_ativo,tipo,quantidade,preco_unitario,cambio_brl,custos,data_operacao,descricao) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
          userId, lancamento.cod_lancamento, operacao.ativoId, operacao.tipo, operacao.quantidade, operacao.preco, operacao.cambio,
          operacao.custos, formulario.data, formulario.descricao,
        );
        if (operacao.rendaFixa) {
          await tx.$executeRawUnsafe(
            "UPDATE ativos_investimento SET saldo_atual=saldo_atual+$1 WHERE cod_usuario=$2 AND cod_ativo=$3",
            operacao.quantidade, userId, operacao.ativoId,
          );
        } else {
          await tx.$executeRawUnsafe(
            "UPDATE ativos_investimento SET cotacao_atual=$1,cambio_brl=$2 WHERE cod_usuario=$3 AND cod_ativo=$4",
            operacao.preco, operacao.cambio, userId, operacao.ativoId,
          );
        }
      }
      return { lancamento };
    });
    if (criado.erro) return NextResponse.json({ mensagem: criado.erro }, { status: criado.status });
    return NextResponse.json({ mensagem: investimento ? "Despesa e aplicação registradas na carteira." : "Lançamento registrado." }, { status: 201 });
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
    const removido = await prisma.$transaction(async (tx) => {
      const lancamento = await tx.lancamentos.findFirst({
        where: { cod_usuario: userId, cod_lancamento: lancamentoId },
        select: { cod_lancamento: true },
      });
      if (!lancamento) return false;
      const operacoes = await tx.$queryRawUnsafe(
        "SELECT o.cod_ativo,o.tipo,o.quantidade,a.tipo AS tipo_ativo FROM operacoes_investimento o JOIN ativos_investimento a ON a.cod_usuario=o.cod_usuario AND a.cod_ativo=o.cod_ativo WHERE o.cod_lancamento=$1 AND o.cod_usuario=$2 FOR UPDATE OF a",
        lancamentoId, userId,
      );
      for (const operacao of operacoes) {
        if (operacao.tipo === "APORTE" && TIPOS_RENDA_FIXA.has(operacao.tipo_ativo)) {
          await tx.$executeRawUnsafe(
            "UPDATE ativos_investimento SET saldo_atual=GREATEST(0,saldo_atual-$1) WHERE cod_usuario=$2 AND cod_ativo=$3",
            Number(operacao.quantidade), userId, operacao.cod_ativo,
          );
        }
      }
      await tx.lancamentos.deleteMany({ where: { cod_usuario: userId, cod_lancamento: lancamentoId } });
      return true;
    });
    return removido
      ? NextResponse.json({ mensagem: "Lançamento removido e carteira atualizada." })
      : NextResponse.json({ mensagem: "Lançamento não encontrado." }, { status: 404 });
  } catch (error) {
    return responderErroBanco(error, "Falha ao excluir lançamento:");
  }
}
