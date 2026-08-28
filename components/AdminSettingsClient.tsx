"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Save, MessageCircle, Globe, Palette, Info, Image as ImageIcon, Building2, Plus, Trash2, Edit3, Star, StarOff, Upload, ArrowUpFromLine, Eye } from "lucide-react";

const TABS = [
  { key: "general", label: "Genel Ayarlar", Icon: Globe },
  { key: "branding", label: "Logo & Marka", Icon: ImageIcon },
  { key: "references", label: "Referanslar", Icon: Building2 },
];

interface Props {
  initialSettings: Record<string, string>;
  initialRefs: any[];
  initOk: boolean;
  initTab: string;
}

type RefItem = {
  id: number; name: string; logo: string; website: string | null;
  category: string | null; sort_order: number; featured: number;
};

export default function AdminSettingsClient({ initialSettings, initialRefs, initOk, initTab }: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const [ok, setOk] = useState(initOk);
  const [activeTab, setActiveTab] = useState<string>(initTab);
  const [s, setS] = useState<Record<string, string>>(initialSettings);
  const [refs, setRefs] = useState<RefItem[]>(initialRefs);
  const [saving, setSaving] = useState(false);

  const f = (k: string) => s[k] || "";

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setOk(false);
    const form = e.currentTarget;
    const fd = new FormData(form);
    fetch(form.action, { method: "POST", body: fd }).then(res => {
      setSaving(false);
      if (res.ok || res.redirected) {
        setOk(true);
        setTimeout(() => setOk(false), 4000);
        // refresh state from server by redirecting
        router.push(`/admin/settings?tab=${activeTab}&ok=1`);
        router.refresh();
      }
    }).catch(() => setSaving(false));
  }

  function updateS(k: string, v: string) {
    setS(prev => ({ ...prev, [k]: v }));
  }

  // General tab save - collects general settings, hero image/video upload support
  function saveGeneral(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setOk(false);
    const form = e.currentTarget;
    const fd = new FormData(form);
    // logo korunması için
    fd.set("site_logo", f("site_logo"));
    fetch(form.action, { method: "POST", body: fd }).then(async res => {
      setSaving(false);
      if (res.ok || res.redirected) {
        // yüklenen dosyalar sonucu güncel değerleri sunucudan çekmek için refresh
        router.push(`/admin/settings?tab=general&ok=1`);
        router.refresh();
      }
    }).catch(() => setSaving(false));
  }

  function resetLogo(e: React.MouseEvent) {
    e.preventDefault();
    if (!confirm("Logoyu sıfırlamak istediğinizden emin misiniz?")) return;
    const form = document.getElementById("branding-form") as HTMLFormElement | null;
    if (!form) return;
    const fd = new FormData(form);
    fd.set("site_logo", "");
    setSaving(true);
    fetch(form.action, { method: "POST", body: fd }).then(() => {
      setSaving(false);
      setS(prev => ({ ...prev, site_logo: "" }));
      router.push(`/admin/settings?tab=branding&ok=1`);
      router.refresh();
    });
  }

  function saveBranding(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setOk(false);
    const form = e.currentTarget;
    const fd = new FormData(form);
    // Diğer ayarları koru
    for (const k of ["whatsapp_number", "site_title", "meta_description", "meta_keywords", "address", "phone", "email", "facebook_url", "instagram_url", "youtube_url", "hero_title", "hero_subtitle", "hero_image", "hero_video_url", "about_text"]) {
      if (!fd.has(k)) fd.append(k, f(k));
    }
    fetch(form.action, { method: "POST", body: fd }).then(res => {
      setSaving(false);
      if (res.ok || res.redirected) {
        router.push(`/admin/settings?tab=branding&ok=1`);
        router.refresh();
      }
    }).catch(() => setSaving(false));
  }

  function addRef(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    fetch(form.action, { method: "POST", body: fd }).then(res => {
      setSaving(false);
      if (res.ok || res.redirected) {
        router.push(`/admin/settings?tab=references&ok=1`);
        router.refresh();
      }
    }).catch(() => setSaving(false));
  }

  function editRef(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    fetch(form.action, { method: "POST", body: fd }).then(res => {
      setSaving(false);
      if (res.ok || res.redirected) {
        router.push(`/admin/settings?tab=references&ok=1`);
        router.refresh();
      }
    }).catch(() => setSaving(false));
  }

  function deleteRef(id: number) {
    if (!confirm("Bu referansı silmek istediğinizden emin misiniz?")) return;
    setSaving(true);
    const fd = new FormData();
    fd.append("_method", "DELETE");
    fd.append("id", String(id));
    fetch("/api/admin/references", { method: "POST", body: fd }).then(() => {
      setSaving(false);
      setRefs(prev => prev.filter(r => r.id !== id));
    });
  }

  const okShown = (ok || sp.get("ok") === "1");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Site Ayarları</h1>
          <p className="text-slate-500 mt-1">WhatsApp, iletişim, logo, SEO ve referans yönetimi.</p>
        </div>
      </header>

      {okShown && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-start gap-3 shadow-sm">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">İşlem başarıyla tamamlandı!</div>
            <div className="text-xs text-emerald-600/80 mt-0.5">Yaptığınız değişiklikler sitede hemen etki gösterdi.</div>
          </div>
        </div>
      )}

      {/* TABS */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50/50">
          {TABS.map(({ key, label, Icon }) => {
            const active = key === activeTab;
            return (
              <button
                key={key}
                type="button"
                onClick={() => { setActiveTab(key); setOk(false); }}
                className={`flex items-center gap-2 px-5 py-4 whitespace-nowrap font-semibold text-sm border-b-2 transition ${
                  active
                    ? "border-yellow-500 text-slate-900 bg-white -mb-px"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-yellow-600" : ""}`} />
                {label}
              </button>
            );
          })}
        </div>

        <div className="p-6 md:p-8">
          {/* TAB 1: GENERAL */}
          {activeTab === "general" && (
            <form onSubmit={saveGeneral} action="/api/admin/settings" method="POST" encType="multipart/form-data" className="space-y-8">
              <input type="hidden" name="site_logo" value={f("site_logo")} />

              <section>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">İletişim & WhatsApp</h2>
                    <p className="text-sm text-slate-500">WhatsApp butonunu ve iletişim bilgilerini güncelleyin.</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      WhatsApp Numarası (sadece rakam) <span className="text-amber-600">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">+</span>
                      <input name="whatsapp_number" value={f("whatsapp_number")} onChange={e => updateS("whatsapp_number", e.target.value)} placeholder="905555555555" className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition font-mono" />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Örnek: Türkiye için 905555555555</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Telefon</label>
                    <input name="phone" value={f("phone")} onChange={e => updateS("phone", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">E-Posta</label>
                    <input name="email" type="email" value={f("email")} onChange={e => updateS("email", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Adres</label>
                    <input name="address" value={f("address")} onChange={e => updateS("address", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Instagram URL</label>
                    <input name="instagram_url" value={f("instagram_url")} onChange={e => updateS("instagram_url", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Facebook URL</label>
                    <input name="facebook_url" value={f("facebook_url")} onChange={e => updateS("facebook_url", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">YouTube URL</label>
                    <input name="youtube_url" value={f("youtube_url")} onChange={e => updateS("youtube_url", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" />
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">SEO & Meta Etiketleri</h2>
                    <p className="text-sm text-slate-500">Arama motorları ve sosyal medya için başlık ve açıklamalar.</p>
                  </div>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Site Başlığı (Title)</label>
                    <input name="site_title" value={f("site_title")} onChange={e => updateS("site_title", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Meta Açıklaması (Description)</label>
                    <textarea name="meta_description" rows={3} value={f("meta_description")} onChange={e => updateS("meta_description", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Anahtar Kelimeler</label>
                    <input name="meta_keywords" value={f("meta_keywords")} onChange={e => updateS("meta_keywords", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" />
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Ana Sayfa İçerikleri</h2>
                    <p className="text-sm text-slate-500">Hero banner ve hakkımızda metinleri.</p>
                  </div>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Ana Sayfa Hero Görseli</label>
                    <div className="space-y-3">
                      {f("hero_image") && (
                        <div className="relative w-full max-w-xl rounded-xl overflow-hidden border border-slate-200">
                          <img src={f("hero_image")} alt="Hero Görseli" className="w-full h-48 object-cover" />
                          <a href={f("hero_image")} target="_blank" className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white hover:bg-black/80">
                            <Eye className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                      <input name="hero_image" value={f("hero_image")} onChange={e => updateS("hero_image", e.target.value)} placeholder="https://... (opsiyonel - URL girmek yerine dosya yükleyebilirsiniz)" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" />
                      <label className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-slate-300 hover:border-amber-400 cursor-pointer bg-slate-50 hover:bg-amber-50 transition text-sm">
                        <ArrowUpFromLine className="w-5 h-5 text-amber-600" />
                        <span className="font-semibold text-slate-700">Veya bilgisayardan görsel yükle (PNG/JPG/WebP, max 20MB)</span>
                        <input name="hero_image_upload" type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" className="hidden" />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Ana Sayfa Hero Video <span className="text-xs font-normal text-slate-500">(MP4, WebM veya YouTube linki)</span>
                    </label>
                    <div className="space-y-3">
                      <input name="hero_video_url" value={f("hero_video_url")} onChange={e => updateS("hero_video_url", e.target.value)} placeholder="örn: https://site.com/video.mp4  veya  https://www.youtube.com/watch?v=XXXX" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" />
                      <label className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-amber-300 hover:border-amber-500 cursor-pointer bg-amber-50 hover:bg-amber-100 transition text-sm">
                        <ArrowUpFromLine className="w-5 h-5 text-amber-700" />
                        <span className="font-semibold text-amber-800">💡 Veya bilgisayardan video yükle (MP4/WebM, max 200MB)</span>
                        <input name="hero_video_upload" type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" />
                      </label>
                    </div>
                    <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 space-y-1.5 leading-relaxed">
                      <p className="font-bold text-amber-900">💡 İdeal Kullanım:</p>
                      <p>• <strong>Süre: 8–10 saniye</strong> — Sürekli kendini tekrar eden (loop) kısa klipler</p>
                      <p>• <strong>Örnek içerik:</strong> Moğol akrobasi taklaları, Afrikalı dansçılar, LED kostüm gösterileri, sahne performanslarından kısa kesitler</p>
                      <p>• Video sitemizde <strong>sessiz (muted)</strong> ve <strong>otomatik döngü (loop)</strong> olarak çalışır. Ses açmanıza gerek yok.</p>
                      <p>• Video yüklerseniz kapak fotoğrafının üzerinde öncelikli oynatılır. Boş bırakırsanız sadece kapak görseli görünür.</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Ana Başlık</label>
                      <input name="hero_title" value={f("hero_title")} onChange={e => updateS("hero_title", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Alt Başlık</label>
                      <input name="hero_subtitle" value={f("hero_subtitle")} onChange={e => updateS("hero_subtitle", e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700">Hakkımızda Metni</label>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Düz metin yazın; paragraflar, listeler, başlıklar ve kalın yazılar <strong>otomatik olarak biçimlendirilir</strong>.
                        </p>
                      </div>
                      <details className="shrink-0">
                        <summary className="text-xs font-semibold text-amber-700 cursor-pointer hover:text-amber-600 select-none">📘 Kullanım</summary>
                        <div className="mt-2 p-3 rounded-lg border border-amber-200 bg-amber-50 text-xs text-amber-900 space-y-2 w-72 shadow-sm z-10 relative">
                          <div><span className="font-bold">Paragraf:</span> Boş satır bırak = yeni paragraf</div>
                          <div><span className="font-bold">Başlık:</span> <code className="bg-amber-200/80 px-1 rounded">### Vizyonumuz</code></div>
                          <div><span className="font-bold">Liste:</span> <code className="bg-amber-200/80 px-1 rounded">- </code> + madde</div>
                          <div><span className="font-bold">Kalın:</span> <code className="bg-amber-200/80 px-1 rounded">**metin**</code></div>
                        </div>
                      </details>
                    </div>
                    <textarea name="about_text" rows={10} value={f("about_text")} onChange={e => updateS("about_text", e.target.value)} placeholder={`### Biz Kimiz?
Megastar Organizasyon, Antalya merkezli profesyonel bir sahne gösterileri ve organizasyon şirketidir. 10+ yıllık deneyimimizle Türkiye'nin dört bir yanında lüks oteller, özel davetler ve kurumsal etkinliklere değer katıyoruz.

### Neden Biz?
- **Profesyonel** sanatçı kadrosu
- Özgün sahne tasarımları
- Yüksek enerjili performanslar

### Hizmetlerimiz
1. Sahne gösterileri
2. Kurumsal organizasyonlar
3. Düğün ve özel davetler`} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm leading-relaxed" />
                  </div>
                </div>
              </section>

              <div className="sticky bottom-4 z-30 flex justify-end gap-3 pt-2">
                {saving && <span className="self-center text-sm text-slate-500 animate-pulse">Kaydediliyor...</span>}
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 font-semibold shadow-lg hover:shadow-xl hover:scale-[1.01] transition disabled:opacity-60 disabled:hover:scale-100">
                  <Save className="w-4 h-4" /> Ayarları Kaydet
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: BRANDING / LOGO */}
          {activeTab === "branding" && (
            <form id="branding-form" onSubmit={saveBranding} action="/api/admin/settings" method="POST" encType="multipart/form-data" className="space-y-8 max-w-3xl">
              <section>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Site Logosu</h2>
                    <p className="text-sm text-slate-500">Logo dosyası yükleyin veya doğrudan URL girin. (PNG/SVG önerilir, şeffaf arka plan)</p>
                  </div>
                </div>

                {/* Preview */}
                <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700">
                  <div className="text-xs uppercase tracking-widest text-slate-400 mb-3">Önizleme (Navbar & Footer)</div>
                  <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                    {f("site_logo") ? (
                      <img src={f("site_logo")} alt="Logo Önizleme" className="h-16 w-auto object-contain max-w-[200px]" />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                        <span className="text-2xl">⭐</span>
                      </div>
                    )}
                    <div>
                      <div className="font-display text-2xl font-bold text-white">Megastar Organizasyon</div>
                      <div className="text-xs text-slate-400 uppercase tracking-[0.25em]">Logo kullanılıyor {f("site_logo") ? "✔" : "(Varsayılan yıldız logosu)"}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Logo URL (İsteğe bağlı - dosya yüklemediyseniz)</label>
                    <input
                      name="site_logo"
                      value={f("site_logo")}
                      onChange={e => updateS("site_logo", e.target.value)}
                      placeholder="https://siteniz.com/logo.png  veya  CDN URL"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Veya Bilgisayardan Logo Yükle</label>
                    <label className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-slate-300 hover:border-amber-400 cursor-pointer bg-slate-50 hover:bg-amber-50 transition text-sm w-full">
                      <ArrowUpFromLine className="w-5 h-5 text-amber-600" />
                      <span className="font-semibold text-slate-700">Logo dosyası seç (PNG/SVG/JPG/WebP, şeffaf arka plan önerilir)</span>
                      <input name="site_logo_upload" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif" className="hidden" />
                    </label>
                  </div>
                </div>
              </section>

              <div className="sticky bottom-4 z-30 flex justify-end gap-3 pt-2">
                {f("site_logo") && (
                  <button
                    type="button"
                    onClick={resetLogo}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" /> Logoyu Sıfırla
                  </button>
                )}
                {saving && <span className="self-center text-sm text-slate-500 animate-pulse">Kaydediliyor...</span>}
                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-600 text-slate-900 font-semibold shadow-lg hover:shadow-xl hover:scale-[1.01] transition disabled:opacity-60 disabled:hover:scale-100">
                  <Save className="w-4 h-4" /> Logoyu Kaydet
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: REFERENCES */}
          {activeTab === "references" && (
            <div className="space-y-8">
              {/* Add new */}
              <section className="p-6 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Yeni Referans Ekle</h2>
                    <p className="text-xs text-slate-500">Otel logo'su, şirket adı, kategori. Logo dosyası yükleyebilir veya URL girebilirsiniz.</p>
                  </div>
                </div>
                <form onSubmit={addRef} action="/api/admin/references" method="POST" encType="multipart/form-data" className="grid md:grid-cols-12 gap-4">
                  <div className="md:col-span-5">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Referans Adı *</label>
                    <input required name="name" placeholder="Rixos Downtown Antalya" className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm" />
                  </div>
                  <div className="md:col-span-5">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Logo URL (opsiyonel)</label>
                    <input name="logo" placeholder="https://...logo.png" className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm font-mono" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Sıra</label>
                    <input name="sort_order" type="number" defaultValue={refs.length} className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm" />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Kategori</label>
                    <input name="category" placeholder="5 Yıldızlı Otel" className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm" />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Web Sitesi</label>
                    <input name="website" placeholder="https://..." className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm font-mono" />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">Veya Logo Yükle</label>
                    <label className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg border border-dashed border-slate-300 hover:border-amber-400 cursor-pointer bg-slate-50 hover:bg-amber-50 transition text-xs w-full">
                      <Upload className="w-3.5 h-3.5 text-amber-600" />
                      <span className="font-semibold text-slate-700 truncate">Logo dosyası seç...</span>
                      <input name="logo_upload" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif" className="hidden" />
                    </label>
                  </div>
                  <div className="md:col-span-2 flex items-end">
                    <label className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-300 cursor-pointer hover:bg-slate-50 w-full justify-center">
                      <input name="featured" type="checkbox" defaultChecked className="w-4 h-4 accent-yellow-500" />
                      <span className="text-sm font-semibold text-slate-700">Öne Çıkan</span>
                    </label>
                  </div>
                  <div className="md:col-span-10 flex justify-end pt-1">
                    {saving && <span className="self-center mr-3 text-xs text-slate-500 animate-pulse">Kaydediliyor...</span>}
                    <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition text-sm disabled:opacity-60">
                      <Plus className="w-4 h-4" /> Ekle
                    </button>
                  </div>
                </form>
              </section>

              {/* List */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Mevcut Referanslar <span className="text-slate-400 font-normal text-base ml-1">({refs.length})</span></h2>
                  <a href="/referanslarimiz" target="_blank" className="text-xs font-semibold text-amber-700 hover:text-amber-600 flex items-center gap-1">
                    Siteyi Görüntüle →
                  </a>
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                        <th className="text-left font-semibold px-4 py-3 w-14">#</th>
                        <th className="text-left font-semibold px-4 py-3">Logo</th>
                        <th className="text-left font-semibold px-4 py-3">Ad</th>
                        <th className="text-left font-semibold px-4 py-3">Kategori</th>
                        <th className="text-left font-semibold px-4 py-3">Site</th>
                        <th className="text-center font-semibold px-4 py-3 w-28">Sıra / Öne Çıkan</th>
                        <th className="text-right font-semibold px-4 py-3 w-24">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {refs.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                            Henüz referans eklenmemiş. Yukarıdaki form ile ilk referansı ekleyin.
                          </td>
                        </tr>
                      )}
                      {refs.map((r, i) => (
                        <tr key={r.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 text-slate-400 font-mono text-xs">{i + 1}</td>
                          <td className="px-4 py-3">
                            {r.logo ? (
                              <img src={r.logo} alt={r.name} className="h-10 w-32 object-contain bg-white border border-slate-200 rounded p-1" />
                            ) : (
                              <div className="h-10 w-32 rounded bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400 uppercase">Logo Ekle</div>
                            )}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-900">{r.name}</td>
                          <td className="px-4 py-3">
                            {r.category && <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">{r.category}</span>}
                          </td>
                          <td className="px-4 py-3">
                            {r.website && r.website !== "#" ? (
                              <a href={r.website} target="_blank" className="text-indigo-600 hover:text-indigo-800 text-xs font-mono truncate max-w-[180px] inline-block align-middle">{r.website}</a>
                            ) : <span className="text-slate-300 text-xs">—</span>}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{r.sort_order}</span>
                              {r.featured ? <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> : <StarOff className="w-4 h-4 text-slate-300" />}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <details className="relative" key={`ed-${r.id}`}>
                                <summary className="list-none inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer">
                                  <Edit3 className="w-3.5 h-3.5" /> Düzenle
                                </summary>
                                <form onSubmit={editRef} action="/api/admin/references" method="POST" encType="multipart/form-data" className="absolute right-0 z-20 mt-2 w-80 p-4 rounded-xl shadow-2xl border border-slate-200 bg-white space-y-3">
                                  <input type="hidden" name="_method" value="PUT" />
                                  <input type="hidden" name="id" value={r.id} />
                                  <div>
                                    <label className="text-[11px] uppercase tracking-wide font-bold text-slate-600 block mb-1">Ad</label>
                                    <input required name="name" defaultValue={r.name} className="w-full px-3 py-2 rounded border border-slate-300 text-sm focus:outline-none focus:border-amber-500" />
                                  </div>
                                  <div>
                                    <label className="text-[11px] uppercase tracking-wide font-bold text-slate-600 block mb-1">Logo URL</label>
                                    <input name="logo" defaultValue={r.logo} className="w-full px-3 py-2 rounded border border-slate-300 text-sm font-mono focus:outline-none focus:border-amber-500" />
                                  </div>
                                  <div>
                                    <label className="text-[11px] uppercase tracking-wide font-bold text-slate-600 block mb-1">Veya Logo Yükle</label>
                                    <label className="flex items-center gap-1.5 px-3 py-2 rounded border border-dashed border-slate-300 hover:border-amber-400 cursor-pointer bg-slate-50 text-xs w-full">
                                      <Upload className="w-3 h-3 text-amber-600" />
                                      <span className="font-semibold text-slate-700 truncate">Logo seç...</span>
                                      <input name="logo_upload" type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif" className="hidden" />
                                    </label>
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[11px] uppercase tracking-wide font-bold text-slate-600 block mb-1">Kategori</label>
                                      <input name="category" defaultValue={r.category || ""} className="w-full px-3 py-2 rounded border border-slate-300 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                    <div>
                                      <label className="text-[11px] uppercase tracking-wide font-bold text-slate-600 block mb-1">Sıra</label>
                                      <input name="sort_order" type="number" defaultValue={r.sort_order} className="w-full px-3 py-2 rounded border border-slate-300 text-sm focus:outline-none focus:border-amber-500" />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-[11px] uppercase tracking-wide font-bold text-slate-600 block mb-1">Web Sitesi</label>
                                    <input name="website" defaultValue={r.website || ""} className="w-full px-3 py-2 rounded border border-slate-300 text-sm font-mono focus:outline-none focus:border-amber-500" />
                                  </div>
                                  <label className="flex items-center gap-2 text-sm">
                                    <input name="featured" type="checkbox" defaultChecked={!!r.featured} className="accent-yellow-500 w-4 h-4" />
                                    <span className="font-semibold text-slate-700">Öne Çıkan (Ana sayfa)</span>
                                  </label>
                                  <div className="flex justify-end gap-2 pt-1">
                                    <button type="submit" className="px-3 py-1.5 bg-slate-900 text-white text-xs rounded-md font-semibold hover:bg-slate-800">Kaydet</button>
                                  </div>
                                </form>
                              </details>
                              <button type="button" onClick={() => deleteRef(r.id)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition">
                                <Trash2 className="w-3.5 h-3.5" /> Sil
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
