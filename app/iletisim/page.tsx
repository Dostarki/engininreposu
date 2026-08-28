import type { Metadata } from "next";
import { getSetting } from "@/lib/db";
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube, Send, Clock, MessageSquare, Sparkles, Star, ArrowRight } from "lucide-react";
import FormToast from "@/components/FormToast";

export const metadata: Metadata = {
  title: "İletişim | Megastar Organizasyon - Antalya",
  description: "Megastar Organizasyon ile iletişime geçin. Antalya merkezli ofisimiz, telefon ve e-posta adreslerimiz. 7/24 destek hattımız.",
  alternates: { canonical: "/iletisim" },
};

export default function ContactPage({ searchParams }: { searchParams: { show?: string; status?: string } }) {
  const s = {
    address: getSetting("address", "Antalya, Türkiye"),
    phone: getSetting("phone", "+90 555 555 55 55"),
    email: getSetting("email", "info@megastarorganizasyon.com"),
    ig: getSetting("instagram_url"),
    fb: getSetting("facebook_url"),
    yt: getSetting("youtube_url"),
    wa: getSetting("whatsapp_number", ""),
  };
  const cleanWa = s.wa.replace(/\D/g, "");
  const waLink = cleanWa ? `https://wa.me/${cleanWa}` : "#";

  const contactCards = [
    { Icon: MapPin, title: "Adres", val: s.address, href: "#", tag: "Ofis" },
    { Icon: Phone, title: "Telefon", val: s.phone, href: `tel:${s.phone.replace(/\s/g, "")}`, tag: "Hemen Ara" },
    { Icon: Mail, title: "E-Posta", val: s.email, href: `mailto:${s.email}`, tag: "24 Saat İçinde" },
    { Icon: MessageSquare, title: "WhatsApp", val: "Mesaj Gönder", href: waLink, tag: "7/24 Açık" },
  ];

  return (
    <>
      <FormToast status={searchParams.status} />
      <div className="pt-32 pb-40 md:pb-48 lg:pb-56">
        {/* PAGE HEADER */}
        <section className="relative mb-16 md:mb-20 overflow-hidden">
          <div className="absolute inset-0 bg-mesh-gradient opacity-40" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-gold-500/10 blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-5 sm:px-6 md:px-8 pt-10 pb-14 text-center">
            <div className="inline-flex items-center gap-2.5 mb-6 px-5 py-2.5 rounded-full border border-gold-500/30 bg-gold-500/8 backdrop-blur-xl">
              <MessageSquare className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-gold-300 text-[13px] font-semibold tracking-[0.08em] uppercase">İletişim</span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight">
              Bize <span className="gold-gradient-text">Ulaşın</span>
            </h1>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-gold-500/60" />
              <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
              <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-gold-500/60" />
            </div>
            <p className="max-w-3xl mx-auto text-white/65 text-base md:text-xl leading-relaxed">
              Etkinlik planlamak, fiyat bilgisi almak veya her türlü soru için bizimle
              iletişime geçebilirsiniz. Uzman ekibimiz size en kısa sürede dönüş yapacaktır.
            </p>
          </div>
        </section>

        {/* CONTACT CARDS */}
        <section className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 mb-14 md:mb-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {contactCards.map(({ Icon, title, val, href, tag }) => (
              <a key={title} href={href} className="group relative block glass-panel p-6 md:p-8 rounded-3xl2 hover:border-gold-500/40 transition-all duration-500 hover:-translate-y-1.5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-[0.05] transition" />
                <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gold-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-5">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-gold rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition" />
                      <div className="relative w-13 h-13 md:w-14 md:h-14 rounded-2xl bg-gradient-gold/10 border border-gold-500/25 flex items-center justify-center group-hover:scale-110 group-hover:bg-gradient-gold group-hover:border-transparent transition-all duration-300">
                        <Icon className="w-5.5 h-5.5 md:w-6 md:h-6 text-gold-400 group-hover:text-noir-900 transition" strokeWidth={1.9} />
                      </div>
                    </div>
                    <span className="premium-badge !py-1 !px-2.5 !text-[10px]">{tag}</span>
                  </div>
                  <div className="text-[11px] md:text-xs text-white/50 mb-1.5 tracking-wider uppercase font-bold">{title}</div>
                  <div className="text-white/90 font-semibold md:text-lg leading-snug break-words group-hover:text-gold-400 transition">{val}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            {/* FORM */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-px bg-gradient-gold opacity-15 rounded-3xl2 blur-sm" />
                <div className="relative glass-panel p-6 sm:p-8 md:p-10 lg:p-12 rounded-3xl2 border-gold-500/20">
                  <div className="flex items-start gap-4 mb-8">
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 bg-gradient-gold rounded-2xl blur-md opacity-30 animate-glow-pulse" />
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-lg shadow-gold-500/25">
                        <Send className="w-7 h-7 text-noir-900" />
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <h2 className="font-display text-2xl md:text-3xl font-bold mb-1.5">
                        Mesaj <span className="gold-gradient-text">Gönderin</span>
                      </h2>
                      <p className="text-white/60 text-sm md:text-[15px]">Formu doldurun, size en kısa sürede dönelim.</p>
                    </div>
                  </div>

                  <form action="/api/contact" method="POST" className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
                      <div>
                        <label className="block text-xs font-bold text-white/60 mb-2 tracking-wider uppercase">Ad Soyad *</label>
                        <input required name="full_name" className="input-field !py-4 !rounded-2xl" placeholder="Ad Soyad" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/60 mb-2 tracking-wider uppercase">Telefon *</label>
                        <input required type="tel" name="phone" className="input-field !py-4 !rounded-2xl" placeholder="+90 5XX XXX XX XX" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/60 mb-2 tracking-wider uppercase">E-Posta</label>
                      <input type="email" name="email" className="input-field !py-4 !rounded-2xl" placeholder="ornek@mail.com" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/60 mb-2 tracking-wider uppercase">Konu</label>
                      <input
                        name="subject"
                        className="input-field !py-4 !rounded-2xl"
                        defaultValue={searchParams.show ? `Show Talebi: ${searchParams.show}` : ""}
                        placeholder="Mesajınızın konusu (Düğün, otel, kurumsal vb.)"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/60 mb-2 tracking-wider uppercase">Mesajınız *</label>
                      <textarea
                        required
                        name="message"
                        rows={6}
                        className="input-field resize-none !rounded-2xl !py-4"
                        placeholder="Etkinlik türü, tarih, mekan, katılımcı sayısı ve diğer detaylar..."
                      />
                    </div>
                    <button type="submit" className="btn-gold w-full !py-4.5 text-base">
                      Mesajı Gönder
                      <Send className="w-4.5 h-4.5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="lg:col-span-5 order-1 lg:order-2 space-y-5 md:space-y-6">
              {/* WORKING HOURS */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl2 h-full">
                <h3 className="font-display text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-gold/10 border border-gold-500/25 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gold-400" />
                  </div>
                  Çalışma <span className="gold-gradient-text">Saatlerimiz</span>
                </h3>
                <ul className="space-y-3">
                  {[
                    ["Pazartesi - Cuma", "09:00 - 19:00", true],
                    ["Cumartesi", "10:00 - 18:00", true],
                    ["Pazar", "Randevu ile", false],
                  ].map(([d, h, active]) => (
                    <li key={d as string} className="flex items-center justify-between py-4 px-4 rounded-2xl bg-white/[0.015] border border-white/5 last:mb-0 hover:border-gold-500/20 transition">
                      <div className="flex items-center gap-3.5">
                        <div className={`w-2.5 h-2.5 rounded-full ${active ? "bg-emerald-400 shadow-lg shadow-emerald-500/40" : "bg-white/30"}`} />
                        <span className="text-white/80 font-semibold text-sm md:text-[15px]">{d as string}</span>
                      </div>
                      <span className="font-bold text-white/90 text-sm md:text-base">{h as string}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7 p-5 bg-gradient-gold/8 rounded-2xl border border-gold-500/20">
                  <p className="text-sm text-gold-300 font-bold mb-1.5 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Hızlı İletişim İpucu
                  </p>
                  <p className="text-sm text-white/70 leading-relaxed">
                    WhatsApp hattımız 7/24 açıktır. Acil durumlarda doğrudan bizimle iletişime geçebilirsiniz.
                  </p>
                </div>
              </div>

              {/* SOCIAL */}
              <div className="glass-panel p-5 sm:p-6 md:p-7 rounded-3xl2 overflow-visible">
                <h3 className="font-display text-lg md:text-2xl font-bold mb-4 md:mb-5">Bizi Sosyal Medyada Takip Edin</h3>
                <div className="grid grid-cols-3 gap-2.5 md:gap-3.5">
                  {[
                    { Icon: Instagram, url: s.ig, label: "Instagram", color: "from-pink-500 via-purple-500 to-orange-500" },
                    { Icon: Facebook, url: s.fb, label: "Facebook", color: "from-blue-500 to-blue-700" },
                    { Icon: Youtube, url: s.yt, label: "YouTube", color: "from-red-500 to-red-700" },
                  ].map(({ Icon, url, label, color }) => (
                    <a key={label} href={url || "#"} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2.5 md:gap-3 p-3.5 sm:p-4 md:p-5 rounded-2xl bg-white/[0.015] border border-white/10 hover:border-gold-500/40 transition-all duration-300 group hover:-translate-y-1 overflow-visible">
                      <div className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300`}>
                        <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-15 transition" />
                        <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-white relative z-10" />
                      </div>
                      <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-white/70 group-hover:text-white transition text-center leading-tight">{label}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* MAP */}
              <div className="relative rounded-3xl2 overflow-hidden h-64 md:h-72 border border-white/10 group">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-10 transition mix-blend-overlay z-10 pointer-events-none" />
                <iframe
                  src="https://www.google.com/maps?q=Antalya&output=embed"
                  className="w-full h-full grayscale-[50%] contrast-110 hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                  loading="lazy"
                  title="Megastar Organizasyon Konum"
                />
                <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
                  <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-noir-950/90 backdrop-blur-md border border-gold-500/25 shadow-2xl">
                    <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                    <span className="text-sm font-semibold text-white">{s.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
