"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { GoogleButton } from "@/components/ui/google-button";

const input =
  "h-11 w-full rounded-xl border border-[#1E2430] bg-[#0A0D14] px-4 text-sm text-[#EDF0F5] placeholder:text-[#8A93A6] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#2E8BFF]";

export function AuthForm({ mode }) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));

    if (isRegister) {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "Não foi possível criar sua conta. Tente novamente.");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", { email: data.email, password: data.password, redirect: false });
    if (result?.error) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-[#1E2430] bg-[#10141D] p-8">
      <h1 className="text-2xl font-bold tracking-tight">{isRegister ? "Criar conta" : "Entrar"}</h1>
      <p className="mt-2 text-sm text-[#8A93A6]">
        {isRegister ? "Comece a organizar seu dinheiro em poucos minutos." : "Acesse seu painel financeiro."}
      </p>

      <div className="mt-6">
        <GoogleButton label={isRegister ? "Cadastrar com Google" : "Entrar com Google"} />
      </div>

      <div className="my-6 flex items-center gap-3 text-xs text-[#8A93A6]" role="separator">
        <span className="h-px flex-1 bg-[#1E2430]" /> ou use seu e-mail <span className="h-px flex-1 bg-[#1E2430]" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {isRegister && (
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm">Nome</label>
            <input id="name" name="name" required minLength={2} autoComplete="name" className={input} />
          </div>
        )}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm">E-mail</label>
          <input id="email" name="email" type="email" required autoComplete="email" className={input} />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm">Senha</label>
          <input id="password" name="password" type="password" required minLength={8} autoComplete={isRegister ? "new-password" : "current-password"} className={input} />
          {isRegister && <p className="mt-1.5 text-xs text-[#8A93A6]">Mínimo de 8 caracteres.</p>}
        </div>

        {error && <p role="alert" className="rounded-lg border border-[#F43F5E]/40 bg-[#F43F5E]/10 px-3 py-2 text-sm text-[#F43F5E]">{error}</p>}

        <button type="submit" disabled={loading} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2E8BFF] text-sm font-medium text-white transition hover:bg-[#4A9BFF] disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {isRegister ? "Criar conta" : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#8A93A6]">
        {isRegister ? "Já tem conta? " : "Ainda não tem conta? "}
        <Link href={isRegister ? "/login" : "/register"} className="text-[#2E8BFF] hover:underline">
          {isRegister ? "Entrar" : "Criar conta"}
        </Link>
      </p>
    </div>
  );
}
