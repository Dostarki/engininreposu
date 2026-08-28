import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getAllCareerApplications } from "@/lib/forms";
import AdminApplicationsClient from "@/components/AdminApplicationsClient";

export default function Page() {
  const u = getSessionUser();
  if (!u) redirect("/admin");
  const items = getAllCareerApplications();
  return <AdminApplicationsClient items={items} />;
}
