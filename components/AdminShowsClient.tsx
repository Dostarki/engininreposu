"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, Star, ArrowUpDown, Eye, AlertTriangle } from "lucide-react";
import { Show } from "@/lib/shows";

interface Props { shows: Show[]; }

export default function AdminShowsClient({ shows }: Props) {
  const [q, setQ] = useState("");
  const filtered = shows.filter(s =>
    !q || s.name.toLowerCase().includes(q.toLowerCase()) || (s.category || "").toLowerCase().includes(q.toLowerCase())
  );
  const [confirmDel, setConfirmDel] = useState<number | null>(null);

  async function del(id: number) {
    const r = await fetch("/api/admin/shows", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (r.ok) window.location.reload();
    else alert("Silme başarısız");
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Show Yönetimi</h1>
          <p className="text-slate-500 mt-1">{shows.length} show mevcut</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Show ara..."
              className="pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition w-full sm:w-64"
            />
          </div>
          <Link href="/admin/shows/new" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 font-semibold shadow hover:shadow-lg hover:scale-[1.02] transition justify-center">
            <Plus className="w-4 h-4" /> Yeni Show
          </Link>
        </div>
      </header>

      {confirmDel !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Show'u sil?</h3>
                <p className="text-sm text-slate-500">Bu işlem geri alınamaz. Show ve tüm içeriği silinecektir.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDel(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition"
              >
                İptal
              </button>
              <button
                onClick={() => { del(confirmDel); setConfirmDel(null); }}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 w-16"><ArrowUpDown className="w-4 h-4" /></th>
                <th className="px-6 py-4">Show</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Sıra</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-500">Show bulunamadı.</td></tr>
              )}
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-6 py-4 align-middle">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                      {s.image && (
                        <Image src={s.image} alt={s.name} fill sizes="48px" className="object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <div className="font-semibold text-slate-900">{s.name}</div>
                    <div className="text-xs text-slate-500 truncate max-w-md">/{s.slug}</div>
                  </td>
                  <td className="px-6 py-4 align-middle">
                    {s.category ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium">
                        {s.category}
                      </span>
                    ) : <span className="text-slate-400 text-xs">—</span>}
                  </td>
                  <td className="px-6 py-4 align-middle text-sm text-slate-600 font-mono">{s.sort_order}</td>
                  <td className="px-6 py-4 align-middle">
                    {s.featured ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
                        <Star className="w-3 h-3 fill-emerald-700" /> Öne Çıkan
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200 text-xs font-medium">
                        Pasif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/show/${s.slug}`}
                        target="_blank"
                        title="Sitede Gör"
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/shows/${s.id}`}
                        title="Düzenle"
                        className="p-2 rounded-lg text-slate-500 hover:bg-amber-50 hover:text-amber-700 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        title="Sil"
                        onClick={() => setConfirmDel(s.id)}
                        className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
