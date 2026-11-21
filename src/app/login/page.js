"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Wallet } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setMensagem("");
    setCarregando(true);

    try {
      const resposta = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const resultado = await resposta.json();
      setMensagem(resultado.mensagem || "Não foi possível entrar.");
    } catch {
      setMensagem("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12">
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-100/70 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-sky-100/70 blur-3xl" />
      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700">
          <ArrowLeft size={16} /> Voltar ao início
        </Link>
        <section className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-10">
          <Link href="/" className="mx-auto flex w-fit items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200"><Wallet size={22} /></span>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Finora<span className="text-blue-600">.</span></span>
          </Link>
          <div className="mb-8 mt-9 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><LockKeyhole size={22} /></span>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900">Bem-vindo de volta</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Entre na sua conta para continuar seu planejamento.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">E-mail</label>
              <input id="email" name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
            </div>
            <div>
              <label htmlFor="senha" className="mb-2 block text-sm font-semibold text-slate-700">Senha</label>
              <div className="relative">
                <input id="senha" name="senha" type={mostrarSenha ? "text" : "password"} autoComplete="current-password" placeholder="Digite sua senha" value={senha} onChange={(event) => setSenha(event.target.value)} required className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"} className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 hover:text-slate-700">{mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>
            {mensagem && <p role="status" className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">{mensagem}</p>}
            <button type="submit" disabled={carregando} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70">{carregando ? "Verificando..." : "Entrar"}{!carregando && <ArrowRight size={17} />}</button>
          </form>
          <p className="mt-7 text-center text-sm text-slate-500">Ainda não tem uma conta? <Link href="/cadastro" className="font-semibold text-blue-600 hover:text-blue-700">Começar agora</Link></p>
        </section>
        <p className="mt-6 text-center text-xs text-slate-400">Mais clareza para suas escolhas financeiras.</p>
      </div>
    </main>
  );
}
