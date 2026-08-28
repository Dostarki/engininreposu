"use client";

import { useState } from "react";
import {
  CalendarClock,
  Check,
  X,
  Trash2,
  Mail,
  Phone,
  User,
  Clock,
  Search,
  AlertTriangle,
  Hotel,
  Star,
  Filter,
} from "lucide-react";
import type { OrientalReservation } from "@/lib/forms";

interface Props { items: OrientalReservation[]; }

type StatusFilter = "all" | "0" | "1" | "2";

const STATUS_META: Record<string, { label: string; color: string; dot: string }> = {
  "0": { label: "Beklemede", color: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-400" },
  "1": { label: "Onaylandı · Dolu", color: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  "2": { label: "Reddedildi", color: "bg-rose-100 text-rose-700 border-rose-200", dot: "bg-rose-500" },
};

export default function AdminOrientalClient({ items }: Props) {
  const [q, setQ] = useState("");
  const [list, setList] = useState(items);
  const [confirm, setConfirm] = useState<{ id: number | null; type: "delete" | "reject" | "approve" }>({ id: null, type: "delete" });
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = list.filter(x => {
    const matchQ = !q || `${x.full_name} ${x.hotel} ${x.email} ${x.phone} ${x.event_date} ${x.event_time} ${x.custom_time}`.toLowerCase().includes(q.toLowerCase());
    const matchR = !onlyUnread || x.read_status === 0;
    const matchS = statusFilter === "all" || String(x.status) === statusFilter;
    return matchQ && matchR && matchS;
  });

  async function update(id: number, action: "read" | "delete" | "approve" | "reject") {
    const r = await fetch("/api/admin/oriental", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, id }),
    });
    if (!r.ok) return;
    if (action === "delete") {
      setList(prev => prev.filter(x => x.id !== id));
      return;
    }
    if (action === "read") {
      setList(prev => prev.map(x => x.id === id ? { ...x, read_status: 1 } : x));
      return;
    }
    if (action === "approve") {
      setList(prev => prev.map(x => x.id === id ? { ...x, status: 1 } : x));
    } else if (action === "reject") {
      setList(prev => prev.map(x => x.id === id ? { ...x, status: 2 } : x));
    }
  }

  const stats = {
    pending: list.filter(x => x.status === 0).length,
    approved: list.filter(x => x.status === 1).length,
    rejected: list.filter(x => x.status === 2).length,
    total: list.length,
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <CalendarClock className="w-8 h-8 text-amber-500" /> Oryantal Randevular
          </h1>
          <p className="text-slate-500 mt-1">Toplam {stats.total} kayıt • {stats.pending} beklemede • {stats.approved} onaylı (dolu) • {list.filter(x => !x.read_status).length} okunmamış</p>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Toplam", value: stats.total, color: "from-slate-400 to-slate-600" },
          { label: "Bekleyen", value: stats.pending, color: "from-amber-400 to-orange-500" },
          { label: "Onaylanan (Dolu)", value: stats.approved, color: "from-emerald-400 to-teal-500" },
          { label: "Reddedilen", value: stats.rejected, color: "from-rose-400 to-pink-500" },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-5 text-white bg-gradient-to-br ${s.color} shadow-lg`}>
            <div className="text-3xl font-bold mb-1">{s.value}</div>
            <div className="text-xs uppercase tracking-wider opacity-85">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 bg-white rounded-xl border border-slate-200 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="İsim, otel, tarih, telefon ara..."
            className="pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition w-full"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400" />
          {(["all", "0", "1", "2"] as StatusFilter[]).map(k => (
            <button
              key={k}
              onClick={() => setStatusFilter(k)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                statusFilter === k
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {k === "all" ? "Tümü" : STATUS_META[k].label}
            </button>
          ))}
        </div>
        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer select-none ml-auto">
          <input type="checkbox" className="accent-amber-500 w-4 h-4" checked={onlyUnread} onChange={e => setOnlyUnread(e.target.checked)} />
          <span className="text-sm font-medium">Sadece okunmamış</span>
        </label>
      </div>

      {confirm.id !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                confirm.type === "delete" ? "bg-red-100 text-red-600" :
                confirm.type === "approve" ? "bg-emerald-100 text-emerald-600" :
                "bg-rose-100 text-rose-600"
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  {confirm.type === "delete" && "Rezervasyonu sil?"}
                  {confirm.type === "approve" && "Rezervasyonu onayla?"}
                  {confirm.type === "reject" && "Rezervasyonu reddet?"}
                </h3>
                <p className="text-sm text-slate-500">
                  {confirm.type === "delete" && "Silinen rezervasyonlar geri getirilemez. Kayıt tamamen kaldırılır."}
                  {confirm.type === "approve" && "Onayladığınızda bu tarih ve saat dolu olarak işaretlenir. Diğer müşteriler seçemez."}
                  {confirm.type === "reject" && "Reddedilen rezervasyon dolu olarak işaretlenmez, başka müşteri seçebilir."}
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirm({ id: null, type: "delete" })} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition">
                İptal
              </button>
              <button onClick={() => { update(confirm.id!, confirm.type); setConfirm({ id: null, type: "delete" }); }} className={`px-4 py-2 rounded-lg text-white font-medium transition ${
                confirm.type === "delete" ? "bg-red-500 hover:bg-red-600" :
                confirm.type === "approve" ? "bg-emerald-500 hover:bg-emerald-600" :
                "bg-rose-500 hover:bg-rose-600"
              }`}>
                {confirm.type === "delete" ? "Evet, Sil" : confirm.type === "approve" ? "Onayla" : "Reddet"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center text-slate-500">
            <CalendarClock className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>Randevu bulunamadı.</p>
          </div>
        )}
        {filtered.map(a => {
          const meta = STATUS_META[String(a.status)];
          const displayTime = a.event_time === "custom" ? `Özel: ${a.custom_time || "—"}` : (a.event_time || "—");
          return (
            <div key={a.id} className={`bg-white rounded-xl border overflow-hidden transition ${a.read_status ? "border-slate-200" : "border-amber-300 shadow-md shadow-amber-100"}`}>
              <div className="flex flex-col lg:flex-row lg:items-stretch">
                <div className="flex-1 p-6">
                  <div className="flex flex-wrap items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
                      {a.full_name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-lg">{a.full_name}</h3>
                        {a.read_status === 0 && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold">
                            YENİ
                          </span>
                        )}
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${meta.color}`}>
                          <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                          {meta.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                        <span className="inline-flex items-center gap-1">
                          <CalendarClock className="w-3.5 h-3.5" /> <strong className="text-slate-700">{a.event_date}</strong> · {displayTime}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500" /> {a.show_name || "Oryantal"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                        {a.hotel && <span className="inline-flex items-center gap-1"><Hotel className="w-3.5 h-3.5" /> {a.hotel}</span>}
                        {a.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> <a href={`tel:${a.phone}`} className="hover:text-amber-600">{a.phone}</a></span>}
                        {a.email && <span className="inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> <a href={`mailto:${a.email}`} className="hover:text-amber-600">{a.email}</a></span>}
                        <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(a.created_at).toLocaleString("tr-TR")}</span>
                      </div>
                    </div>
                  </div>
                  {a.notes && (
                    <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-semibold">Ek Not / İstekler</div>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-wrap break-words">{a.notes}</p>
                    </div>
                  )}
                </div>
                <div className="flex lg:flex-col flex-wrap gap-2 p-4 lg:p-6 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-100 lg:w-48 shrink-0 justify-end lg:justify-start">
                  {a.read_status === 0 && (
                    <button
                      onClick={() => update(a.id, "read")}
                      title="Okundu İşaretle"
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-800 text-white font-medium text-sm transition"
                    >
                      <Check className="w-4 h-4" /> Okundu
                    </button>
                  )}
                  {a.status !== 1 && a.status !== 2 && (
                    <button
                      onClick={() => setConfirm({ id: a.id, type: "approve" })}
                      title="Onayla (Dolu yap)"
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition"
                    >
                      <Check className="w-4 h-4" /> Onayla
                    </button>
                  )}
                  {a.status === 1 && (
                    <button
                      onClick={() => setConfirm({ id: a.id, type: "reject" })}
                      title="Onayı geri al / Reddet"
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm transition"
                    >
                      <X className="w-4 h-4" /> Geri Al
                    </button>
                  )}
                  {a.status !== 2 && a.status !== 1 && (
                    <button
                      onClick={() => setConfirm({ id: a.id, type: "reject" })}
                      title="Reddet"
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-medium text-sm transition"
                    >
                      <X className="w-4 h-4" /> Reddet
                    </button>
                  )}
                  <button
                    onClick={() => setConfirm({ id: a.id, type: "delete" })}
                    title="Kalıcı olarak sil"
                    className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-medium text-sm transition"
                  >
                    <Trash2 className="w-4 h-4" /> Sil
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
