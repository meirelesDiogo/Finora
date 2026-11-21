"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Tag, FolderKanban, Trash2, X, Pencil, Target } from "lucide-react";
import Navegacao from "@/components/navegacao";

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function Organizacao({ tipo }) {
  const router = useRouter();
  const [dados, setDados] = useState({ categorias: [], projetos: [] });
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valorMeta, setValorMeta] = useState("");
  const [editando, setEditando] = useState(null);
  const [categoriaTipo, setCategoriaTipo] = useState("DESPESA");
  const [aviso, setAviso] = useState("");
  const [busy, setBusy] = useState(false);
  const isProjeto = tipo === "projeto";

  async function carregar() {
    const response = await fetch("/api/organizacao");
    if (response.status === 401) { router.push("/login"); return; }
    const json = await response.json();
    setDados(json);
  }
  useEffect(() => {
    let ativo = true;
    fetch("/api/organizacao").then(async (response) => {
      if (response.status === 401) { router.push("/login"); return null; }
      return response.json();
    }).then((json) => { if (ativo && json) setDados(json); })
      .catch(() => { if (ativo) setAviso("Não foi possível carregar seus dados."); });
    return () => { ativo = false; };
  }, [router]);

  function abrirFormulario(item = null) {
    setEditando(item?.cod_projeto ?? null);
    setNome(item?.nome ?? "");
    setDescricao(item?.descricao ?? "");
    setValorMeta(item?.valor_meta ? String(item.valor_meta) : "");
    setAberto(true);
  }
  async function salvar(event) {
    event.preventDefault();
    setBusy(true); setAviso("");
    try {
      const body = isProjeto
        ? { tipo: "projeto", nome, descricao, valor_meta: Number(valorMeta), cod_projeto: editando }
        : { tipo: categoriaTipo, nome };
      const response = await fetch("/api/organizacao", {
        method: editando ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.mensagem);
      setNome(""); setDescricao(""); setValorMeta(""); setEditando(null); setAberto(false);
      setAviso(json.mensagem); await carregar();
    } catch (error) { setAviso(error.message); }
    finally { setBusy(false); }
  }
  async function remover(item) {
    if (!window.confirm("Remover " + item.nome + "?")) return;
    const id = isProjeto ? item.cod_projeto : item.cod_categoria;
    const response = await fetch("/api/organizacao?tipo=" + tipo + "&id=" + id, { method: "DELETE" });
    const json = await response.json(); setAviso(json.mensagem);
    if (response.ok) await carregar();
  }
  const lista = isProjeto ? dados.projetos : dados.categorias;

  return <main className="min-h-screen bg-slate-50 text-slate-800">
    <Navegacao/>
    <div className="mx-auto max-w-7xl px-5 py-8 md:py-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Organização financeira</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{isProjeto ? "Projetos" : "Categorias"}</h1><p className="mt-1 text-slate-500">{isProjeto ? "Defina uma meta e acompanhe quanto já juntou." : "Personalize como suas receitas e despesas são organizadas."}</p></div>
        <button onClick={() => aberto ? setAberto(false) : abrirFormulario()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">{aberto ? <X size={18}/> : <Plus size={18}/>} {aberto ? "Cancelar" : isProjeto ? "Novo projeto" : "Nova categoria"}</button>
      </div>
      {aviso && <div role="status" className="mt-5 flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">{aviso}<button onClick={() => setAviso("")} aria-label="Fechar"><X size={16}/></button></div>}
      {aberto && <form onSubmit={salvar} className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <label className="text-sm font-semibold">Nome<input required maxLength={isProjeto ? 150 : 100} value={nome} onChange={e => setNome(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500" placeholder={isProjeto ? "Ex.: Viagem" : "Ex.: Educação"}/></label>
        {isProjeto ? <>
          <label className="text-sm font-semibold">Meta do projeto (R$)<input required type="number" min="0.01" step="0.01" value={valorMeta} onChange={e => setValorMeta(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500" placeholder="Ex.: 5.000,00"/></label>
          <label className="text-sm font-semibold sm:col-span-2">Descrição (opcional)<input value={descricao} onChange={e => setDescricao(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-blue-500" placeholder="Detalhes do projeto"/></label>
        </> : <label className="text-sm font-semibold">Tipo<select value={categoriaTipo} onChange={e => setCategoriaTipo(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-normal"><option value="DESPESA">Despesa</option><option value="RECEITA">Receita</option></select></label>}
        <button disabled={busy} className="rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-60 sm:col-span-2">{busy ? "Salvando..." : editando ? "Atualizar meta" : "Salvar"}</button>
      </form>}
      {!lista.length ? <section className="mt-7 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">{isProjeto ? <FolderKanban/> : <Tag/>}</span><h2 className="mt-4 font-semibold text-slate-800">Nenhum {isProjeto ? "projeto" : "item"} personalizado</h2><p className="mt-1 text-sm text-slate-500">{isProjeto ? "Crie um projeto e acompanhe o progresso até a meta." : "As categorias padrão já aparecem ao registrar movimentações."}</p></section>
        : <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{lista.map(item => {
          const progresso = Math.min(100, Math.max(0, Number(item.progresso) || 0));
          return <article key={isProjeto ? item.cod_projeto : item.cod_categoria} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className={"rounded-xl p-3 " + (isProjeto ? "bg-blue-50 text-blue-600" : item.tipo === "RECEITA" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600")}>{isProjeto ? <FolderKanban size={19}/> : <Tag size={19}/>}</span><div><h2 className="font-bold text-slate-900">{item.nome}</h2><p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{isProjeto ? item.lancamentos + " movimentação(ões)" : item.tipo === "RECEITA" ? "Receita" : "Despesa"}</p></div></div><div className="flex gap-1">{isProjeto && <button onClick={() => abrirFormulario(item)} aria-label={"Alterar meta de " + item.nome} title="Alterar meta" className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"><Pencil size={16}/></button>}<button onClick={() => remover(item)} aria-label={"Remover " + item.nome} className="rounded-lg p-2 text-slate-300 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={17}/></button></div></div>
            {isProjeto && <div className="mt-5 border-t border-slate-100 pt-4"><div className="flex items-center justify-between gap-3 text-xs"><span className="text-slate-500">Guardado: <strong className="text-emerald-600">{moeda.format(item.valor_guardado || 0)}</strong></span><span className="text-slate-500">Meta: <strong className="text-slate-800">{moeda.format(item.valor_meta || 0)}</strong></span></div><div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all" style={{ width: progresso + "%" }}/></div><div className="mt-2 flex items-center justify-between text-xs"><span className="font-semibold text-blue-700">{progresso.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% concluído</span><span className="text-slate-400">{item.lancamentos} movimentação(ões)</span></div><div className="mt-4 grid grid-cols-2 gap-3"><div><p className="text-xs text-slate-400">Receitas</p><p className="mt-1 font-semibold text-emerald-600">{moeda.format(item.receitas)}</p></div><div><p className="text-xs text-slate-400">Despesas</p><p className="mt-1 font-semibold text-slate-800">{moeda.format(item.despesas)}</p></div></div></div>}
          </article>;
        })}</section>}
    </div>
  </main>;
}
