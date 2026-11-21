"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Cadastro() {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [senha, setSenha] = useState(""); const [mensagem, setMensagem] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setMensagem("");
    try { const response = await fetch("/api/cadastro", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, senha }) }); const data = await response.json(); if (!response.ok) throw new Error(data.mensagem); router.push("/dashboard"); }
    catch (error) { setMensagem(error.message || "Não foi possível criar a conta."); } finally { setBusy(false); }
  }
  return <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12"><div className="w-full max-w-md"><Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500"><ArrowLeft size={16}/> Voltar ao início</Link><section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10"><Link href="/" className="mx-auto flex w-fit items-center gap-2"><span className="rounded-xl bg-blue-600 p-3 text-white"><Wallet/></span><b className="text-2xl text-slate-900">Finora<span className="text-blue-600">.</span></b></Link><h1 className="mt-8 text-center text-2xl font-bold text-slate-900">Crie sua conta</h1><p className="mt-2 text-center text-sm text-slate-500">Comece a organizar seu dinheiro hoje.</p><form onSubmit={submit} className="mt-8 space-y-5"><div><label htmlFor="email" className="mb-2 block text-sm font-semibold">E-mail</label><input id="email" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="voce@exemplo.com"/></div><div><label htmlFor="senha" className="mb-2 block text-sm font-semibold">Senha</label><input id="senha" type="password" autoComplete="new-password" minLength={8} required value={senha} onChange={e=>setSenha(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Pelo menos 8 caracteres"/></div>{mensagem&&<p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{mensagem}</p>}<button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">{busy?"Criando conta...":"Criar conta"}<ArrowRight size={17}/></button></form><p className="mt-7 text-center text-sm text-slate-500">Já tem uma conta? <Link href="/login" className="font-semibold text-blue-600">Entrar</Link></p></section></div></main>;
}
