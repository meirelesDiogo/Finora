import { redirect } from "next/navigation";
import { currentUserId } from "@/lib/auth";
import Organizacao from "@/components/organizacao";
export const instant = false;
export default async function ProjetosPage(){if(!(await currentUserId()))redirect("/login");return <Organizacao tipo="projeto"/>;}
