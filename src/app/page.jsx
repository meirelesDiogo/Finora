import Link from "next/link";
import { CalendarDays, FileBarChart, Luggage, Target } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { DashboardMockup } from "@/components/landing/dashboard-mockup";
import { ProjectShowcase } from "@/components/landing/project-showcase";
import { FadeIn } from "@/components/ui/fade-in";
import { Reveal } from "@/components/ui/reveal";
import { GoogleButton } from "@/components/ui/google-button";

export const metadata = {
  title: "Finora — Seu dinheiro. Seu controle. Sua visão.",
  description: "Controle suas finanças, acompanhe seus gastos, organize seus projetos e entenda sua evolução financeira.",
  openGraph: {
    title: "Finora — Seu dinheiro. Seu controle. Sua visão.",
    description: "Controle suas finanças, acompanhe seus gastos, organize seus projetos e entenda sua evolução financeira.",
    type: "website",
    locale: "pt_BR",
  },
};

const features = [
  { icon: CalendarDays, title: "Controle mensal", text: "Cada mês é um período independente. Veja receitas, despesas e saldo e compare com o mês anterior.", span: "lg:col-span-2" },
  { icon: Luggage, title: "Projetos", text: "Acompanhe viagens, compras e eventos com orçamento próprio.", span: "" },
  { icon: FileBarChart, title: "Relatórios", text: "Entenda sua evolução com gráficos e resumos claros.", span: "" },
  { icon: Target, title: "Metas", text: "Transforme planos em objetivos, com progresso, prazo e valor restante sempre visíveis.", span: "lg:col-span-2" },
];

const flow = [
  { step: "Transação", hint: "Uber · R$ 70" },
  { step: "Categoria", hint: "Transporte" },
  { step: "Projeto", hint: "Viagem SP" },
  { step: "Mês", hint: "Outubro 2026" },
  { step: "Relatório", hint: "Visão completa" },
];

const primary = "inline-flex h-11 items-center justify-center rounded-xl bg-[#2E8BFF] px-6 text-sm font-medium text-white transition hover:bg-[#4A9BFF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E8BFF]";
const secondary = "inline-flex h-11 items-center justify-center rounded-xl border border-[#1E2430] px-6 text-sm font-medium transition hover:bg-[#10141D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E8BFF]";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0D14] text-[#EDF0F5]">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-5 pb-24 pt-20 text-center sm:pt-28">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1E2430_1px,transparent_1px),linear-gradient(to_bottom,#1E2430_1px,transparent_1px)] bg-[size:56px_56px] opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[#2E8BFF]/20 blur-[130px]" />

          <div className="relative mx-auto max-w-3xl">
            <FadeIn>
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">Tenha clareza sobre o seu dinheiro.</h1>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p className="mx-auto mt-6 max-w-xl text-pretty text-lg text-[#8A93A6]">
                Organize seus gastos, acompanhe seus objetivos e entenda para onde seu dinheiro está indo.
              </p>
            </FadeIn>
            <FadeIn delay={0.24} className="mt-9 flex flex-col items-center gap-3">
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/register" className={primary}>Começar agora</Link>
                <a href="#como-funciona" className={secondary}>Ver como funciona</a>
              </div>
              <div className="w-full max-w-[280px]"><GoogleButton /></div>
            </FadeIn>
          </div>

          <FadeIn delay={0.4} className="relative mx-auto mt-16 max-w-5xl">
            <DashboardMockup />
          </FadeIn>
        </section>

        {/* Recursos */}
        <section id="recursos" className="mx-auto max-w-6xl px-5 py-20">
          <Reveal><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Seu dinheiro, organizado.</h2></Reveal>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text, span }, i) => (
              <Reveal key={title} delay={i * 0.08} className={span}>
                <article className="h-full rounded-2xl border border-[#1E2430] bg-[#10141D] p-7 transition hover:-translate-y-0.5 hover:border-[#2E8BFF]/40">
                  <Icon className="h-6 w-6 text-[#2E8BFF]" aria-hidden="true" />
                  <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-[#8A93A6]">{text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Projetos */}
        <section id="relatorios" className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Cada viagem, compra ou evento com o seu próprio orçamento.</h2>
            <p className="mt-5 max-w-md text-[#8A93A6]">
              Agrupe os gastos em um projeto e veja quanto já foi usado, quanto falta e onde o dinheiro foi parar.
            </p>
          </Reveal>
          <Reveal delay={0.1}><ProjectShowcase /></Reveal>
        </section>

        {/* Como funciona */}
        <section id="como-funciona" className="mx-auto max-w-6xl px-5 py-20">
          <Reveal><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Do gasto ao panorama completo.</h2></Reveal>
          <ol className="mt-12 grid gap-4 md:grid-cols-5">
            {flow.map((f, i) => (
              <Reveal key={f.step} delay={i * 0.1}>
                <li className="relative rounded-xl border border-[#1E2430] bg-[#10141D] p-5">
                  <p className="font-semibold">{f.step}</p>
                  <p className="mt-1 text-sm text-[#8A93A6]">{f.hint}</p>
                  {i < flow.length - 1 && <span aria-hidden className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-[#2E8BFF] md:block">→</span>}
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* CTA final */}
        <section className="px-5 py-28 text-center">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-5xl">Comece a entender melhor o seu dinheiro.</h2>
            <div className="mx-auto mt-9 flex max-w-[280px] flex-col gap-3">
              <Link href="/register" className={primary}>Criar conta</Link>
              <GoogleButton />
              <Link href="/login" className="text-sm text-[#8A93A6] transition hover:text-[#EDF0F5]">Já tenho conta</Link>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-[#1E2430] px-5 py-8 text-center text-sm text-[#8A93A6]">
        Finora · Seu dinheiro. Seu controle. Sua visão.
      </footer>
    </div>
  );
}