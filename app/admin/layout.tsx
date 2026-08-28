import { unreadCounts } from "@/lib/forms";
import { getSessionUser } from "@/lib/auth";
import { getSetting } from "@/lib/db";
import AdminLayoutClient from "@/components/AdminLayoutClient";

export const metadata = { title: "Yönetici Paneli | Megastar Organizasyon", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = getSessionUser();
  if (!user) {
    return <>{children}</>;
  }
  const counts = unreadCounts();
  const siteLogo = getSetting("site_logo", "") || "/megastar-logo.svg";
  return (
    <AdminLayoutClient initialCounts={counts} username={user?.username || "hamdullaherdem"} siteLogo={siteLogo}>
      {children}
    </AdminLayoutClient>
  );
}
