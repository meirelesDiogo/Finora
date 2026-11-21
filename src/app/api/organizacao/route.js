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
      prisma.$queryRaw`SELECT p.cod_projeto,p.nome,p.descricao,p.valor_meta,COUNT(l.cod_lancamento)::int AS lancamentos
        FROM projetos p LEFT JOIN lancamentos l ON l.cod_projeto=p.cod_projeto AND l.cod_usuario=p.cod_usuario
        WHERE p.cod_usuario=${userId} GROUP BY p.cod_projeto ORDER BY p.nome ASC`,
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
          valor_meta: Number(item.valor_meta), lancamentos: Number(item.lancamentos),
          receitas: Number(valores.find((total) => total.tipo === "RECEITA")?._sum.valor ?? 0),
          despesas: Number(valores.find((total) => total.tipo === "DESPESA")?._sum.valor ?? 0),
          valor_guardado: Math.max(0, Number(valores.find((total) => total.tipo === "RECEITA")?._sum.valor ?? 0) - Number(valores.find((total) => total.tipo === "DESPESA")?._sum.valor ?? 0)),
          progresso: Number(item.valor_meta) > 0 ? Math.min(100, Math.max(0, ((Number(valores.find((total) => total.tipo === "RECEITA")?._sum.valor ?? 0) - Number(valores.find((total) => total.tipo === "DESPESA")?._sum.valor ?? 0)) / Number(item.valor_meta)) * 100)) : 0,
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
  const { tipo, nome, descricao, valor_meta } = await request.json();
  const clean = String(nome ?? "").trim();
  const projeto = tipo === "projeto";
  const meta = Number(valor_meta);
  if (!clean || clean.length > (projeto ? 150 : 100) || (!projeto && !["RECEITA", "DESPESA"].includes(tipo)))
    return NextResponse.json({ mensagem: "Informe um nome e tipo válidos." }, { status: 400 });
  if (projeto && (!Number.isFinite(meta) || meta <= 0 || meta > 9999999999.99))
    return NextResponse.json({ mensagem: "Informe uma meta maior que zero para o projeto." }, { status: 400 });
  try {
    if (projeto) await prisma.$queryRaw`INSERT INTO projetos(cod_usuario,nome,descricao,valor_meta)
      VALUES (${userId},${clean},${String(descricao ?? "").trim() || null},${meta}) RETURNING cod_projeto`;
    else await prisma.categorias.create({ data: { cod_usuario: userId, nome: clean, tipo } });
    return NextResponse.json({ mensagem: "Salvo com sucesso." }, { status: 201 });
  } catch (error) {
    if (error.code === "P2002") return NextResponse.json({ mensagem: "Esse nome já está em uso." }, { status: 409 });
    console.error("Falha ao salvar categoria ou projeto:", error);
    return NextResponse.json({ mensagem: "Não foi possível salvar." }, { status: 500 });
  }
}

export async function PATCH(request) {
  const sessionId = await currentUserId();
  if (!sessionId) return NextResponse.json({ mensagem: "Faça login para continuar." }, { status: 401 });
  const userId = idDoBanco(sessionId);
  const body = await request.json();
  const projetoId = idDoBanco(body.cod_projeto);
  const meta = Number(body.valor_meta);
  if (!userId || !projetoId || !Number.isFinite(meta) || meta <= 0 || meta > 9999999999.99)
    return NextResponse.json({ mensagem: "Informe uma meta válida para o projeto." }, { status: 400 });
  try {
    const atualizado = await prisma.$executeRaw`UPDATE projetos SET valor_meta=${meta}
      WHERE cod_usuario=${userId} AND cod_projeto=${projetoId}`;
    return atualizado ? NextResponse.json({ mensagem: "Meta do projeto atualizada." }) : NextResponse.json({ mensagem: "Projeto não encontrado." }, { status: 404 });
  } catch (error) {
    console.error("Falha ao atualizar meta do projeto:", error);
    return NextResponse.json({ mensagem: "Não foi possível atualizar a meta." }, { status: 500 });
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
