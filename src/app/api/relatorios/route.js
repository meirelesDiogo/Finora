import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/auth";

const idDoBanco = (value) => /^\d+$/.test(String(value ?? "")) ? BigInt(value) : null;

export async function GET(request) {
  const sessionId = await currentUserId();
  if (!sessionId) return NextResponse.json({ mensagem: "Faça login para continuar." }, { status: 401 });
  const userId = idDoBanco(sessionId);
  if (!userId) return NextResponse.json({ mensagem: "Sessão inválida." }, { status: 401 });
  const agora = new Date();
  const ano = Number(new URL(request.url).searchParams.get("ano")) || agora.getUTCFullYear();
  if (!Number.isInteger(ano) || ano < 1900 || ano > 2100)
    return NextResponse.json({ mensagem: "Ano inválido." }, { status: 400 });
  const inicioMes = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), 1));
  const fimMes = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth() + 1, 1));
  const inicioSeisMeses = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth() - 5, 1));
  const fimProximoMes = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth() + 1, 1));
  const inicioAno = new Date(Date.UTC(ano, 0, 1));
  const fimAno = new Date(Date.UTC(ano + 1, 0, 1));

  try {
    const [agrupadoPorDia, categorias, despesasPorCategoria, projetos, valoresPorProjeto, agrupadoAno, despesasPorCategoriaAno] = await Promise.all([
      prisma.lancamentos.groupBy({
        by: ["data_lancamento", "tipo"],
        where: { cod_usuario: userId, data_lancamento: { gte: inicioSeisMeses, lt: fimProximoMes } },
        _sum: { valor: true },
      }),
      prisma.categorias.findMany({ where: { cod_usuario: userId, tipo: "DESPESA" }, select: { cod_categoria: true, nome: true }, orderBy: { nome: "asc" } }),
      prisma.lancamentos.groupBy({
        by: ["cod_categoria"],
        where: { cod_usuario: userId, tipo: "DESPESA", data_lancamento: { gte: inicioMes, lt: fimMes } },
        _sum: { valor: true },
      }),
      prisma.$queryRawUnsafe("SELECT cod_projeto,nome,valor_meta FROM projetos WHERE cod_usuario=$1 ORDER BY nome ASC", userId),
      prisma.lancamentos.groupBy({
        by: ["cod_projeto", "tipo"],
        where: { cod_usuario: userId, cod_projeto: { not: null } },
        _sum: { valor: true },
      }),
      prisma.lancamentos.groupBy({
        by: ["data_lancamento", "tipo"],
        where: { cod_usuario: userId, data_lancamento: { gte: inicioAno, lt: fimAno } },
        _sum: { valor: true },
      }),
      prisma.lancamentos.groupBy({
        by: ["cod_categoria"],
        where: { cod_usuario: userId, tipo: "DESPESA", data_lancamento: { gte: inicioAno, lt: fimAno } },
        _sum: { valor: true },
      }),
    ]);

    const mensalPorChave = new Map();
    for (let index = 0; index < 6; index += 1) {
      const mes = new Date(Date.UTC(inicioSeisMeses.getUTCFullYear(), inicioSeisMeses.getUTCMonth() + index, 1));
      const periodo = `${mes.getUTCFullYear()}-${String(mes.getUTCMonth() + 1).padStart(2, "0")}`;
      mensalPorChave.set(periodo, { periodo, receitas: 0, despesas: 0 });
    }
    for (const item of agrupadoPorDia) {
      const data = item.data_lancamento;
      const periodo = `${data.getUTCFullYear()}-${String(data.getUTCMonth() + 1).padStart(2, "0")}`;
      const resumo = mensalPorChave.get(periodo);
      if (resumo) resumo[item.tipo === "RECEITA" ? "receitas" : "despesas"] += Number(item._sum.valor ?? 0);
    }
    const totaisCategorias = new Map(despesasPorCategoria.map((item) => [String(item.cod_categoria), Number(item._sum.valor ?? 0)]));
    const mensalAnual = Array.from({ length: 12 }, (_, index) => ({ mes: index + 1, receitas: 0, despesas: 0, saldo: 0 }));
    for (const item of agrupadoAno) {
      const mesIndex = item.data_lancamento.getUTCMonth();
      mensalAnual[mesIndex][item.tipo === "RECEITA" ? "receitas" : "despesas"] += Number(item._sum.valor ?? 0);
    }
    for (const item of mensalAnual) item.saldo = item.receitas - item.despesas;
    const totaisAnuais = mensalAnual.reduce((acc, item) => ({
      receitas: acc.receitas + item.receitas,
      despesas: acc.despesas + item.despesas,
      saldo: acc.saldo + item.saldo,
    }), { receitas: 0, despesas: 0, saldo: 0 });
    const totaisCategoriasAnuais = new Map(despesasPorCategoriaAno.map((item) => [String(item.cod_categoria), Number(item._sum.valor ?? 0)]));

    return NextResponse.json({
      anual: {
        ano,
        ...totaisAnuais,
        mensal: mensalAnual,
        categorias: categorias.map((item) => ({ nome: item.nome, total: totaisCategoriasAnuais.get(String(item.cod_categoria)) ?? 0 }))
          .filter((item) => item.total > 0).sort((a, b) => b.total - a.total),
      },
      mensal: [...mensalPorChave.values()],
      categorias: categorias.map((item) => ({ nome: item.nome, total: totaisCategorias.get(String(item.cod_categoria)) ?? 0 })),
      projetos: projetos.map((item) => {
        const valores = valoresPorProjeto.filter((row) => row.cod_projeto === item.cod_projeto);
        const receitas = Number(valores.find((row) => row.tipo === "RECEITA")?._sum.valor ?? 0);
        const despesas = Number(valores.find((row) => row.tipo === "DESPESA")?._sum.valor ?? 0);
        const meta = Number(item.valor_meta);
        const valorGuardado = Math.max(0, receitas - despesas);
        return {
          nome: item.nome,
          receitas, despesas, valor_meta: meta, valor_guardado: valorGuardado,
          progresso: meta > 0 ? Math.min(100, (valorGuardado / meta) * 100) : 0,
        };
      }),
    });
  } catch (error) {
    console.error("Falha ao consultar relatórios:", error);
    return NextResponse.json({ mensagem: "Não foi possível carregar os relatórios." }, { status: 500 });
  }
}
