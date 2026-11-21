"use client";

import { Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const cores = ["#2563eb", "#10b981", "#f97365", "#8b5cf6", "#f59e0b", "#06b6d4", "#ec4899", "#64748b"];

export default function GraficosDashboard({ lancamentos }) {
  const porDia = Object.values(lancamentos.reduce((grupos, item) => {
    const dia = new Date(item.data_lancamento).getUTCDate();
    if (!grupos[dia]) grupos[dia] = { dia: String(dia).padStart(2, "0"), receitas: 0, despesas: 0 };
    grupos[dia][item.tipo === "RECEITA" ? "receitas" : "despesas"] += item.valor;
    return grupos;
  }, {})).sort((a, b) => Number(a.dia) - Number(b.dia));

  const mapaCategorias = lancamentos.filter(item => item.tipo === "DESPESA").reduce((grupos, item) => {
    grupos[item.categoria] = (grupos[item.categoria] || 0) + item.valor;
    return grupos;
  }, {});
  const categorias = Object.entries(mapaCategorias).map(([nome, valor]) => ({ nome, valor })).sort((a, b) => b.valor - a.valor);

  return <section className="mt-7 grid gap-5 lg:grid-cols-2">
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-bold text-slate-900">Fluxo diário</h2>
      <p className="mt-1 text-sm text-slate-500">Receitas e despesas no mês selecionado</p>
      <div className="mt-4 h-64">
        {porDia.length ? <ResponsiveContainer width="100%" height="100%"><AreaChart data={porDia}>
          <CartesianGrid strokeDasharray="3 3" vertical={false}/>
          <XAxis dataKey="dia"/><YAxis tickFormatter={v => "R$" + v} width={65}/>
          <Tooltip formatter={v => moeda.format(Number(v))}/><Legend/>
          <Area type="monotone" dataKey="receitas" name="Receitas" stroke="#10b981" fill="#10b981" fillOpacity={0.18}/>
          <Area type="monotone" dataKey="despesas" name="Despesas" stroke="#f97365" fill="#f97365" fillOpacity={0.18}/>
        </AreaChart></ResponsiveContainer> : <p className="py-20 text-center text-sm text-slate-500">Registre movimentações para ver o fluxo.</p>}
      </div>
    </article>
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-bold text-slate-900">Despesas por categoria</h2>
      <p className="mt-1 text-sm text-slate-500">Distribuição no mês selecionado</p>
      <div className="mt-4 h-64">
        {categorias.length ? <ResponsiveContainer width="100%" height="100%"><PieChart>
          <Pie data={categorias} dataKey="valor" nameKey="nome" innerRadius={48} outerRadius={90} paddingAngle={3}>
            {categorias.map((item, index) => <Cell key={item.nome} fill={cores[index % cores.length]}/>)}
          </Pie>
          <Tooltip formatter={v => moeda.format(Number(v))}/><Legend/>
        </PieChart></ResponsiveContainer> : <p className="py-20 text-center text-sm text-slate-500">Nenhuma despesa registrada neste mês.</p>}
      </div>
    </article>
  </section>;
}
