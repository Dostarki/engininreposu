import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getAllSettings, getAllReferences } from "@/lib/db";
import AdminSettingsClient from "@/components/AdminSettingsClient";

export default function AdminSettingsPage({ searchParams }: { searchParams: { ok?: string; tab?: string } }) {
  const u = getSessionUser();
  if (!u) redirect("/admin");
  const s = getAllSettings();
  const refs = getAllReferences();
  const ok = searchParams.ok === "1";
  const TABS = ["general", "branding", "references"];
  const activeTab = TABS.includes(searchParams.tab || "") ? searchParams.tab! : "general";

  return (
    <AdminSettingsClient
      initialSettings={s}
      initialRefs={JSON.parse(JSON.stringify(refs))}
      initOk={ok}
      initTab={activeTab}
    />
  );
}
