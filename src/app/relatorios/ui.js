"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, ChartNoAxesCombined, FileSpreadsheet, LoaderCircle } from "lucide-react";
import ExcelJS from "exceljs";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Navegacao from "@/components/navegacao";

const dinheiro = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const cores = ["#2563eb", "#10b981", "#f97365", "#8b5cf6", "#f59e0b", "#06b6d4", "#ec4899", "#64748b"];
const nomeMes = (periodo) => {
  const [ano, mes] = periodo.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" }).format(new Date(Date.UTC(ano, mes - 1, 1))).replace(".", "");
};

function baixar(arquivo, nome, tipo) {
  const url = URL.createObjectURL(new Blob([arquivo], { type: tipo }));
  const link = document.createElement("a");
  link.href = url; link.download = nome; link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function montarAba(workbook, nome, cabecalhos, linhas, colunasDinheiro = []) {
  const sheet = workbook.addWorksheet(nome);
  sheet.addRow(cabecalhos);
  linhas.forEach((linha) => sheet.addRow(linha));
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.autoFilter = { from: "A1", to: String.fromCharCode(64 + cabecalhos.length) + Math.max(1, linhas.length + 1) };
  sheet.columns = cabecalhos.map((cabecalho, index) => ({
    header: cabecalho,
    key: String(index),
    width: Math.max(16, Math.min(34, cabecalho.length + 5)),
  }));
  sheet.getRow(1).height = 28;
  sheet.getRow(1).eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF173B72" } };
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    cell.alignment = { vertical: "middle" };
  });
  for (let rowIndex = 2; rowIndex <= sheet.rowCount; rowIndex += 1) {
    const row = sheet.getRow(rowIndex);
    row.height = 22;
    row.eachCell((cell, columnIndex) => {
      if (rowIndex % 2 === 0) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F6FC" } };
      if (colunasDinheiro.includes(columnIndex)) cell.numFmt = '"R$" #,##0.00';
      cell.border = { bottom: { style: "hair", color: { argb: "FFD9E2F0" } } };
    });
  }
  return sheet;
}

