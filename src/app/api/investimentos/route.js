import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/auth";
import { calcularPosicao, TIPOS_RENDA_FIXA } from "@/lib/investimentos";

const TIPOS = new Set(["RENDA_FIXA", "TESOURO_PREFIXADO", "TESOURO_SELIC", "TESOURO_IPCA", "ACAO", "ETF", "FII", "DOLAR", "CRIPTO", "OUTRO"]);
const MOEDAS = new Set(["BRL", "USD", "EUR", "GBP", "BTC", "USDT"]);
const idDoBanco = (value) => /^\d+$/.test(String(value ?? "")) ? BigInt(value) : null;
const numeroOpcional = (value) => value === "" || value === null || value === undefined ? null : Number(value);
const dataValida = (value) => {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const data = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(data.valueOf()) && data.toISOString().slice(0, 10) === value;
};
const dataUtc = (value) => value ? new Date(`${value}T00:00:00.000Z`) : null;
const arredondar = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

export async function GET() {
  const sessionId = await currentUserId();
  if (!sessionId) return NextResponse.json({ mensagem: "Faça login para abrir o Modo Banco." }, { status: 401 });
  const userId = idDoBanco(sessionId);
  if (!userId) return NextResponse.json({ mensagem: "Sessão inválida." }, { status: 401 });
  try {
    const [ativos, operacoes] = await Promise.all([
      prisma.$queryRaw`SELECT cod_ativo,nome,tipo,ticker,moeda,percentual_cdi,taxa_anual,data_aplicacao,data_vencimento,cotacao_atual,cambio_brl,saldo_atual FROM ativos_investimento WHERE cod_usuario=${userId} ORDER BY nome ASC,cod_ativo ASC`,
      prisma.$queryRaw`SELECT cod_operacao,cod_ativo,tipo,quantidade,preco_unitario,cambio_brl,custos,data_operacao,descricao FROM operacoes_investimento WHERE cod_usuario=${userId} ORDER BY data_operacao ASC,cod_operacao ASC`,
    ]);
    const porAtivo = new Map();
    for (const operacao of operacoes) {
      const key = String(operacao.cod_ativo);
      if (!porAtivo.has(key)) porAtivo.set(key, []);
      porAtivo.get(key).push(operacao);
    }
    const carteira = ativos.map((ativo) => {
      const historico = porAtivo.get(String(ativo.cod_ativo)) ?? [];
      const posicao = calcularPosicao(historico);
      const rendaFixa = TIPOS_RENDA_FIXA.has(ativo.tipo);
      const valorAtual = rendaFixa
        ? Number(ativo.saldo_atual)
        : posicao.quantidade * Number(ativo.cotacao_atual) * Number(ativo.cambio_brl);
      const resultadoAberto = valorAtual - posicao.custo;
      const resultadoTotal = resultadoAberto + posicao.resultadoRealizado;
      return {
        cod_ativo: String(ativo.cod_ativo), nome: ativo.nome, tipo: ativo.tipo,
        ticker: ativo.ticker, moeda: ativo.moeda,
        percentual_cdi: ativo.percentual_cdi === null ? null : Number(ativo.percentual_cdi),
        taxa_anual: ativo.taxa_anual === null ? null : Number(ativo.taxa_anual),
        data_aplicacao: ativo.data_aplicacao, data_vencimento: ativo.data_vencimento,
        cotacao_atual: Number(ativo.cotacao_atual), cambio_brl: Number(ativo.cambio_brl),
        quantidade: posicao.quantidade, custo: arredondar(posicao.custo),
        valor_atual: arredondar(valorAtual), resultado_aberto: arredondar(resultadoAberto),
        resultado_realizado: arredondar(posicao.resultadoRealizado), resultado_total: arredondar(resultadoTotal),
        retorno_percentual: posicao.custo > 0 ? arredondar((resultadoTotal / posicao.custo) * 100) : 0,
        preco_medio: posicao.quantidade > 0 ? posicao.custo / posicao.quantidade : 0,
        operacoes: historico.slice(-20).reverse().map((op) => ({
          cod_operacao: String(op.cod_operacao), tipo: op.tipo,
          quantidade: Number(op.quantidade), preco_unitario: Number(op.preco_unitario),
          cambio_brl: Number(op.cambio_brl), custos: Number(op.custos), data_operacao: op.data_operacao,
          descricao: op.descricao,
          valor_reais: arredondar(Number(op.quantidade) * Number(op.preco_unitario) * Number(op.cambio_brl)),
        })),
      };
    });
    const resumo = carteira.reduce((acc, item) => ({
      valor_atual: acc.valor_atual + item.valor_atual,
      investido: acc.investido + item.custo,
      resultado_total: acc.resultado_total + item.resultado_total,
    }), { valor_atual: 0, investido: 0, resultado_total: 0 });
    resumo.retorno_percentual = resumo.investido > 0 ? arredondar((resumo.resultado_total / resumo.investido) * 100) : 0;
    return NextResponse.json({ carteira, resumo });
  } catch (error) {
    console.error("Falha ao consultar carteira de investimentos:", error);
    return NextResponse.json({ mensagem: "Não foi possível carregar sua carteira." }, { status: 500 });
  }
}

