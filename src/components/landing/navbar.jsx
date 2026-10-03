import Link from "next/link";

const links = [
  { href: "#recursos", label: "Recursos" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#relatorios", label: "Relatórios" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#1E2430] bg-[#0A0D14]/80 backdrop-blur">
      <nav aria-label="Principal" className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="bg-gradient-to-r from-[#2E8BFF] to-[#7C5CFF] bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
          Finora
        </Link>
        <ul className="hidden items-center gap-8 text-sm text-[#8A93A6] md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="transition hover:text-[#EDF0F5]">{l.label}</a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Link href="/login" className="rounded-lg px-4 py-2 text-sm text-[#EDF0F5] transition hover:bg-[#10141D]">
            Entrar
          </Link>
          <Link href="/register" className="rounded-lg bg-[#2E8BFF] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4A9BFF]">
            Começar agora
          </Link>
        </div>
      </nav>
    </header>
  );
}
