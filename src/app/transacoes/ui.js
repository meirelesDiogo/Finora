"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownLeft, ArrowUpRight, Search, Trash2, Plus, Pencil, Check, X } from "lucide-react";
import Navegacao from "@/components/navegacao";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dataPt = (value) => new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value));

export default function Transacoes() {
  const router = useRouter();
  const hoje = new Date();
  const [mes, setMes] = useState(String(hoje.getMonth() + 1));
  const [ano, setAno] = useState(String(hoje.getFullYear()));
  const [tipo, setTipo] = useState("TODAS");
  const [busca, setBusca] = useState("");
  const [dados, setDados] = useState({ lancamentos: [], categorias: [], projetos: [], totais: { receitas: 0, despesas: 0 } });
  const [aviso, setAviso] = useState("");
  const [editId, setEditId] = useState(null);
  const [edit, setEdit] = useState({});
  const [saving, setSaving] = useState(false);

  const carregar = useCallback(async () => {
    const response = await fetch(`/api/lancamentos?mes=${mes}&ano=${ano}`);
    if (response.status === 401) { router.push("/login"); return; }
    setDados(await response.json());
  }, [mes, ano, router]);

  useEffect(() => {
    let ativo = true;
    fetch(`/api/lancamentos?mes=${mes}&ano=${ano}`)
      .then(async (response) => {
        if (response.status === 401) { router.push("/login"); return null; }
        return response.json();
      })
      .then((resultado) => { if (ativo && resultado) setDados(resultado); })
      .catch(() => { if (ativo) setAviso("Não foi possível carregar as movimentações."); });
    return () => { ativo = false; };
  }, [mes, ano, router]);

  const visiveis = dados.lancamentos.filter((item) =>
    (tipo === "TODAS" || item.tipo === tipo)
    && (!busca || `${item.descricao} ${item.categoria} ${item.projeto || ""}`.toLowerCase().includes(busca.toLowerCase()))
  );

  async function excluir(id) {
    if (!window.confirm("Deseja excluir este lançamento?")) return;
    const response = await fetch(`/api/lancamentos?id=${id}`, { method: "DELETE" });
    const resultado = await response.json();
    setAviso(resultado.mensagem);
    if (response.ok) await carregar();
  }

  function iniciarEdicao(item) {
    setEditId(item.cod_lancamento);
    setEdit({
      descricao: item.descricao,
      valor: String(item.valor),
      tipo: item.tipo,
      categoria: String(dados.categorias.find((categoria) => categoria.nome === item.categoria && categoria.tipo === item.tipo)?.cod_categoria || ""),
      projeto: String(dados.projetos.find((projeto) => projeto.nome === item.projeto)?.cod_projeto || ""),
      data: String(item.data_lancamento).slice(0, 10),
    });
  }

  async function salvarEdicao(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/lancamentos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...edit, id: editId, valor: Number(edit.valor) }),
      });
      const resultado = await response.json();
      setAviso(resultado.mensagem);
      if (response.ok) { setEditId(null); await carregar(); }
    } catch { setAviso("Não foi possível atualizar o lançamento."); }
    finally { setSaving(false); }
  }

  const categoriasDoTipo = dados.categorias.filter((categoria) => categoria.tipo === edit.tipo);
  const meses = Array.from({ length: 12 }, (_, index) => index + 1);

  return <main className="min-h-screen bg-slate-50 text-slate-800">
    <Navegacao />
    <div className="mx-auto max-w-7xl px-5 py-8 md:py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Histórico financeiro</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Movimentações</h1><p className="mt-1 text-slate-500">Consulte, filtre, edite e remova seus lançamentos.</p></div>
        <a href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"><Plus size={18} /> Novo lançamento</a>
      </div>
      {aviso && <div role="status" className="mt-5 flex justify-between rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">{aviso}<button onClick={() => setAviso("")} aria-label="Fechar"><X size={16} /></button></div>}

      <section className="mt-7 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Receitas do período</p><p className="mt-2 text-2xl font-bold text-emerald-600">{brl.format(dados.totais.receitas)}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">Despesas do período</p><p className="mt-2 text-2xl font-bold text-slate-900">{brl.format(dados.totais.despesas)}</p></div>
      </section>

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white">
        <div className="grid gap-3 border-b border-slate-100 p-4 sm:grid-cols-4">
          <label className="text-xs font-semibold text-slate-500">Mês<select value={mes} onChange={(event) => setMes(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800">{meses.map((month) => <option key={month} value={month}>{new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date(2026, month - 1, 1))}</option>)}</select></label>
          <label className="text-xs font-semibold text-slate-500">Ano<input type="number" min="2000" max="2100" value={ano} onChange={(event) => setAno(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800" /></label>
          <label className="text-xs font-semibold text-slate-500">Tipo<select value={tipo} onChange={(event) => setTipo(event.target.value)} className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"><option value="TODAS">Todos</option><option value="RECEITA">Receitas</option><option value="DESPESA">Despesas</option></select></label>
          <label className="text-xs font-semibold text-slate-500">Buscar<input value={busca} onChange={(event) => setBusca(event.target.value)} placeholder="Descrição ou categoria" className="mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-normal text-slate-800" /></label>
        </div>

        <div className="divide-y divide-slate-100">
          {visiveis.length === 0 ? <div className="px-6 py-16 text-center"><Search className="mx-auto text-slate-300" /><p className="mt-3 font-semibold text-slate-700">Nenhum lançamento encontrado</p><p className="mt-1 text-sm text-slate-500">Altere os filtros ou registre uma movimentação.</p></div> : visiveis.map((item) => <div key={item.cod_lancamento}>
            <div className="flex items-center gap-3 px-4 py-4 sm:px-5">
              <span className={`rounded-xl p-2.5 ${item.tipo === "RECEITA" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"}`}>{item.tipo === "RECEITA" ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}</span>
              <div className="min-w-0 flex-1"><p className="truncate font-semibold text-slate-800">{item.descricao}</p><p className="mt-1 text-xs text-slate-500">{item.categoria} · {dataPt(item.data_lancamento)}{item.projeto ? ` · ${item.projeto}` : ""}</p></div>
              <span className={`whitespace-nowrap text-sm font-bold ${item.tipo === "RECEITA" ? "text-emerald-600" : "text-slate-800"}`}>{item.tipo === "RECEITA" ? "+" : "−"} {brl.format(item.valor)}</span>
              <button onClick={() => editId === item.cod_lancamento ? setEditId(null) : iniciarEdicao(item)} aria-label={`Editar ${item.descricao}`} className="rounded-lg p-2 text-slate-300 hover:bg-blue-50 hover:text-blue-600"><Pencil size={17} /></button>
              <button onClick={() => excluir(item.cod_lancamento)} aria-label={`Excluir ${item.descricao}`} className="rounded-lg p-2 text-slate-300 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={17} /></button>
            </div>
            {editId === item.cod_lancamento && <form onSubmit={salvarEdicao} className="grid gap-3 bg-slate-50 px-4 pb-5 sm:grid-cols-2 sm:px-5 lg:grid-cols-3">
              <label className="text-xs font-semibold text-slate-500">Descrição<input required maxLength={255} value={edit.descricao} onChange={(event) => setEdit({ ...edit, descricao: event.target.value })} className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal" /></label>
              <label className="text-xs font-semibold text-slate-500">Tipo<select value={edit.tipo} onChange={(event) => setEdit({ ...edit, tipo: event.target.value, categoria: "" })} className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal"><option value="DESPESA">Despesa</option><option value="RECEITA">Receita</option></select></label>
              <label className="text-xs font-semibold text-slate-500">Valor (R$)<input required type="number" min="0.01" step="0.01" value={edit.valor} onChange={(event) => setEdit({ ...edit, valor: event.target.value })} className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal" /></label>
              <label className="text-xs font-semibold text-slate-500">Categoria<select required value={edit.categoria} onChange={(event) => setEdit({ ...edit, categoria: event.target.value })} className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal"><option value="">Selecione</option>{categoriasDoTipo.map((category) => <option key={category.cod_categoria} value={category.cod_categoria}>{category.nome}</option>)}</select></label>
              <label className="text-xs font-semibold text-slate-500">Projeto (opcional)<select value={edit.projeto} onChange={(event) => setEdit({ ...edit, projeto: event.target.value })} className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal"><option value="">Sem projeto</option>{dados.projetos.map((project) => <option key={project.cod_projeto} value={project.cod_projeto}>{project.nome}</option>)}</select></label>
              <label className="text-xs font-semibold text-slate-500">Data<input required type="date" value={edit.data} onChange={(event) => setEdit({ ...edit, data: event.target.value })} className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-normal" /></label>
              <button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 sm:col-span-2 lg:col-span-3"><Check size={16} />{saving ? "Salvando..." : "Salvar alterações"}</button>
            </form>}
          </div>)}
        </div>
      </section>
    </div>
  </main>;
}
