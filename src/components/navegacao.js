"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Wallet, LayoutDashboard, ArrowLeftRight, Tag, FolderKanban, ChartNoAxesCombined, LogOut } from "lucide-react";

const links = [
  ["/dashboard", "Painel", LayoutDashboard],
  ["/transacoes", "Movimentações", ArrowLeftRight],
  ["/categorias", "Categorias", Tag],
  ["/projetos", "Projetos", FolderKanban],
  ["/relatorios", "Relatórios", ChartNoAxesCombined],
];

export default function Navegacao() {
  const path = usePathname();
  const router = useRouter();
  async function sair() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }
  return <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4"><Link href="/dashboard" className="flex shrink-0 items-center gap-3"><span className="rounded-xl bg-blue-600 p-2.5 text-white"><Wallet size={21}/></span><span className="text-xl font-bold text-slate-900">Finora<span className="text-blue-600">.</span></span></Link><nav aria-label="Navegação principal" className="hidden items-center gap-1 lg:flex">{links.map(([href,label,Icon])=><Link key={href} href={href} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${path===href?"bg-blue-50 text-blue-700":"text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}><Icon size={17}/>{label}</Link>)}</nav><button onClick={sair} className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100"><LogOut size={17}/><span className="hidden sm:inline">Sair</span></button></div><nav aria-label="Navegação móvel" className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2 lg:hidden">{links.map(([href,label,Icon])=><Link key={href} href={href} className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${path===href?"bg-blue-50 text-blue-700":"text-slate-500"}`}><Icon size={15}/>{label}</Link>)}</nav></header>;
}