export default function Relatorios() {
  const router = useRouter();
  const [dados, setDados] = useState({ mensal: [], categorias: [], projetos: [] });
  const [erro, setErro] = useState("");
  const [exportando, setExportando] = useState(false);

  useEffect(() => {
    let ativo = true;
    fetch("/api/relatorios").then(async (response) => {
      if (response.status === 401) { router.push("/login"); return null; }
      return response.json();
    }).then((json) => { if (ativo && json) setDados(json); })
      .catch(() => { if (ativo) setErro("Não foi possível carregar os relatórios."); });
    return () => { ativo = false; };
  }, [router]);

  const mensal = dados.mensal.map((item) => ({ ...item, mes: nomeMes(item.periodo), saldo: item.receitas - item.despesas }));
  const categorias = dados.categorias.filter((item) => item.total > 0).sort((a, b) => b.total - a.total);

  function exportarCsv() {
    const linhas = [["Mês", "Receitas", "Despesas", "Saldo"], ...dados.mensal.map((item) => [item.periodo, item.receitas, item.despesas, item.receitas - item.despesas])];
    const csv = "\uFEFF" + linhas.map((linha) => linha.map((valor) => "\"" + String(valor ?? "").replaceAll("\"", "\"\"") + "\"").join(";")).join("\r\n");
    baixar(csv, "finora-relatorio-mensal.csv", "text/csv;charset=utf-8");
  }

  async function exportarExcel() {
    setExportando(true); setErro("");
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = "Finora";
      workbook.subject = "Relatórios financeiros";
      workbook.created = new Date();
      montarAba(workbook, "Resumo mensal", ["Mês", "Receitas", "Despesas", "Saldo"], dados.mensal.map((item) => [item.periodo, item.receitas, item.despesas, item.receitas - item.despesas]), [2, 3, 4]);
      montarAba(workbook, "Despesas por categoria", ["Categoria", "Total"], categorias.map((item) => [item.nome, item.total]), [2]);
      montarAba(workbook, "Projetos", ["Projeto", "Receitas", "Despesas", "Saldo guardado", "Meta", "Progresso (%)"], dados.projetos.map((item) => [item.nome, item.receitas, item.despesas, item.valor_guardado, item.valor_meta, item.progresso]), [2, 3, 4, 5]);
      const arquivo = await workbook.xlsx.writeBuffer();
      baixar(arquivo, "finora-relatorio-financeiro.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    } catch (error) {
      console.error("Falha ao gerar planilha:", error);
      setErro("Não foi possível gerar a planilha Excel. Tente novamente.");
    } finally { setExportando(false); }
  }

  return <main className="min-h-screen bg-slate-50 text-slate-800"><Navegacao/>
    <div className="mx-auto max-w-7xl px-5 py-8 md:py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Acompanhe sua evolução</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Relatórios</h1><p className="mt-1 text-slate-500">Receitas, despesas, categorias e metas dos projetos.</p></div>
        <div className="flex flex-wrap gap-2"><button onClick={exportarCsv} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold hover:border-blue-300"><Download size={17}/> CSV simples</button><button onClick={exportarExcel} disabled={exportando} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{exportando ? <LoaderCircle size={17} className="animate-spin"/> : <FileSpreadsheet size={17}/>} {exportando ? "Gerando..." : "Planilha Excel estilizada"}</button></div>
      </div>
      {erro && <div role="alert" className="mt-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{erro}</div>}
      <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><div className="flex items-start justify-between"><div><h2 className="font-bold text-slate-900">Receitas e despesas</h2><p className="mt-1 text-sm text-slate-500">Comparação mensal nos últimos seis meses</p></div><ChartNoAxesCombined className="text-blue-600"/></div><div className="mt-5 h-72 w-full">{mensal.length > 0 && <ResponsiveContainer width="100%" height="100%"><BarChart data={mensal} margin={{ top: 12, right: 8, left: 8, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="mes" tick={{ fontSize: 12 }}/><YAxis tickFormatter={(v) => "R$" + v} tick={{ fontSize: 11 }} width={70}/><Tooltip formatter={(value) => dinheiro.format(Number(value))}/><Legend/><Bar dataKey="receitas" name="Receitas" fill="#10b981" radius={[5,5,0,0]}/><Bar dataKey="despesas" name="Despesas" fill="#f97365" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer>}</div>{mensal.length === 0 && <p className="py-20 text-center text-sm text-slate-500">Seus dados aparecerão aqui quando registrar movimentações.</p>}</section>
      <section className="mt-5 grid gap-5 lg:grid-cols-2"><article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><h2 className="font-bold text-slate-900">Evolução do saldo</h2><p className="mt-1 text-sm text-slate-500">Receitas menos despesas em cada mês</p><div className="mt-4 h-72">{mensal.length > 0 && <ResponsiveContainer width="100%" height="100%"><AreaChart data={mensal}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="mes"/><YAxis tickFormatter={(v) => "R$" + v} width={70}/><Tooltip formatter={(v) => dinheiro.format(Number(v))}/><Area type="monotone" dataKey="saldo" name="Saldo mensal" stroke="#2563eb" fill="#2563eb" fillOpacity={0.18}/></AreaChart></ResponsiveContainer>}</div></article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><h2 className="font-bold text-slate-900">Despesas por categoria</h2><p className="mt-1 text-sm text-slate-500">Distribuição no mês atual</p><div className="mt-4 h-72">{categorias.length > 0 ? <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categorias} dataKey="total" nameKey="nome" innerRadius={58} outerRadius={100} paddingAngle={3}>{categorias.map((item, index) => <Cell key={item.nome} fill={cores[index % cores.length]}/>)}</Pie><Tooltip formatter={(v) => dinheiro.format(Number(v))}/><Legend/></PieChart></ResponsiveContainer> : <p className="py-20 text-center text-sm text-slate-500">Ainda não há despesas neste mês.</p>}</div></article>
      </section>
      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7"><h2 className="font-bold text-slate-900">Projetos e metas</h2><p className="mt-1 text-sm text-slate-500">Quanto já foi guardado para cada objetivo</p>{dados.projetos.length === 0 ? <p className="py-12 text-center text-sm text-slate-500">Crie projetos e associe receitas e despesas a eles.</p> : <div className="mt-4 grid gap-4 md:grid-cols-2">{dados.projetos.map((item) => <article key={item.nome} className="rounded-xl border border-slate-100 p-4"><div className="flex justify-between gap-3"><h3 className="font-semibold text-slate-800">{item.nome}</h3><span className="text-sm font-semibold text-blue-700">{Number(item.progresso).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%</span></div><div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500" style={{ width: Math.min(100, Math.max(0, item.progresso)) + "%" }}/></div><p className="mt-2 text-xs text-slate-500">{dinheiro.format(item.valor_guardado)} guardados de {dinheiro.format(item.valor_meta)}</p></article>)}</div>}</section>
    </div>
  </main>;
}
