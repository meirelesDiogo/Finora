import { NextResponse } from "next/server";
import { sessionCookie } from "@/lib/auth";
export async function POST() {
  const response = NextResponse.json({ mensagem: "Sessão encerrada." });
  response.cookies.set(sessionCookie, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}
