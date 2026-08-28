import { getSetting } from "@/lib/db";
import { getAllShows } from "@/lib/shows";
import { CheckCircle2, Award, Users, Calendar, Star, Heart, Sparkles, TrendingUp, ArrowRight, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { formatRichText } from "@/lib/format";

export const metadata: Metadata = {
  title: "Hakkımızda | Megastar Organizasyon - Antalya",
  description: "Megastar Organizasyon - Antalya merkezli profesyonel organizasyon şirketi. Lüks oteller, özel etkinlikler ve kurumsal firmalar için 10+ yıllık deneyim.",
  alternates: { canonical: "/hakkimizda" },
};

export default function AboutPage() {
  const s = {
    about: getSetting("about_text"),
    address: getSetting("address"),
    phone: getSetting("phone"),
    email: getSetting("email"),
  };
  const showCount = getAllShows().length;

  const values = [
    { Icon: Heart, title: "Tutku", desc: "Yaptığımız işi seviyor ve tutkuyla icra ediyoruz.", num: "01" },
    { Icon: Award, title: "Kalite", desc: "Her detayda en yüksek kalite standartlarını hedefliyoruz.", num: "02" },
    { Icon: Users, title: "Ekip Çalışması", desc: "Deneyimli kadromuzla mükemmellik için çalışıyoruz.", num: "03" },
    { Icon: Sparkles, title: "Yenilikçilik", desc: "Sektördeki trendleri takip edip özgün konseptler üretiyoruz.", num: "04" },
  ];

  const stats = [
    { Icon: Calendar, val: "10+", lbl: "Yıllık Deneyim" },
    { Icon: Users, val: "50+", lbl: "Sanatçı Kadrosu" },
    { Icon: Star, val: `${showCount}+`, lbl: "Show Çeşidi" },
    { Icon: TrendingUp, val: "1000+", lbl: "Başarılı Etkinlik" },
  ];

  return (
    <div className="pt-32 pb-24 md:pb-32">
      {/* PAGE HEADER HERO */}
      <section className="relative mb-20 md:mb-28 overflow-hidden">
        <div className="absolute inset-0 bg-mesh-gradient opacity-40" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-gold-500/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 md:px-8 pt-10 pb-16 text-center">
          <div className="inline-flex items-center gap-2.5 mb-6 px-5 py-2.5 rounded-full border border-gold-500/30 bg-gold-500/8 backdrop-blur-xl">
            <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
            <span className="text-gold-300 text-[13px] font-semibold tracking-[0.08em] uppercase">Hakkımızda</span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight">
            Biz <span className="gold-gradient-text">Kimiz?</span>
          </h1>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-gold-500/60" />
            <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
            <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-gold-500/60" />
          </div>
          <p className="max-w-3xl mx-auto text-white/65 text-base md:text-xl leading-relaxed">
            Antalya'nın önde gelen lüks organizasyon şirketi olarak, yaratıcı show gruplarımız ve profesyonel ekibimizle
            etkinliklerinizi unutulmaz kılmak için buradayız.
          </p>
        </div>
      </section>

      {/* ABOUT CONTENT + STATS */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 mb-24 md:mb-32">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Image collage */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-gold rounded-3xl2 opacity-10 blur-3xl" />
              <div className="relative grid grid-cols-12 gap-3 sm:gap-4">
                <div className="col-span-8 aspect-[4/5] relative rounded-3xl2 overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] group">
                  <Image
                    src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=megastar%20organizasyon%20professional%20team%20dancers%20golden%20costumes%20backstage%20luxury%20event&image_size=portrait_4_3"
                    alt="Megastar Organizasyon Ekibi"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-width: 1024px) 65vw, 35vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-noir-900/70 via-transparent to-transparent" />
                </div>
                <div className="col-span-4 pt-12 space-y-3 sm:space-y-4">
                  <div className="aspect-square relative rounded-3xl2 overflow-hidden shadow-2xl group">
                    <Image
                      src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20stage%20performance%20dancer%20acrobat%20golden%20spotlight&image_size=square_hd"
                      alt="Sahne Performansı"
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      sizes="20vw"
                    />
                  </div>
                  <div className="aspect-[4/3] relative rounded-3xl2 overflow-hidden shadow-2xl group">
                    <Image
                      src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=antalya%20luxury%20hotel%20pool%20party%20night%20entertainment%20neon&image_size=landscape_4_3"
                      alt="Havuz Partisi"
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      sizes="20vw"
                    />
                  </div>
                </div>
              </div>
              {/* Floating stat */}
              <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-8 bg-gradient-gold p-5 sm:p-6 rounded-2xl shadow-2xl shadow-gold-500/20 max-w-[220px] z-10 group-hover:scale-[1.03] transition">
                <Award className="w-7 h-7 text-noir-900 mb-1.5 opacity-80" />
                <div className="font-display text-3xl font-bold text-noir-900 leading-none mb-1">10+</div>
                <div className="text-xs font-semibold text-noir-900/70">Yıllık Deneyim</div>
              </div>
            </div>
          </div>

          {/* Content + stats grid */}
          <div className="lg:col-span-7 space-y-8 md:space-y-10">
            <div
              className="text-white/70 text-[15px] md:text-lg leading-relaxed space-y-4 md:space-y-5 [&_strong]:text-gold-400 [&_strong]:font-semibold [&_h2]:text-3xl [&_h2]:font-display [&_h2]:text-white [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_li]:pl-1"
              dangerouslySetInnerHTML={{ __html: formatRichText(s.about) }}
            />

            {/* Stats 2x2 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {stats.map(({ Icon, val, lbl }) => (
                <div key={lbl} className="glass-panel p-5 rounded-2xl text-center group hover:border-gold-500/40 transition-all">
                  <Icon className="w-6 h-6 text-gold-400 mx-auto mb-3" />
                  <div className="font-display text-2xl md:text-3xl font-bold gold-gradient-text mb-1 leading-none">{val}</div>
                  <div className="text-[11px] md:text-xs text-white/55 tracking-wide font-medium">{lbl}</div>
                </div>
              ))}
            </div>

            {/* Features list */}
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {["Özel Tasarım Sahne Dekorları", "Özgün Sahne Kostümleri", "Profesyonel Sanatçı Kadrosu", "7/24 Müşteri Desteği"].map((t) => (
                <div key={t} className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-gold-500/30 transition group">
                  <div className="w-9 h-9 shrink-0 rounded-full bg-gradient-gold/10 border border-gold-500/20 flex items-center justify-center group-hover:scale-110 transition">
                    <CheckCircle2 className="w-4 h-4 text-gold-400" />
                  </div>
                  <span className="text-white/80 text-sm md:text-[15px] font-medium">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="mb-24 md:mb-32 max-w-7xl mx-auto px-5 sm:px-6 md:px-8">
        <div className="section-title mb-14 md:mb-20">
          <span className="eyebrow">DEĞERLERİMİZ</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl">Bizi Yapan Değerler</h2>
          <div className="divider" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {values.map(({ Icon, title, desc, num }) => (
            <div key={title} className="glass-panel p-7 md:p-8 rounded-3xl2 hover:border-gold-500/40 transition-all duration-500 hover:-translate-y-1.5 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-gold opacity-0 group-hover:opacity-[0.05] transition" />
              <div className="font-display text-6xl md:text-7xl font-bold text-white/[0.04] absolute top-3 right-5 leading-none select-none">{num}</div>
              <div className="relative">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-gold/10 border border-gold-500/25 flex items-center justify-center group-hover:scale-110 group-hover:bg-gradient-gold/15 transition-all">
                  <Icon className="w-8 h-8 text-gold-400" strokeWidth={1.8} />
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold mb-3 text-white">{title}</h3>
                <p className="text-white/60 text-sm md:text-[15px] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LOCATION MAP + CTA */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8">
        <div className="relative overflow-hidden rounded-3xl2">
          <div className="absolute inset-0 bg-mesh-gradient rounded-3xl2" />
          <div className="absolute inset-0 rounded-3xl2 overflow-hidden">
            <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-gold-500/12 blur-3xl animate-blob" />
            <div className="absolute -bottom-32 right-1/4 w-[450px] h-[450px] rounded-full bg-amber-600/10 blur-3xl animate-blob animation-delay-4000" />
          </div>

          <div className="relative py-12 md:py-16 px-5 sm:px-8 md:px-12 lg:px-16">
            <div className="max-w-4xl mx-auto text-center mb-10 md:mb-12">
              <span className="eyebrow inline-block mb-4">KONUMUMUZ</span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-5">
                Bizi <span className="gold-gradient-text">Nerede Bulabilirsiniz?</span>
              </h2>
              <p className="text-white/65 md:text-lg leading-relaxed max-w-2xl mx-auto">
                Antalya'nın kalbinde, tüm etkinlik alanlarına kolay ulaşım sağlayan merkezi konumumuzdan hizmet veriyoruz.
              </p>
            </div>

            {/* Google Map */}
            <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] border border-gold-500/20 group mb-10 md:mb-12">
              <div className="absolute inset-0 bg-gradient-gold opacity-[0.06] pointer-events-none z-10 rounded-2xl md:rounded-3xl" />
              <div className="absolute -inset-1 bg-gradient-gold rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-20 blur-md transition duration-700" />
              <div className="relative aspect-[16/9] w-full">
                <iframe
                  src="https://www.google.com/maps?q=36.653486,31.676431&z=15&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Megastar Organizasyon Konumu - Antalya"
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* CTA Butonu */}
            <div className="flex justify-center">
              <Link href="/iletisim" className="btn-gold-solid text-sm md:text-base">
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                Hemen İletişime Geç
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
