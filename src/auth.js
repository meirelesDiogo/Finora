import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Google, // usa AUTH_GOOGLE_ID e AUTH_GOOGLE_SECRET
    Credentials({
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        return valid ? { id: user.id, name: user.name, email: user.email } : null;
      },
    }),
  ],
  callbacks: {
    // Garante que quem entra com Google também exista na tabela User
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        const email = profile.email.toLowerCase();
        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: { email, name: profile.name ?? "Usuário", avatar: profile.picture ?? null },
        });
        token.sub = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
