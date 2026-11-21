import { redirect } from "next/navigation";
import { currentUserId } from "@/lib/auth";
import Relatorios from "./ui";
export const instant = false;
export default async function RelatoriosPage(){if(!(await currentUserId()))redirect("/login");return <Relatorios/>;}
