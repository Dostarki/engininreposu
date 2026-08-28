import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getShowById } from "@/lib/shows";
import AdminShowEditClient from "@/components/AdminShowEditClient";

export default function AdminShowEditPage({ params, searchParams }: { params: { id: string }; searchParams: { err?: string } }) {
  const u = getSessionUser();
  if (!u) redirect("/admin");
  const id = parseInt(params.id, 10);
  const show = getShowById(id);
  if (!show) notFound();
  const err = searchParams.err === "1";
  return <AdminShowEditClient show={show} err={err} />;
}
