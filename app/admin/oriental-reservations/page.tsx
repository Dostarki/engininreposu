import { getAllOrientalReservations } from "@/lib/db";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AdminOrientalClient from "@/components/AdminOrientalClient";

export const metadata = { title: "Oryantal Randevular | Megastar Yönetim", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminOrientalReservationsPage() {
  const u = getSessionUser();
  if (!u) redirect("/admin");
  const items = getAllOrientalReservations();
  return <AdminOrientalClient items={items} />;
}
