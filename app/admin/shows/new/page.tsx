import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AdminShowNewClient from "@/components/AdminShowNewClient";

export default function AdminShowNewPage({ searchParams }: { searchParams: { err?: string } }) {
  const u = getSessionUser();
  if (!u) redirect("/admin");
  const err = searchParams.err === "1";
  return <AdminShowNewClient err={err} />;
}
