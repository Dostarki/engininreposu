import { getAllShows } from "@/lib/shows";
import type { Metadata } from "next";
import { Briefcase, Users, Send, Sparkles, User, Mail, Phone, FileText, CheckCircle2, ArrowRight, Star, Crown, Zap, Clock } from "lucide-react";
import FormToast from "@/components/FormToast";

export const metadata: Metadata = {
  title: "Kariyer | Megastar Organizasyon - İş Başvurusu",
  description: "Megastar Organizasyon bünyesinde çalışmak için hemen iş başvurusunda bulunun. Dansçı, sanatçı, animatör, sahne ekibi ve daha fazla pozisyon.",
  alternates: { canonical: "/kariyer" },
};

export default function CareerPage({ searchParams }: { searchParams: { show?: string; status?: string } }) {
  const shows = getAllShows();
  const positions = [
    "Dansçı",
    "Akrobat",
    "Sahne Sanatçısı",
    "Animatör",
    "DJ / Müzisyen",
    "Çocuk Etkinliği Sorumlusu",
    "Sahne / Işık / Ses Ekibi",
    "Kostüm & Makyaj",
    "Proje Koordinatörü",
    "Satış & Müşteri Temsilcisi",
    "Diğer",
  ];
  const perks = [
    { Icon: Briefcase, title: "Esnek Çalışma Saatleri", desc: "Etkinlik yoğunluğuna göre programınızı oluşturun.", num: "01" },
    { Icon: Sparkles, title: "Yurtiçi & Yurtdışı", desc: "Farklı şehir ve ülkelerde çalışma imkanı.", num: "02" },
    { Icon: Users, title: "Profesyonel Ekip", desc: "Sektörün en iyileriyle birlikte çalışma.", num: "03" },
    { Icon: FileText, title: "Sosyal Haklar", desc: "Sigorta ve düzenli ödeme garantisi.", num: "04" },
  ];

  return (
    <>
      <FormToast status={searchParams.status} />
      <div className="pt-32 pb-24 md:pb-32">
        {/* PAGE HEADER */}
        <section className="relative mb-16 md:mb-20 overflow-hidden">
          <div className="absolute inset-0 bg-mesh-gradient opacity-40" />
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-gold-500/10 blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-5 sm:px-6 md:px-8 pt-10 pb-14 text-center">
            <div className="inline-flex items-center gap-2.5 mb-6 px-5 py-2.5 rounded-full border border-gold-500/30 bg-gold-500/8 backdrop-blur-xl">
              <Briefcase className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-gold-300 text-[13px] font-semibold tracking-[0.08em] uppercase">Kariyer Fırsatları</span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight">
              Bizimle Çalışmak <span className="gold-gradient-text">İster misiniz?</span>
            </h1>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-gold-500/60" />
              <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
              <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-gold-500/60" />
            </div>
            <p className="max-w-3xl mx-auto text-white/65 text-base md:text-xl leading-relaxed">
              Megastar Organizasyon ailesine katılmak için aşağıdaki formu doldurun.
              Yetenekli ve enerjik sanatçıları, ekip üyelerini her zaman aramızda görmekten mutluluk duyarız.
            </p>
          </div>
        </section>

        {/* PERKS */}
        <section className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 mb-16 md:mb-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {perks.map(({ Icon, title, desc, num }) => (
              <div key={title} className="glass-panel p-7 md:p-8 rounded-3xl2 hover:border-gold-500/40 transition-all duration-500 hover:-translate-y-1.5 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-[0.05] transition" />
                <div className="font-display text-6xl font-bold text-white/[0.04] absolute top-3 right-5 leading-none select-none">{num}</div>
                <div className="relative">
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-5 rounded-2xl bg-gradient-gold/10 border border-gold-500/25 flex items-center justify-center group-hover:scale-110 group-hover:bg-gradient-gold/15 transition-all">
                    <Icon className="w-7 h-7 md:w-8 md:h-8 text-gold-400" strokeWidth={1.8} />
                  </div>
                  <h3 className="font-display text-lg md:text-xl font-bold mb-2 text-white">{title}</h3>
                  <p className="text-white/60 text-sm md:text-[15px] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
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
                        İş <span className="gold-gradient-text">Başvuru Formu</span>
                      </h2>
                      <p className="text-white/60 text-sm md:text-[15px]">Aşağıdaki alanları dikkatlice doldurunuz. Başvurunuz yönetici paneline iletilecektir.</p>
                    </div>
                  </div>

                  <form action="/api/career" method="POST" className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
                      <div>
                        <label className="block text-xs font-bold text-white/60 mb-2 tracking-wider uppercase">Ad Soyad *</label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-gold rounded-2xl opacity-0 group-focus-within:opacity-10 blur-sm transition" />
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
                            <input required name="full_name" className="input-field pl-12 !py-4 !rounded-2xl" placeholder="Ad Soyad" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-white/60 mb-2 tracking-wider uppercase">Telefon *</label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-gold rounded-2xl opacity-0 group-focus-within:opacity-10 blur-sm transition" />
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
                            <input required type="tel" name="phone" className="input-field pl-12 !py-4 !rounded-2xl" placeholder="+90 5XX XXX XX XX" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/60 mb-2 tracking-wider uppercase">E-Posta</label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-gold rounded-2xl opacity-0 group-focus-within:opacity-10 blur-sm transition" />
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
                          <input type="email" name="email" className="input-field pl-12 !py-4 !rounded-2xl" placeholder="ornek@mail.com" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/60 mb-2 tracking-wider uppercase">Başvurulan Pozisyon *</label>
                      <select required name="position" defaultValue={searchParams.show || ""} className="input-field !py-4 !rounded-2xl">
                        <option value="">Pozisyon seçiniz...</option>
                        {positions.map(p => <option key={p} value={p}>{p}</option>)}
                        <optgroup label="Show Grupları">
                          {shows.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </optgroup>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-white/60 mb-2 tracking-wider uppercase">Kendinizi Tanıtın / Özgeçmiş *</label>
                      <textarea
                        required
                        name="message"
                        rows={6}
                        className="input-field resize-none !rounded-2xl !py-4"
                        placeholder="Deneyimleriniz, yetenekleriniz, daha önce çalıştığınız projeler ve eklemek istedikleriniz..."
                      />
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-gold-500/5 border border-gold-500/15">
                      <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                      <p className="text-xs md:text-sm text-white/60 leading-relaxed">
                        Başvurunuz incelendikten sonra uygun görülmesi halinde sizinle iletişime geçilecektir.
                        Kişisel verileriniz yalnızca başvuru süreci kapsamında kullanılacaktır.
                      </p>
                    </div>
                    <button type="submit" className="btn-gold w-full !py-4.5 text-base">
                      Başvuruyu Gönder
                      <Send className="w-4.5 h-4.5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="lg:col-span-5 order-1 lg:order-2 space-y-5 md:space-y-6">
              {/* Open positions */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl2">
                <h3 className="font-display text-xl md:text-2xl font-bold mb-5 flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-gold/10 border border-gold-500/25 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-gold-400" />
                  </div>
                  Açık Pozisyonlar
                </h3>
                <ul className="space-y-3">
                  {[
                    { p: "Dansçılar (Kadın / Erkek)", tag: "Acil" },
                    { p: "Profesyonel Akrobatlar", tag: "Aktif" },
                    { p: "Çocuk Animasyon Ekibi", tag: "Aktif" },
                    { p: "DJ ve Canlı Müzisyenler", tag: "Aktif" },
                    { p: "Sahne Teknik Ekip", tag: "Acil" },
                  ].map(({ p, tag }) => (
                    <li key={p} className="flex items-center justify-between p-4 rounded-2xl bg-noir-800/50 border border-white/5 hover:border-gold-500/30 transition group">
                      <div className="flex items-center gap-3">
                        <Crown className="w-4.5 h-4.5 text-gold-400 opacity-60 group-hover:opacity-100 transition" />
                        <span className="text-white/80 text-sm md:text-[15px] font-medium">{p}</span>
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold shrink-0 ${
                        tag === "Acil"
                          ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          : "bg-gold-500/10 text-gold-400 border border-gold-500/30"
                      }`}>{tag}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* We are looking for */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl2 border-gold-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-gold opacity-[0.04]" />
                <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-gold-500/10 blur-2xl" />
                <div className="relative">
                  <h3 className="font-display text-xl md:text-2xl font-bold mb-5 flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-gold/15 border border-gold-500/30 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-gold-400" />
                    </div>
                    Aradığımız Özellikler
                  </h3>
                  <ul className="space-y-3.5 text-sm md:text-[15px] text-white/75">
                    {[
                      "Güler yüzlü ve iletişimi güçlü olmak",
                      "Ekip çalışmasına yatkın olmak",
                      "Seyirci karşısında performans sergileyebilmek",
                      "Esnek çalışma saatlerine uyum sağlamak",
                      "Antalya merkezli çalışabilecek olmak (tercih)",
                    ].map((x, i) => (
                      <li key={x} className="flex items-start gap-3">
                        <div className="flex flex-col items-center shrink-0 pt-1">
                          <span className="w-6 h-6 rounded-lg bg-gradient-gold/10 border border-gold-500/25 flex items-center justify-center text-[10px] font-bold text-gold-400">0{i+1}</span>
                        </div>
                        <span className="flex-1 pt-0.5">{x}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Process */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl2">
                <h3 className="font-display text-xl md:text-2xl font-bold mb-5 flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-gold-400" />
                  Başvuru Süreci
                </h3>
                <ol className="relative space-y-5 pl-10">
                  {[
                    { t: "Başvuru", d: "Formu doldurup gönderin" },
                    { t: "Ön Değerlendirme", d: "CV'niz incelensin" },
                    { t: "Mülakat / Deneme", d: "Sizi yakından tanıyalım" },
                    { t: "Ekibe Katılım", d: "Megastar ailesine hoş geldiniz!" },
                  ].map((s, i) => (
                    <li key={s.t} className="relative">
                      <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-xs font-bold text-noir-900 shadow-lg shadow-gold-500/20">
                        {i + 1}
                      </div>
                      <h4 className="font-semibold text-white mb-0.5">{s.t}</h4>
                      <p className="text-sm text-white/55">{s.d}</p>
                      {i < 3 && (
                        <div className="absolute -left-6 top-8 bottom-[-20px] w-px bg-gradient-to-b from-gold-500/40 to-transparent" />
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
