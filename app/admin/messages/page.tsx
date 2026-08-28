import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getAllContactMessages } from "@/lib/forms";
import AdminMessagesClient from "@/components/AdminMessagesClient";

export default function Page() {
  const u = getSessionUser();
  if (!u) redirect("/admin");
  const items = getAllContactMessages();
  return <AdminMessagesClient items={items} />;
}
