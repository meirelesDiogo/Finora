import { redirect } from "next/navigation";
import { currentUserId } from "@/lib/auth";
import Transacoes from "./ui";
export const instant = false;
export default async function TransacoesPage(){if(!(await currentUserId()))redirect("/login");return <Transacoes/>;}
