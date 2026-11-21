"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Wallet, LayoutDashboard, ArrowLeftRight, Tag, FolderKanban, ChartNoAxesCombined, LogOut, Moon, Sun, BriefcaseBusiness } from "lucide-react";

const links = [
  ["/dashboard", "Painel", LayoutDashboard],
  ["/investimentos", "Modo Banco", BriefcaseBusiness],
  ["/transacoes", "Movimentações", ArrowLeftRight],
  ["/categorias", "Categorias", Tag],
  ["/projetos", "Projetos", FolderKanban],
  ["/relatorios", "Relatórios", ChartNoAxesCombined],
];

export default function Navegacao() {
  const path = usePathname();
  const router = useRouter();
  const [escuro, setEscuro] = useState(false);
  useEffect(() => {
    const preferencia = localStorage.getItem("finora-tema") === "escuro";
    setEscuro(preferencia);
    document.documentElement.classList.toggle("dark", preferencia);
  }, []);
  function alternarTema() {
    const novoTema = !escuro;
    setEscuro(novoTema);
    document.documentElement.classList.toggle("dark", novoTema);
    localStorage.setItem("finora-tema", novoTema ? "escuro" : "claro");
  }
  async function sair() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }
  const linkClasses = (href, mobile = false) => {
    const base = mobile ? "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold " : "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ";
    return base + (path === href ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800");
  };
  return <header className="border-b border-slate-200 bg-white">
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
      <Link href="/dashboard" className="flex shrink-0 items-center gap-3"><span className="rounded-xl bg-blue-600 p-2.5 text-white"><Wallet size={21}/></span><span className="text-xl font-bold text-slate-900">Finora<span className="text-blue-600">.</span></span></Link>
      <nav aria-label="Navegação principal" className="hidden items-center gap-1 lg:flex">{links.map(([href,label,Icon])=><Link key={href} href={href} className={linkClasses(href)}><Icon size={17}/>{label}</Link>)}</nav>
      <div className="flex items-center gap-1"><button onClick={alternarTema} aria-label={escuro?"Ativar tema claro":"Ativar tema escuro"} title={escuro?"Tema claro":"Tema escuro"} className="rounded-lg p-2.5 text-slate-500 hover:bg-slate-100">{escuro?<Sun size={19}/>:<Moon size={19}/>}</button><button onClick={sair} className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"><LogOut size={17}/><span className="hidden sm:inline">Sair</span></button></div>
    </div>
    <nav aria-label="Navegação móvel" className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2 lg:hidden">{links.map(([href,label,Icon])=><Link key={href} href={href} className={linkClasses(href,true)}><Icon size={15}/>{label}</Link>)}</nav>
  </header>;
}
