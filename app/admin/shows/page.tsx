import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getAllShows } from "@/lib/shows";
import AdminShowsClient from "@/components/AdminShowsClient";

export default function AdminShowsPage() {
  const u = getSessionUser();
  if (!u) redirect("/admin");
  const shows = getAllShows();
  return <AdminShowsClient shows={shows} />;
}