export async function POST(request) {
  const sessionId = await currentUserId();
  if (!sessionId) return NextResponse.json({ mensagem: "Faça login para continuar." }, { status: 401 });
  const userId = idDoBanco(sessionId);
  if (!userId) return NextResponse.json({ mensagem: "Sessão inválida." }, { status: 401 });
  const body = await request.json();
  const nome = String(body.nome ?? "").trim();
  const tipo = body.tipo;
  const moeda = tipo === "DOLAR" ? "USD" : body.moeda || "BRL";
  const percentualCdi = numeroOpcional(body.percentual_cdi);
  const taxaAnual = numeroOpcional(body.taxa_anual);
  const valorInicial = Number(body.valor_inicial || 0);
  const quantidadeInicial = Number(body.quantidade_inicial || 0);
  const precoInicial = Number(body.preco_inicial || 0);
  const cambioInicial = Number(body.cambio_brl || 1);
  const custosIniciais = Number(body.custos_iniciais || 0);
  const inicio = body.data_aplicacao || null;
  const vencimento = body.data_vencimento || null;
  const fixa = TIPOS_RENDA_FIXA.has(tipo);
  const temAplicacaoInicial = fixa ? valorInicial > 0 : quantidadeInicial > 0;
  if (!nome || nome.length > 150 || !TIPOS.has(tipo) || !MOEDAS.has(moeda)
    || (percentualCdi !== null && (!Number.isFinite(percentualCdi) || percentualCdi < 0))
    || (taxaAnual !== null && (!Number.isFinite(taxaAnual) || taxaAnual < 0))
    || !Number.isFinite(valorInicial) || valorInicial < 0
    || !Number.isFinite(quantidadeInicial) || quantidadeInicial < 0
    || !Number.isFinite(precoInicial) || precoInicial < 0
    || !Number.isFinite(cambioInicial) || cambioInicial <= 0
    || !Number.isFinite(custosIniciais) || custosIniciais < 0
    || (temAplicacaoInicial && !fixa && (precoInicial <= 0 || custosIniciais >= quantidadeInicial * precoInicial * cambioInicial))
    || (temAplicacaoInicial && fixa && custosIniciais >= valorInicial)
    || !dataValida(inicio) || !dataValida(vencimento)
    || (inicio && vencimento && vencimento < inicio))
    return NextResponse.json({ mensagem: "Confira os dados do ativo e da aplicação inicial." }, { status: 400 });
  if (fixa && !["BRL"].includes(moeda))
    return NextResponse.json({ mensagem: "Ativos de renda fixa devem ser registrados em reais." }, { status: 400 });
  try {
    const ativo = await prisma.$transaction(async (tx) => {
      const saldoInicial = fixa && temAplicacaoInicial ? valorInicial - custosIniciais : 0;
      const cotacao = !fixa && temAplicacaoInicial ? precoInicial : 0;
      const rows = await tx.$queryRaw`INSERT INTO ativos_investimento
        (cod_usuario,nome,tipo,ticker,moeda,percentual_cdi,taxa_anual,data_aplicacao,data_vencimento,cotacao_atual,cambio_brl,saldo_atual)
        VALUES (${userId},${nome},${tipo},${String(body.ticker ?? "").trim() || null},${moeda},${percentualCdi},${taxaAnual},${dataUtc(inicio)},${dataUtc(vencimento)},${cotacao},${cambioInicial},${saldoInicial})
        RETURNING cod_ativo`;
      const ativoId = rows[0].cod_ativo;
      if (temAplicacaoInicial) {
        const quantidade = fixa ? valorInicial : quantidadeInicial;
        const preco = fixa ? 1 : precoInicial;
        const cambio = fixa ? 1 : cambioInicial;
        const dataOperacao = dataUtc(inicio) ?? new Date();
        await tx.$executeRaw`INSERT INTO operacoes_investimento
          (cod_usuario,cod_ativo,tipo,quantidade,preco_unitario,cambio_brl,custos,data_operacao,descricao)
          VALUES (${userId},${ativoId},${fixa ? "APORTE" : "COMPRA"},${quantidade},${preco},${cambio},${custosIniciais},${dataOperacao},'Aplicação inicial')`;
      }
      return { cod_ativo: String(ativoId) };
    });
    return NextResponse.json({ mensagem: "Ativo adicionado à carteira.", ativo }, { status: 201 });
  } catch (error) {
    console.error("Falha ao adicionar ativo à carteira:", error);
    return NextResponse.json({ mensagem: "Não foi possível adicionar o ativo." }, { status: 500 });
  }
}

