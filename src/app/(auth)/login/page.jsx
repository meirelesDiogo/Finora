import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Entrar — Finora" };

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#0A0D14] px-5 py-12 text-[#EDF0F5]">
      <Link href="/" className="bg-gradient-to-r from-[#2E8BFF] to-[#7C5CFF] bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
        Finora
      </Link>
      <AuthForm mode="login" />
    </main>
  );
}
