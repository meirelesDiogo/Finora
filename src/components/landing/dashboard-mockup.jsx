"use client";

import { motion, useReducedMotion } from "motion/react";

const C = 251.3; // circunferência do donut (r = 40)
const kpis = [
  { label: "Saldo atual", value: "R$ 1.400,00", note: "▲ 8,2% vs mês anterior" },
  { label: "Receitas", value: "R$ 3.500,00", note: "▲ 4,0% vs mês anterior" },
  { label: "Despesas", value: "R$ 2.100,00", note: "▼ 12% vs mês anterior" },
  { label: "Economizado", value: "40%", note: "da receita do mês" },
];
const donut = [
  { name: "Moradia", pct: 30, color: "#2E8BFF" },
  { name: "Alimentação", pct: 25, color: "#7C5CFF" },
  { name: "Lazer", pct: 20, color: "#22C55E" },
  { name: "Transporte", pct: 15, color: "#F59E0B" },
  { name: "Outros", pct: 10, color: "#8A93A6" },
];
const months = [
  { m: "Jul", h: 62 },
  { m: "Ago", h: 76 },
  { m: "Set", h: 54 },
  { m: "Out", h: 46 },
];

export function DashboardMockup() {
  const reduce = useReducedMotion();
  const t = (d) => ({ duration: reduce ? 0 : 1.2, delay: reduce ? 0 : d, ease: "easeOut" });
  let acc = 0;

  return (
    <div className="rounded-2xl border border-[#1E2430] bg-[#0A0D14] p-3 text-left shadow-[0_0_100px_-30px_rgba(46,139,255,0.5)] sm:p-5" role="img" aria-label="Prévia do dashboard do Finora, outubro de 2026">
      <div className="mb-4 flex items-center justify-between text-xs text-[#8A93A6]">
        <span className="font-semibold text-[#EDF0F5]">Outubro 2026</span>
        <span>‹ &nbsp; › </span>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border border-[#1E2430] bg-[#10141D] p-3 sm:p-4">
            <p className="text-[11px] text-[#8A93A6]">{k.label}</p>
            <p className="mt-1 text-base font-bold sm:text-xl">{k.value}</p>
            <p className="mt-1 text-[11px] text-[#22C55E]">{k.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <div className="rounded-xl border border-[#1E2430] bg-[#10141D] p-4 lg:col-span-2">
          <p className="text-xs font-semibold">Receitas x Despesas</p>
          <svg viewBox="0 0 340 110" className="mt-3 h-auto w-full" aria-hidden="true">
            <defs>
              <linearGradient id="mk-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2E8BFF" stopOpacity=".35" />
                <stop offset="1" stopColor="#2E8BFF" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[25, 55, 85].map((y) => <line key={y} x1="0" x2="340" y1={y} y2={y} stroke="#1E2430" />)}
            <motion.path d="M0,80 C40,70 70,72 110,55 S180,40 220,42 S290,20 340,14 L340,110 L0,110 Z" fill="url(#mk-area)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={t(1.4)} />
            <motion.path d="M0,80 C40,70 70,72 110,55 S180,40 220,42 S290,20 340,14" fill="none" stroke="#2E8BFF" strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={t(0.5)} />
            <motion.path d="M0,95 C40,90 80,88 120,80 S190,72 230,68 S300,56 340,52" fill="none" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={t(0.7)} />
          </svg>
        </div>

        <div className="rounded-xl border border-[#1E2430] bg-[#10141D] p-4">
          <p className="text-xs font-semibold">Despesas por categoria</p>
          <div className="mt-3 flex items-center gap-4">
            <svg viewBox="0 0 100 100" className="h-24 w-24 shrink-0" aria-hidden="true">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#1E2430" strokeWidth="12" />
              {donut.map((d, i) => {
                const len = (d.pct / 100) * C - 3;
                const start = (acc / 100) * 360 - 90;
                acc += d.pct;
                return (
                  <motion.circle key={d.name} cx="50" cy="50" r="40" fill="none" stroke={d.color} strokeWidth="12" transform={`rotate(${start} 50 50)`} initial={{ strokeDasharray: `0 ${C}` }} animate={{ strokeDasharray: `${len} ${C}` }} transition={t(0.8 + i * 0.12)} />
                );
              })}
            </svg>
            <ul className="space-y-1 text-[11px] text-[#8A93A6]">
              {donut.map((d) => (
                <li key={d.name} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-sm" style={{ background: d.color }} aria-hidden="true" />
                  {d.name} {d.pct}%
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-[#1E2430] bg-[#10141D] p-4">
        <p className="text-xs font-semibold">Comparação mensal das despesas</p>
        <div className="mt-3 flex h-20 items-end gap-4 sm:gap-8">
          {months.map((b, i) => (
            <div key={b.m} className="flex flex-1 flex-col items-center gap-1">
              <motion.div className="w-full max-w-[56px] rounded-t-md bg-gradient-to-t from-[#2E8BFF] to-[#7C5CFF]" style={{ opacity: i === 3 ? 1 : 0.5 }} initial={{ height: 0 }} animate={{ height: `${b.h}%` }} transition={t(1 + i * 0.12)} />
              <span className="text-[10px] text-[#8A93A6]">{b.m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
