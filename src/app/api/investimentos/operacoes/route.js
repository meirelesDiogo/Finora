import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/auth";
import { calcularPosicao, TIPOS_RENDA_FIXA } from "@/lib/investimentos";

const idDoBanco = (value) => /^\d+$/.test(String(value ?? "")) ? BigInt(value) : null;
const dataValida = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ""))) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
};

export async function POST(request) {
  const sessionId = await currentUserId();
  if (!sessionId) return NextResponse.json({ mensagem: "Faça login para continuar." }, { status: 401 });
  const userId = idDoBanco(sessionId);
  const body = await request.json();
  const ativoId = idDoBanco(body.cod_ativo);
  const tipo = body.tipo;
  const quantidade = Number(body.quantidade);
  const precoInformado = Number(body.preco_unitario || 1);
  const cambioInformado = Number(body.cambio_brl || 1);
  const custos = Number(body.custos || 0);
  const data = body.data_operacao;
  const descricao = String(body.descricao ?? "").trim() || null;
  if (!userId || !ativoId || !Number.isFinite(quantidade) || quantidade <= 0
    || !Number.isFinite(precoInformado) || precoInformado <= 0
    || !Number.isFinite(cambioInformado) || cambioInformado <= 0
    || !Number.isFinite(custos) || custos < 0 || !dataValida(data)
    || (descricao && descricao.length > 255))
    return NextResponse.json({ mensagem: "Confira os dados da operação." }, { status: 400 });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const ativos = await tx.$queryRaw`SELECT tipo,saldo_atual FROM ativos_investimento WHERE cod_usuario=${userId} AND cod_ativo=${ativoId} FOR UPDATE`;
      if (!ativos.length) return { erro: "Ativo não encontrado.", status: 404 };
      const rendaFixa = TIPOS_RENDA_FIXA.has(ativos[0].tipo);
      const compra = rendaFixa ? tipo === "APORTE" : tipo === "COMPRA";
      const venda = rendaFixa ? tipo === "RESGATE" : tipo === "VENDA";
      if (!compra && !venda) return { erro: "Tipo de operação incompatível com este ativo.", status: 400 };

      const operacoes = await tx.$queryRaw`SELECT tipo,quantidade,preco_unitario,cambio_brl,custos FROM operacoes_investimento WHERE cod_usuario=${userId} AND cod_ativo=${ativoId} ORDER BY data_operacao ASC,cod_operacao ASC`;
      const posicao = calcularPosicao(operacoes);
      const preco = rendaFixa ? 1 : precoInformado;
      const cambio = rendaFixa ? 1 : cambioInformado;
      const saldoAtual = Number(ativos[0].saldo_atual);
      if (venda && rendaFixa && quantidade + custos > saldoAtual + 0.000001)
        return { erro: "O resgate não pode ser maior que o saldo atual deste investimento.", status: 400 };
      if (venda && !rendaFixa && quantidade > posicao.quantidade + 0.00000001)
        return { erro: "A venda excede a quantidade disponível na carteira.", status: 400 };

      await tx.$executeRaw`INSERT INTO operacoes_investimento
        (cod_usuario,cod_ativo,tipo,quantidade,preco_unitario,cambio_brl,custos,data_operacao,descricao)
        VALUES (${userId},${ativoId},${tipo},${quantidade},${preco},${cambio},${custos},${new Date(`${data}T00:00:00.000Z`)},${descricao})`;
      if (rendaFixa) {
        const delta = compra ? quantidade * preco - custos : -(quantidade + custos);
        const novoSaldo = saldoAtual + delta;
        await tx.$executeRaw`UPDATE ativos_investimento SET saldo_atual=${novoSaldo} WHERE cod_usuario=${userId} AND cod_ativo=${ativoId}`;
      }
      return { erro: null };
    });
    if (result.erro) return NextResponse.json({ mensagem: result.erro }, { status: result.status });
    return NextResponse.json({ mensagem: "Operação registrada na carteira." }, { status: 201 });
  } catch (error) {
    console.error("Falha ao registrar operação de investimento:", error);
    return NextResponse.json({ mensagem: "Não foi possível registrar a operação." }, { status: 500 });
  }
}
