"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Eye, Image as ImageIcon, Upload } from "lucide-react";
import type { DBShow } from "@/lib/db";

interface Props {
  show: DBShow;
  err: boolean;
}

export default function AdminShowEditClient({ show, err: initErr }: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const [saving, setSaving] = useState(false);
  const [imgPreview, setImgPreview] = useState<string>(show.image || "");
  const [err, setErr] = useState(initErr);

  function onImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      const r = new FileReader();
      r.onload = () => setImgPreview(String(r.result));
      r.readAsDataURL(f);
    }
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setErr(false);
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (!fd.get("name") || String(fd.get("name") || "").trim() === "") {
      setSaving(false);
      setErr(true);
      return;
    }
    fetch(form.action, { method: "POST", body: fd }).then(res => {
      setSaving(false);
      if (res.redirected || res.ok) {
        router.push("/admin/shows?ok=updated");
        router.refresh();
      }
    }).catch(() => setSaving(false));
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header className="flex flex-wrap items-center gap-4">
        <Link href="/admin/shows" className="p-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-white transition" title="Geri">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900">Show Düzenle</h1>
          <p className="text-slate-500 mt-1">{show.name} /{show.slug}</p>
        </div>
        <Link href={`/show/${show.slug}`} target="_blank" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-white transition">
          <Eye className="w-4 h-4" /> Sitede Gör
        </Link>
      </header>

      {(err || sp.get("err") === "1") && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          Show adı zorunludur.
        </div>
      )}

      <form onSubmit={submit} action="/api/admin/shows" method="POST" encType="multipart/form-data" className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 space-y-6">
        <input type="hidden" name="id" value={show.id} />
        <input type="hidden" name="_method" value="PUT" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Show Adı *</label>
            <input required name="name" defaultValue={show.name} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">URL (Slug)</label>
            <input name="slug" defaultValue={show.slug} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Kategori</label>
              <input name="category" defaultValue={show.category || ""} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Süre</label>
              <input name="duration" defaultValue={show.duration || ""} placeholder="örn: 45 dk" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Kişi Sayısı</label>
              <input name="team_count" defaultValue={show.team_count || ""} placeholder="örn: 15 kişi" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Kapak Fotoğrafı</label>
            <div className="space-y-3">
              {imgPreview && (
                <div className="relative w-full max-w-md rounded-xl overflow-hidden border border-slate-200">
                  <img src={imgPreview} alt="Önizleme" className="w-full h-48 object-cover" />
                </div>
              )}
              <input name="image" defaultValue={show.image || ""} placeholder="https://... (URL - opsiyonel)" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition" />
              <label className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-slate-300 hover:border-amber-400 cursor-pointer bg-slate-50 hover:bg-amber-50 transition text-sm">
                <Upload className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-slate-700">Veya bilgisayardan yeni görsel yükle (PNG/JPG/WebP, max 20MB)</span>
                <input name="image_upload" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif" onChange={onImageFile} className="hidden" />
              </label>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Video URL (YouTube vb.)</label>
            <div className="space-y-3">
              <input name="video_url" defaultValue={show.video_url || ""} placeholder="https://youtube.com/watch?v=...  -  veya  -  video dosyası yükleyin" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition" />
              <label className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-slate-300 hover:border-amber-400 cursor-pointer bg-slate-50 hover:bg-amber-50 transition text-sm">
                <ImageIcon className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-slate-700">Veya bilgisayardan video yükle (MP4/WebM, max 200MB)</span>
                <input name="video_upload" type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" />
              </label>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Kısa Açıklama</label>
            <textarea name="short_description" rows={2} defaultValue={show.short_description || ""} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition resize-none" />
          </div>
          <div className="md:col-span-2">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <label className="block text-sm font-semibold text-slate-700">Detaylı Açıklama</label>
                <p className="text-xs text-slate-500 mt-0.5">
                  Düz metin yazın, otomatik olarak paragraflara, listelere ve başlıklara <strong>biçimlendirilir</strong>. Hiç HTML kodu kullanmanıza gerek yok.
                </p>
              </div>
              <details className="shrink-0">
                <summary className="text-xs font-semibold text-amber-700 cursor-pointer hover:text-amber-600 select-none">📘 Kullanım Kılavuzu</summary>
                <div className="mt-2 p-3 rounded-lg border border-amber-200 bg-amber-50 text-xs text-amber-900 space-y-2 w-80 shadow-sm">
                  <div><span className="font-bold">Paragraf:</span> Normal yazın, boş satır bırakınca yeni paragraf açılır.</div>
                  <div><span className="font-bold">Başlık:</span> <code className="bg-amber-200/80 px-1.5 py-0.5 rounded">### Gösteri Özellikleri</code></div>
                  <div><span className="font-bold">Liste:</span> Her satırın başına <code className="bg-amber-200/80 px-1.5 py-0.5 rounded">- </code> koyun</div>
                  <div><span className="font-bold">Sıralı Liste:</span> <code className="bg-amber-200/80 px-1.5 py-0.5 rounded">1. </code>, <code className="bg-amber-200/80 px-1.5 py-0.5 rounded">2. </code></div>
                  <div><span className="font-bold">Kalın Yazı:</span> <code className="bg-amber-200/80 px-1.5 py-0.5 rounded">**metin**</code></div>
                  <div className="pt-1 text-amber-800/80 italic">💡 Not: Eski kayıtlar HTML içeriyorsa aynen korunur.</div>
                </div>
              </details>
            </div>
            <textarea name="description" rows={14} defaultValue={show.description || ""} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition text-sm leading-relaxed" />
          </div>
          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Sıra Numarası</label>
              <input name="sort_order" type="number" defaultValue={show.sort_order} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition" />
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <input id="featured" name="featured" type="checkbox" defaultChecked={!!show.featured} className="w-5 h-5 accent-amber-500" />
              <label htmlFor="featured" className="text-sm font-semibold text-slate-700 cursor-pointer">Ana sayfada öne çıkar</label>
            </div>
          </div>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:justify-end border-t border-slate-100">
          <Link href="/admin/shows" className="px-5 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition text-center">
            İptal
          </Link>
          {saving && <span className="self-center text-sm text-slate-500 animate-pulse">Kaydediliyor...</span>}
          <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 font-semibold shadow hover:shadow-lg hover:scale-[1.01] transition disabled:opacity-60 disabled:hover:scale-100">
            <Save className="w-4 h-4" /> Değişiklikleri Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}
