import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "finora_sessao";
function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("Configure SESSION_SECRET para ativar as sessões.");
  return value;
}
function sign(value) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}
export function createSessionToken(userId) {
  const payload = Buffer.from(JSON.stringify({ id: String(userId), exp: Date.now() + 1000 * 60 * 60 * 24 * 30 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}
export async function currentUserId() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.exp > Date.now() ? data.id : null;
  } catch { return null; }
}
export const sessionCookie = cookieName;
