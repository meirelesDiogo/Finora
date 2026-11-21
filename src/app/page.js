
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Wallet,
  TrendingUp,
  TrendingDown,
  ChartNoAxesCombined,
  Target,
  ShieldCheck,
  LayoutDashboard,
  CreditCard,
  Menu,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Controle financeiro",
    description:
      "Registre suas receitas e despesas e mantenha suas movimentações organizadas em um só lugar.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Análises inteligentes",
    description:
      "Visualize seus hábitos financeiros por meio de gráficos e relatórios organizados.",
  },
  {
    icon: Target,
    title: "Metas financeiras",
    description:
      "Defina objetivos, acompanhe seu progresso e planeje suas próximas conquistas.",
  },
  {
    icon: ShieldCheck,
    title: "Organização e segurança",
    description:
      "Tenha suas informações financeiras organizadas e protegidas em sua conta.",
  },
];

const transactions = [
  {
    name: "Salário",
    category: "Renda",
    date: "20 Nov, 2026",
    value: "+ R$ 3.500,00",
    type: "income",
    icon: TrendingUp,
  },
  {
    name: "Supermercado",
    category: "Alimentação",
    date: "19 Nov, 2026",
    value: "- R$ 245,90",
    type: "expense",
    icon: CreditCard,
  },
  {
    name: "Internet",
    category: "Moradia",
    date: "18 Nov, 2026",
    value: "- R$ 99,90",
    type: "expense",
    icon: CreditCard,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-800">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
              <Wallet size={22} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Finora<span className="text-blue-600">.</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-9 md:flex">
            <Link href="#inicio" className="text-sm font-medium text-slate-600 transition hover:text-blue-600">
              Início
            </Link>
            <Link href="#funcionalidades" className="text-sm font-medium text-slate-600 transition hover:text-blue-600">
              Funcionalidades
            </Link>
            <Link href="#sobre" className="text-sm font-medium text-slate-600 transition hover:text-blue-600">
              Sobre
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:block"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              Começar agora
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="inicio" className="relative px-6 pb-24 pt-24 lg:px-10 lg:pb-32 lg:pt-32">
        <div className="pointer-events-none absolute -right-40 -top-20 h-[500px] w-[500px] rounded-full bg-blue-100/60 blur-[100px]" />
        <div className="pointer-events-none absolute -left-40 top-80 h-[350px] w-[350px] rounded-full bg-sky-100/60 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div className="max-w-2xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-xs font-semibold tracking-wide text-blue-700">
                ORGANIZE SUAS FINANÇAS COM MAIS CLAREZA
              </span>
            </div>

            <h1 className="text-5xl font-bold leading-[1.12] tracking-tight text-slate-900 sm:text-6xl lg:text-[68px]">
              Seu dinheiro.
              <br />
              Seu <span className="text-blue-600">controle.</span>
              <br />
              Sua visão.
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-8 text-slate-500">
              Tenha suas finanças sob controle. Organize seus gastos,
              acompanhe suas receitas e transforme seus objetivos em
              conquistas.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/cadastro"
                className="flex items-center gap-3 rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white shadow-xl shadow-blue-200 transition hover:-translate-y-1 hover:bg-blue-700"
              >
                Criar minha conta
                <ArrowRight size={19} />
              </Link>

              <Link
                href="#funcionalidades"
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-7 py-4 font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50"
              >
                Conhecer o Finora
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-blue-600" />
                Organização financeira
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-blue-600" />
                Simples e intuitivo
              </span>
            </div>
          </div>

          {/* DASHBOARD PREVIEW */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rounded-[40px] bg-blue-100/60 blur-2xl" />

            <div className="relative rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl shadow-blue-100/70 sm:p-7">
              <div className="mb-7 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <LayoutDashboard size={21} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Visão geral</h3>
                    <p className="text-xs text-slate-400">Seu resumo financeiro</p>
                  </div>
                </div>
                <span className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500">
                  Novembro 2026
                </span>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 p-6 text-white shadow-lg shadow-blue-200">
                <p className="text-sm text-blue-100">Saldo disponível</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                  R$ 8.450,00
                </h2>
                <div className="mt-5 flex items-center gap-2 text-sm text-blue-100">
                  <TrendingUp size={17} />
                  <span>Exemplo de saldo financeiro</span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-100 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="rounded-lg bg-green-50 p-2 text-green-600">
                      <TrendingUp size={17} />
                    </div>
                    Receitas
                  </div>
                  <p className="mt-3 text-xl font-bold text-slate-800">
                    R$ 5.200
                  </p>
                  <p className="mt-1 text-xs text-green-600">Entradas do mês</p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="rounded-lg bg-red-50 p-2 text-red-500">
                      <TrendingDown size={17} />
                    </div>
                    Despesas
                  </div>
                  <p className="mt-3 text-xl font-bold text-slate-800">
                    R$ 2.150
                  </p>
                  <p className="mt-1 text-xs text-red-500">Saídas do mês</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-slate-800">
                    Últimas movimentações
                  </h4>
                  <span className="text-xs font-semibold text-blue-600">
                    Demonstração
                  </span>
                </div>

                <div className="space-y-4">
                  {transactions.map((transaction) => {
                    const Icon = transaction.icon;
                    const isIncome = transaction.type === "income";

                    return (
                      <div
                        key={transaction.name}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            isIncome
                              ? "bg-green-50 text-green-600"
                              : "bg-slate-100 text-slate-500"
                          }`}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-700">
                              {transaction.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {transaction.category}
                            </p>
                          </div>
                        </div>
                        <span className={`text-sm font-bold ${
                          isIncome ? "text-green-600" : "text-slate-700"
                        }`}>
                          {transaction.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-blue-50 p-4 text-center">
                <p className="text-xs font-medium text-blue-700">
                  Uma visão mais clara das suas finanças começa aqui.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 hidden items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:flex">
              <div className="rounded-xl bg-green-50 p-3 text-green-600">
                <TrendingUp size={22} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Controle financeiro</p>
                <p className="text-sm font-bold text-slate-800">
                  Mais organização
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="funcionalidades"
        className="border-y border-slate-100 bg-slate-50/70 px-6 py-24 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Funcionalidades
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Tudo o que você precisa para organizar seu dinheiro.
            </h2>
            <p className="mt-5 leading-7 text-slate-500">
              Ferramentas pensadas para ajudar você a entender, organizar e
              planejar sua vida financeira.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-slate-800">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="sobre" className="px-6 py-24 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Sobre o Finora
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              Suas finanças merecem mais organização.
            </h2>
            <p className="mt-6 leading-8 text-slate-500">
              O Finora nasceu com uma proposta simples: tornar o gerenciamento
              financeiro mais acessível, organizado e fácil de entender.
            </p>
            <p className="mt-4 leading-8 text-slate-500">
              Acompanhe suas movimentações, entenda seus hábitos e tenha mais
              clareza para tomar decisões sobre seu dinheiro.
            </p>

            <Link
              href="/cadastro"
              className="mt-8 inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:gap-4"
            >
              Conheça o Finora
              <ChevronRight size={19} />
            </Link>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-8 sm:p-12">
            <div className="mx-auto flex max-w-sm flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-200">
                <Wallet size={38} />
              </div>
              <h3 className="mt-8 text-3xl font-bold text-slate-900">
                Finora<span className="text-blue-600">.</span>
              </h3>
              <p className="mt-4 text-lg font-medium text-slate-600">
                Seu dinheiro. Seu controle. Sua visão.
              </p>
              <div className="mt-8 h-1 w-16 rounded-full bg-blue-500" />
              <p className="mt-6 text-sm leading-7 text-slate-500">
                Mais clareza para suas escolhas. Mais organização para seus
                objetivos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 lg:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 px-7 py-16 text-center shadow-xl shadow-blue-200 sm:px-16">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Comece a organizar suas finanças.
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-blue-100">
            Tenha mais clareza sobre seu dinheiro e construa uma relação mais
            organizada com suas finanças.
          </p>
          <Link
            href="/cadastro"
            className="mt-9 inline-flex items-center gap-3 rounded-xl bg-white px-7 py-4 font-bold text-blue-700 shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
          >
            Começar agora
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-white px-6 py-10 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Wallet size={19} />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Finora<span className="text-blue-600">.</span>
            </span>
          </Link>

          <p className="text-center text-sm text-slate-400">
            © {new Date().getFullYear()} Finora. Todos os direitos reservados.
          </p>

          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="#inicio" className="transition hover:text-blue-600">
              Início
            </Link>
            <Link href="#sobre" className="transition hover:text-blue-600">
              Sobre
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
