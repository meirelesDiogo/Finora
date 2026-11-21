import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/auth";

const idDoBanco = (value) => /^\d+$/.test(String(value ?? "")) ? BigInt(value) : null;

export async function GET() {
  const sessionId = await currentUserId();
  if (!sessionId) return NextResponse.json({ mensagem: "Faça login para continuar." }, { status: 401 });
  const userId = idDoBanco(sessionId);
  if (!userId) return NextResponse.json({ mensagem: "Sessão inválida." }, { status: 401 });
  try {
    const [categorias, projetos, totais] = await Promise.all([
      prisma.categorias.findMany({
        where: { cod_usuario: userId },
        select: { cod_categoria: true, nome: true, tipo: true, _count: { select: { lancamentos: true } } },
        orderBy: [{ tipo: "asc" }, { nome: "asc" }],
      }),
      prisma.projetos.findMany({
        where: { cod_usuario: userId },
        select: { cod_projeto: true, nome: true, descricao: true, _count: { select: { lancamentos: true } } },
        orderBy: { nome: "asc" },
      }),
      prisma.lancamentos.groupBy({
        by: ["cod_projeto", "tipo"],
        where: { cod_usuario: userId, cod_projeto: { not: null } },
        _sum: { valor: true },
      }),
    ]);
    return NextResponse.json({
      categorias: categorias.map((item) => ({
        cod_categoria: String(item.cod_categoria), nome: item.nome, tipo: item.tipo,
        lancamentos: item._count.lancamentos,
      })),
      projetos: projetos.map((item) => {
        const valores = totais.filter((total) => total.cod_projeto === item.cod_projeto);
        return {
          cod_projeto: String(item.cod_projeto), nome: item.nome, descricao: item.descricao,
          lancamentos: item._count.lancamentos,
          receitas: Number(valores.find((total) => total.tipo === "RECEITA")?._sum.valor ?? 0),
          despesas: Number(valores.find((total) => total.tipo === "DESPESA")?._sum.valor ?? 0),
        };
      }),
    });
  } catch (error) {
    console.error("Falha ao consultar categorias e projetos:", error);
    return NextResponse.json({ mensagem: "Não foi possível carregar seus dados." }, { status: 500 });
  }
}

export async function POST(request) {
  const sessionId = await currentUserId();
  if (!sessionId) return NextResponse.json({ mensagem: "Faça login para continuar." }, { status: 401 });
  const userId = idDoBanco(sessionId);
  if (!userId) return NextResponse.json({ mensagem: "Sessão inválida." }, { status: 401 });
  const { tipo, nome, descricao } = await request.json();
  const clean = String(nome ?? "").trim();
  const projeto = tipo === "projeto";
  if (!clean || clean.length > (projeto ? 150 : 100) || (!projeto && !["RECEITA", "DESPESA"].includes(tipo)))
    return NextResponse.json({ mensagem: "Informe um nome e tipo válidos." }, { status: 400 });
  try {
    if (projeto) await prisma.projetos.create({ data: { cod_usuario: userId, nome: clean, descricao: String(descricao ?? "").trim() || null } });
    else await prisma.categorias.create({ data: { cod_usuario: userId, nome: clean, tipo } });
    return NextResponse.json({ mensagem: "Salvo com sucesso." }, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") return NextResponse.json({ mensagem: "Esse nome já está em uso." }, { status: 409 });
    console.error("Falha ao salvar categoria ou projeto:", error);
    return NextResponse.json({ mensagem: "Não foi possível salvar." }, { status: 500 });
  }
}

export async function DELETE(request) {
  const sessionId = await currentUserId();
  if (!sessionId) return NextResponse.json({ mensagem: "Faça login para continuar." }, { status: 401 });
  const userId = idDoBanco(sessionId);
  const params = new URL(request.url).searchParams;
  const tipo = params.get("tipo");
  const itemId = idDoBanco(params.get("id"));
  if (!userId || !itemId || !["categoria", "projeto"].includes(tipo))
    return NextResponse.json({ mensagem: "Item inválido." }, { status: 400 });
  try {
    const result = tipo === "categoria"
      ? await prisma.categorias.deleteMany({ where: { cod_usuario: userId, cod_categoria: itemId } })
      : await prisma.projetos.deleteMany({ where: { cod_usuario: userId, cod_projeto: itemId } });
    return result.count
      ? NextResponse.json({ mensagem: "Item removido." })
      : NextResponse.json({ mensagem: "Item não encontrado." }, { status: 404 });
  } catch (error) {
    if (error.code === "P2003") return NextResponse.json({ mensagem: "Este item já está ligado a lançamentos e não pode ser removido." }, { status: 409 });
    console.error("Falha ao remover categoria ou projeto:", error);
    return NextResponse.json({ mensagem: "Não foi possível remover o item." }, { status: 500 });
  }
}
