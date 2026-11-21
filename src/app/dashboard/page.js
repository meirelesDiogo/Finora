import { redirect } from "next/navigation";
import { currentUserId } from "@/lib/auth";
import Dashboard from "./ui";
export const instant = false;
export default async function DashboardPage() {
  if (!(await currentUserId())) redirect("/login");
  return <Dashboard />;
}
