import Link from "next/link";
import { getAllShows } from "@/lib/shows";
import { getAllCareerApplications, getAllContactMessages, unreadCounts } from "@/lib/forms";
import { getAllOrientalReservations } from "@/lib/db";
import {
  Drama,
  Briefcase,
  MessageSquare,
  ArrowRight,
  Star,
  Clock,
  CheckCircle2,
  CalendarClock,
} from "lucide-react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const u = getSessionUser();
  if (!u) redirect("/admin");
  const shows = getAllShows();
  const apps = getAllCareerApplications();
  const msgs = getAllContactMessages();
  const reservations = getAllOrientalReservations();
  const counts = unreadCounts();

  const stats = [
    { label: "Toplam Show", value: shows.length, Icon: Drama, color: "from-amber-400 to-orange-500", href: "/admin/shows" },
    { label: "Oryantal Randevu", value: reservations.length, Icon: CalendarClock, color: "from-fuchsia-400 to-purple-500", href: "/admin/oriental-reservations", badge: counts.orientalPending || counts.oriental || 0 },
    { label: "Kariyer Başvurusu", value: apps.length, Icon: Briefcase, color: "from-emerald-400 to-teal-500", href: "/admin/applications", badge: counts.career },
    { label: "İletişim Mesajı", value: msgs.length, Icon: MessageSquare, color: "from-sky-400 to-indigo-500", href: "/admin/messages", badge: counts.contact },
  ];

  const lastApps = apps.slice(0, 5);
  const lastMsgs = msgs.slice(0, 5);
  const lastReservations = reservations.slice(0, 5);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hoş geldin, @{u.username} 👋</h1>
          <p className="text-slate-500 mt-1">Bugün neler oluyor? Yeni başvuruları ve mesajları inceleyelim.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href="/admin/shows/new" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 font-semibold shadow hover:shadow-lg hover:scale-[1.02] transition">
            + Yeni Show Ekle
          </Link>
          <Link href="/admin/settings" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-white hover:border-slate-400 transition">
            Site Ayarları
          </Link>
        </div>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ label, value, Icon, color, href, badge }) => (
          <Link key={label} href={href} className="group bg-white rounded-xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-5">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg shadow-black/10`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              {badge && badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[22px] h-5 px-1.5 flex items-center justify-center">
                  {badge} Yeni
                </span>
              )}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
                <div className="text-sm text-slate-500">{label}</div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* last applications */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Son Kariyer Başvuruları</h2>
                <p className="text-xs text-slate-500">{counts.career} okunmamış</p>
              </div>
            </div>
            <Link href="/admin/applications" className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
              Tümü <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {lastApps.length === 0 && (
              <div className="p-10 text-center text-slate-500 text-sm">Henüz başvuru yok.</div>
            )}
            {lastApps.map(a => (
              <div key={a.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                  {a.full_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-slate-900 truncate">{a.full_name}</div>
                    {a.read_status === 0 && (
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    )}
                  </div>
                  <div className="text-xs text-slate-500 truncate">{a.position} • {a.phone || a.email || "—"}</div>
                </div>
                <div className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(a.created_at).toLocaleDateString("tr-TR")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* last messages */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Son İletişim Mesajları</h2>
                <p className="text-xs text-slate-500">{counts.contact} okunmamış</p>
              </div>
            </div>
            <Link href="/admin/messages" className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
              Tümü <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {lastMsgs.length === 0 && (
              <div className="p-10 text-center text-slate-500 text-sm">Henüz mesaj yok.</div>
            )}
            {lastMsgs.map(m => (
              <div key={m.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-100 to-indigo-100 text-sky-700 flex items-center justify-center font-bold text-sm shrink-0">
                  {m.full_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-slate-900 truncate">{m.full_name}</div>
                    {m.read_status === 0 && (
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                    )}
                    {m.subject && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full truncate max-w-[120px]">{m.subject}</span>}
                  </div>
                  <div className="text-xs text-slate-500 truncate">{m.message || "—"}</div>
                </div>
                <div className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(m.created_at).toLocaleDateString("tr-TR")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* last oriental reservations */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Son Oryantal Randevular</h2>
              <p className="text-xs text-slate-500">{counts.orientalPending || 0} beklemede · {reservations.filter(r => r.status === 1).length} onaylı</p>
            </div>
          </div>
          <Link href="/admin/oriental-reservations" className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
            Tümü <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {lastReservations.length === 0 && (
            <div className="p-10 text-center text-slate-500 text-sm">Henüz randevu yok.</div>
          )}
          {lastReservations.map(r => {
            const timeDisplay = r.event_time === "custom" ? `Özel: ${r.custom_time || "—"}` : (r.event_time || "—");
            const statusCls = r.status === 0 ? "bg-amber-100 text-amber-700 border border-amber-200" : r.status === 1 ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-rose-100 text-rose-700 border border-rose-200";
            const statusLabel = r.status === 0 ? "Beklemede" : r.status === 1 ? "Onaylandı" : "Reddedildi";
            return (
              <div key={r.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-100 to-purple-100 text-fuchsia-700 flex items-center justify-center font-bold text-sm shrink-0">
                  {r.full_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-slate-900 truncate">{r.full_name}</div>
                    {r.read_status === 0 && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCls}`}>{statusLabel}</span>
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {r.event_date} · {timeDisplay} {r.hotel ? `· ${r.hotel}` : ""}
                  </div>
                </div>
                <div className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(r.created_at).toLocaleDateString("tr-TR")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* quick info */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-yellow-500/20 blur-3xl" />
        <div className="relative grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs font-bold mb-4">
              <CheckCircle2 className="w-3.5 h-3.5" /> İPUCU
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">Site ayarlarını unutmayın!</h3>
            <p className="text-white/70 max-w-xl">
              WhatsApp numaranızı, iletişim bilgilerinizi, ana sayfa yazılarını ve SEO metinlerini
              <span className="text-yellow-400 font-semibold"> Site Ayarları </span>
              bölümünden güncelleyebilirsiniz.
            </p>
          </div>
          <Link href="/admin/settings" className="md:justify-self-end inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 font-semibold hover:scale-105 transition">
            Ayarları Aç <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
