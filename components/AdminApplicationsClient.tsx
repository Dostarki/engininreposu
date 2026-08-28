"use client";

import { useState } from "react";
import {
  Briefcase,
  Check,
  Trash2,
  Mail,
  Phone,
  User,
  Clock,
  Search,
  AlertTriangle,
} from "lucide-react";
import { CareerApplication } from "@/lib/forms";

interface Props { items: CareerApplication[]; }

export default function AdminApplicationsClient({ items }: Props) {
  const [q, setQ] = useState("");
  const [list, setList] = useState(items);
  const [confirm, setConfirm] = useState<number | null>(null);
  const [onlyUnread, setOnlyUnread] = useState(false);

  const filtered = list.filter(x => {
    const matchQ = !q || `${x.full_name} ${x.position} ${x.email} ${x.phone}`.toLowerCase().includes(q.toLowerCase());
    const matchR = !onlyUnread || x.read_status === 0;
    return matchQ && matchR;
  });

  async function update(id: number, action: "read" | "delete") {
    const r = await fetch("/api/admin/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "career", action, id }),
    });
    if (!r.ok) return;
    if (action === "delete") setList(prev => prev.filter(x => x.id !== id));
    else setList(prev => prev.map(x => x.id === id ? { ...x, read_status: 1 } : x));
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Kariyer Başvuruları</h1>
          <p className="text-slate-500 mt-1">Toplam {list.length} başvuru • {list.filter(x => !x.read_status).length} okunmamış</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Ara..."
              className="pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition w-full sm:w-64"
            />
          </div>
          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition cursor-pointer select-none">
            <input type="checkbox" className="accent-amber-500 w-4 h-4" checked={onlyUnread} onChange={e => setOnlyUnread(e.target.checked)} />
            <span className="text-sm font-medium">Sadece okunmamış</span>
          </label>
        </div>
      </header>

      {confirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Başvuruyu sil?</h3>
                <p className="text-sm text-slate-500">Silinen başvurular geri getirilemez.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirm(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition">
                İptal
              </button>
              <button onClick={() => { update(confirm, "delete"); setConfirm(null); }} className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition">
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center text-slate-500">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>Başvuru bulunamadı.</p>
          </div>
        )}
        {filtered.map(a => (
          <div key={a.id} className={`bg-white rounded-xl border overflow-hidden transition ${a.read_status ? "border-slate-200" : "border-amber-300 shadow-md shadow-amber-100"}`}>
            <div className="flex flex-col md:flex-row md:items-stretch">
              <div className="flex-1 p-6">
                <div className="flex flex-wrap items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
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
                      {a.position && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium">
                          <Briefcase className="w-3 h-3" /> {a.position}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                      {a.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> <a href={`tel:${a.phone}`} className="hover:text-amber-600">{a.phone}</a></span>}
                      {a.email && <span className="inline-flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> <a href={`mailto:${a.email}`} className="hover:text-amber-600">{a.email}</a></span>}
                      <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(a.created_at).toLocaleString("tr-TR")}</span>
                    </div>
                  </div>
                </div>
                {a.message && (
                  <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-semibold">Ön Yazı / Özgeçmiş</div>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap break-words">{a.message}</p>
                  </div>
                )}
              </div>
              <div className="flex md:flex-col gap-2 p-4 md:p-6 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-100 md:w-40 shrink-0 justify-end md:justify-start">
                {a.read_status === 0 && (
                  <button
                    onClick={() => update(a.id, "read")}
                    title="Okundu İşaretle"
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition"
                  >
                    <Check className="w-4 h-4" /> Okundu
                  </button>
                )}
                <button
                  onClick={() => setConfirm(a.id)}
                  title="Sil"
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-medium text-sm transition"
                >
                  <Trash2 className="w-4 h-4" /> Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
