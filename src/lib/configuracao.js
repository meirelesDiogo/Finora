export function variavelDeAmbienteAusente() {
  if (!process.env.DATABASE_URL) return "DATABASE_URL";
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) return "SESSION_SECRET";
  return null;
}

export function respostaConfiguracaoAusente(nome) {
  return `A publicação ainda não está configurada: falta ${nome} nas variáveis de ambiente da Vercel. Configure e publique novamente.`;
}
