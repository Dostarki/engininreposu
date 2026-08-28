import Link from "next/link";
import { Star, MapPin, Phone, Mail, Instagram, Facebook, Youtube, ArrowRight, Sparkles, Music } from "lucide-react";
import { getAllSettings } from "@/lib/db";

interface Props {
  siteLogo?: string;
  phone?: string;
}

export default function Footer({ siteLogo = "/megastar-logo.svg", phone = "" }: Props) {
  const s = getAllSettings();

  return (
    <footer className="relative bg-noir-950 border-t border-white/10 pt-20 pb-10 overflow-hidden">
      <div className="absolute inset-0 bg-mesh-gradient opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-gold-500/[0.04] blur-3xl" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 relative">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-8 mb-14">
          {/* Brand */}
          <div className="lg:col-span-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              {siteLogo ? (
                <img src={siteLogo} alt="Megastar Organizasyon" className="h-12 w-auto object-contain drop-shadow-[0_4px_20px_rgba(199,165,106,0.24)] group-hover:scale-105 transition" />
              ) : (
                <>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-gold rounded-full blur-xl opacity-40 group-hover:opacity-60 transition animate-glow-pulse" />
                    <div className="relative w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center shadow-lg shadow-gold-500/25">
                      <Star className="w-6 h-6 text-noir-900 fill-noir-900" />
                    </div>
                  </div>
                  <div>
                    <div className="font-display font-bold text-2xl gold-gradient-text leading-none">Megastar</div>
                    <div className="text-[11px] text-white/50 tracking-[0.25em] uppercase mt-1">Organizasyon</div>
                  </div>
                </>
              )}
            </Link>
            <p className="text-white/60 text-[15px] leading-relaxed mb-6 max-w-sm">
              Antalya merkezli profesyonel organizasyon şirketi. Lüks oteller, özel
              etkinlikler ve kurumsal firmalar için yaratıcı eğlence çözümleri.
            </p>

            <div className="flex gap-3">
              {[
                { Icon: Instagram, url: s.instagram_url, label: "Instagram", socialClass: "social-hover-instagram" },
                { Icon: Facebook, url: s.facebook_url, label: "Facebook", socialClass: "social-hover-facebook" },
                { Icon: Youtube, url: s.youtube_url, label: "Youtube", socialClass: "social-hover-youtube" },
              ].map(({ Icon, url, label, socialClass }) => (
                <a
                  key={label}
                  href={url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`group w-11 h-11 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/60 hover:text-white hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${socialClass}`}
                >
                  <Icon className="w-4.5 h-4.5 group-hover:scale-110 transition" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 md:col-span-1">
            <h4 className="font-display font-bold text-base mb-5 text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-gold" />
              Hızlı Linkler
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/", label: "Ana Sayfa" },
                { href: "/hakkimizda", label: "Hakkımızda" },
                { href: "/showlar", label: "Show Gruplarımız" },
                { href: "/referanslarimiz", label: "Referanslarımız" },
                { href: "/kariyer", label: "Kariyer / İş Başvurusu" },
                { href: "/iletisim", label: "İletişim" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/55 hover:text-gold-400 transition flex items-center gap-2 group text-[15px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500/30 group-hover:bg-gold-500 group-hover:w-3 transition-all duration-300" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3 md:col-span-1">
            <h4 className="font-display font-bold text-base mb-5 text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-gold" />
              Kategoriler
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Dans Gösterileri", icon: Music },
                { label: "Akrobati Şovları", icon: Sparkles },
                { label: "Çocuk Etkinlikleri", icon: Star },
                { label: "Temalı Parti Konseptleri", icon: Sparkles },
                { label: "Otel Eğlenceleri", icon: Music },
              ].map(({ label, icon: Icon }) => (
                <li key={label}>
                  <Link href="/showlar" className="text-white/55 hover:text-gold-400 transition flex items-center gap-3 group text-[15px]">
                    <div className="w-7 h-7 shrink-0 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-gold-500/10 group-hover:border-gold-500/30 transition">
                      <Icon className="w-3.5 h-3.5 text-gold-400" />
                    </div>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3 md:col-span-2">
            <h4 className="font-display font-bold text-base mb-5 text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-gold" />
              İletişim
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-gold-500/20 transition group">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-gold-500/8 border border-gold-500/20 flex items-center justify-center group-hover:bg-gradient-gold group-hover:border-transparent transition-all">
                  <MapPin className="w-4.5 h-4.5 text-gold-400 group-hover:text-noir-900 transition" />
                </div>
                <span className="text-white/70 text-[15px] leading-relaxed pt-0.5">{s.address || "Antalya, Türkiye"}</span>
              </li>
              <li className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-gold-500/20 transition group">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-gold-500/8 border border-gold-500/20 flex items-center justify-center group-hover:bg-gradient-gold group-hover:border-transparent transition-all">
                  <Phone className="w-4.5 h-4.5 text-gold-400 group-hover:text-noir-900 transition" />
                </div>
                <a href={`tel:${(s.phone || "").replace(/\s/g, "")}`} className="text-white/70 hover:text-gold-400 transition font-semibold text-[15px]">
                  {s.phone || "+90 555 555 55 55"}
                </a>
              </li>
              <li className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-gold-500/20 transition group">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-gold-500/8 border border-gold-500/20 flex items-center justify-center group-hover:bg-gradient-gold group-hover:border-transparent transition-all">
                  <Mail className="w-4.5 h-4.5 text-gold-400 group-hover:text-noir-900 transition" />
                </div>
                <a href={`mailto:${s.email || ""}`} className="text-white/70 hover:text-gold-400 transition font-semibold text-[15px] break-all">
                  {s.email || "info@megastarorganizasyon.com"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Strip */}
        <div className="relative mb-12 rounded-3xl2 overflow-hidden border border-gold-500/25">
          <div className="absolute inset-0 bg-gradient-gold opacity-[0.06]" />
          <div className="absolute inset-0 bg-mesh-gradient" />
          <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-lg shadow-gold-500/25">
                <Sparkles className="w-6 h-6 text-noir-900" />
              </div>
              <div>
                <h5 className="font-display text-xl md:text-2xl font-bold text-white mb-1">Etkinliğinizi Planlamaya Hazır mısınız?</h5>
                <p className="text-white/60 text-sm md:text-[15px]">Ücretsiz keşif ve fiyatlandırma için hemen bizimle iletişime geçin.</p>
              </div>
            </div>
            <Link href="/iletisim" className="btn-gold shrink-0 w-full md:w-auto justify-center">
              Hemen Teklif Al
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="border-t border-white/5 pt-7 flex flex-col md:flex-row items-center justify-between gap-4 text-xs md:text-sm text-white/45">
          <p className="text-center md:text-left">© {new Date().getFullYear()} Megastar Organizasyon. Tüm hakları saklıdır.</p>
          <p className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/8 border border-gold-500/20">
              Antalya'da Hizmet Veriyoruz
              <span className="inline-block w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
