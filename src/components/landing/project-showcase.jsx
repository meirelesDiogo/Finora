"use client";

import { motion } from "motion/react";

const items = [
  { name: "Hospedagem", value: "R$ 500", w: 100 },
  { name: "Transporte", value: "R$ 420", w: 84 },
  { name: "Lazer", value: "R$ 200", w: 40 },
  { name: "Alimentação", value: "R$ 180", w: 36 },
];

export function ProjectShowcase() {
  return (
    <div className="rounded-2xl border border-[#1E2430] bg-[#10141D] p-6">
      <p className="text-sm text-[#8A93A6]">Projeto</p>

      <h3 className="mt-1 text-xl font-bold">
        Viagem para São Paulo
      </h3>

      <div className="mt-5 flex items-end justify-between text-sm">
        <span className="text-2xl font-bold">R$ 1.300</span>

        <span className="text-[#8A93A6]">
          de R$ 1.500 · 86%
        </span>
      </div>

      <div
        className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#1E2430]"
        role="progressbar"
        aria-valuenow={86}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Orçamento utilizado"
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#2E8BFF]"
          initial={{ width: 0 }}
          whileInView={{ width: "86%" }}
          viewport={{ once: true }}
          transition={{
            duration: 1.4,
            ease: "easeOut",
          }}
        />
      </div>

      <ul className="mt-6 space-y-3">
        {items.map((i, idx) => (
          <li key={i.name} className="text-sm">
            <div className="flex justify-between">
              <span>{i.name}</span>

              <span className="text-[#8A93A6]">
                {i.value}
              </span>
            </div>

            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#1E2430]">
              <motion.div
                className="h-full rounded-full bg-[#2E8BFF]/70"
                initial={{ width: 0 }}
                whileInView={{ width: `${i.w}%` }}
                viewport={{ once: true }}
                transition={{
                  duration: 1,
                  delay: 0.2 + idx * 0.1,
                  ease: "easeOut",
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}