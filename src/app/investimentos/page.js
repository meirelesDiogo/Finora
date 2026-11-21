import { redirect } from "next/navigation";
import { currentUserId } from "@/lib/auth";
import Carteira from "./ui";

export const instant = false;

export default async function InvestimentosPage() {
  if (!(await currentUserId())) redirect("/login");
  return <Carteira />;
}