export async function PATCH(request) {
  const sessionId = await currentUserId();
  if (!sessionId) return NextResponse.json({ mensagem: "Faça login para continuar." }, { status: 401 });
  const userId = idDoBanco(sessionId);
  const body = await request.json();
  const ativoId = idDoBanco(body.cod_ativo);
  if (!userId || !ativoId) return NextResponse.json({ mensagem: "Ativo inválido." }, { status: 400 });
  try {
    const atual = await prisma.$queryRaw`SELECT tipo FROM ativos_investimento WHERE cod_usuario=${userId} AND cod_ativo=${ativoId}`;
    if (!atual.length) return NextResponse.json({ mensagem: "Ativo não encontrado." }, { status: 404 });
    let count;
    if (TIPOS_RENDA_FIXA.has(atual[0].tipo)) {
      const saldo = Number(body.saldo_atual);
      if (!Number.isFinite(saldo) || saldo < 0) return NextResponse.json({ mensagem: "Informe um saldo válido." }, { status: 400 });
      count = await prisma.$executeRaw`UPDATE ativos_investimento SET saldo_atual=${saldo} WHERE cod_usuario=${userId} AND cod_ativo=${ativoId}`;
    } else {
      const cotacao = Number(body.cotacao_atual);
      const cambio = Number(body.cambio_brl);
      if (!Number.isFinite(cotacao) || cotacao < 0 || !Number.isFinite(cambio) || cambio <= 0)
        return NextResponse.json({ mensagem: "Informe uma cotação e um câmbio válidos." }, { status: 400 });
      count = await prisma.$executeRaw`UPDATE ativos_investimento SET cotacao_atual=${cotacao},cambio_brl=${cambio} WHERE cod_usuario=${userId} AND cod_ativo=${ativoId}`;
    }
    return count ? NextResponse.json({ mensagem: "Valor atualizado." }) : NextResponse.json({ mensagem: "Ativo não encontrado." }, { status: 404 });
  } catch (error) {
    console.error("Falha ao atualizar ativo:", error);
    return NextResponse.json({ mensagem: "Não foi possível atualizar o valor." }, { status: 500 });
  }
}
