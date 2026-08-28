import type { Metadata } from "next";
import Link from "next/link";
import { getAllReferences, getFeaturedReferences } from "@/lib/db";
import { Star, Building2, Sparkles, Crown, ExternalLink, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Referanslarımız | Megastar Organizasyon - Antalya",
  description: "Megastar Organizasyon olarak çalıştığımız değerli 5 yıldızlı otel ve marka referanslarımız. Antalya ve Türkiye'nin önde gelen tesisleriyle iş birliği.",
  keywords: ["Antalya otel organizasyon", "5 yıldızlı otel eğlence", "otel referansları", "Megastar Organizasyon referanslar", "Antalya profesyonel organizasyon"],
  alternates: { canonical: "/referanslarimiz" },
  openGraph: {
    type: "website",
    title: "Referanslarımız | Megastar Organizasyon",
    description: "Antalya'nın önde gelen 5 yıldızlı otelleri ve markalarıyla çalışan Megastar Organizasyon referansları.",
    locale: "tr_TR",
  },
};

export default function ReferencesPage() {
  const allRefs = getAllReferences();
  const categories = Array.from(new Set(allRefs.map(r => r.category).filter(Boolean))) as string[];

  const grouped: Record<string, typeof allRefs> = {};
  allRefs.forEach(r => {
    const key = r.category || "Diğer";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(r);
  });

  return (
    <div className="pt-32 pb-24 md:pb-32">
      {/* PAGE HEADER */}
      <section className="relative mb-16 md:mb-20 overflow-hidden">
        <div className="absolute inset-0 bg-mesh-gradient opacity-40" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-gold-500/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 md:px-8 pt-10 pb-14 text-center">
          <div className="inline-flex items-center gap-2.5 mb-6 px-5 py-2.5 rounded-full border border-gold-500/30 bg-gold-500/8 backdrop-blur-xl">
            <Crown className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-gold-300 text-[13px] font-semibold tracking-[0.08em] uppercase">Referanslarımız</span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight">
            Değerli <span className="gold-gradient-text">İş Ortaklarımız</span>
          </h1>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-gold-500/60" />
            <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
            <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-gold-500/60" />
          </div>
          <p className="max-w-3xl mx-auto text-white/65 text-base md:text-xl leading-relaxed mb-12">
            Megastar Organizasyon olarak, Antalya ve Türkiye'nin önde gelen 5 yıldızlı otelleri,
            resort tesisleri ve değerli markalarıyla çalışmaktan gurur duyuyoruz.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-3xl mx-auto">
            {[
              { val: allRefs.length, lbl: "Toplam Referans", Icon: Building2 },
              { val: categories.length, lbl: "Kategori", Icon: Award },
              { val: getFeaturedReferences().length, lbl: "Öne Çıkan", Icon: Sparkles },
            ].map(({ val, lbl, Icon }) => (
              <div key={lbl} className="glass-panel p-4 md:p-6 rounded-2xl md:rounded-3xl2 group hover:border-gold-500/40 transition-all">
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-gold-400 mx-auto mb-2 md:mb-3" />
                <div className="font-display text-2xl md:text-4xl font-bold gold-gradient-text mb-1 leading-none">{val}</div>
                <div className="text-[10px] md:text-xs text-white/55 tracking-wide font-medium">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY SECTIONS */}
      <section className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 space-y-16">
        {Object.entries(grouped).map(([category, refs]) => (
          <div key={category} className="reveal-up">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-10 rounded-full bg-gradient-gold" />
              <div>
                <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-1">{category}</h2>
                <p className="text-white/50 text-sm">{refs.length} adet iş ortağımız</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
              {refs.map((ref, i) => {
                const Wrapper: any = ref.website && ref.website !== "#"
                  ? ({ children }: any) => (
                      <a href={ref.website ?? undefined} target="_blank" rel="noopener noreferrer" className="group block">
                        {children}
                      </a>
                    )
                  : ({ children }: any) => <div className="group block">{children}</div>;
                return (
                  <Wrapper key={ref.id}>
                    <div
                      className={`relative aspect-[4/3] rounded-2xl md:rounded-3xl2 border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm overflow-hidden hover:border-gold-500/40 hover:shadow-[0_20px_60px_-20px_rgba(225,190,35,0.25)] hover:-translate-y-1 transition-all duration-500 ${
                        ref.featured ? "ring-1 ring-gold-500/20" : ""
                      }`}
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      {/* corner frame accents */}
                      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-gold-500/25 rounded-tl-xl group-hover:border-gold-500/60 transition" />
                      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-gold-500/25 rounded-tr-xl group-hover:border-gold-500/60 transition" />
                      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-gold-500/25 rounded-bl-xl group-hover:border-gold-500/60 transition" />
                      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-gold-500/25 rounded-br-xl group-hover:border-gold-500/60 transition" />

                      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 via-gold-500/0 to-gold-500/[0.04] group-hover:from-gold-500/[0.06] group-hover:via-gold-500/[0.02] group-hover:to-gold-500/0 transition" />

                      <div className="relative w-full h-full flex flex-col items-center justify-center p-4 gap-2">
                        {ref.logo ? (
                          <>
                            <img
                              src={ref.logo}
                              alt={ref.name}
                              className="max-w-[80%] max-h-[65%] w-auto h-auto object-contain opacity-80 group-hover:opacity-100 transition duration-500 drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)] group-hover:scale-105"
                            />
                            <div className="text-center mt-1">
                              <div className="text-[11px] md:text-xs font-medium text-white/70 group-hover:text-white transition line-clamp-2">
                                {ref.name}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-gold-500/15 to-amber-600/10 border border-gold-500/25 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                              <Building2 className="w-6 h-6 md:w-7 md:h-7 text-gold-400" />
                            </div>
                            <div className="text-center">
                              <div className="text-[11px] md:text-xs font-semibold text-white/80 group-hover:text-white group-hover:text-gold-200 transition line-clamp-2 leading-tight">
                                {ref.name}
                              </div>
                              {ref.category && (
                                <div className="text-[9px] md:text-[10px] text-white/40 mt-1 tracking-wide uppercase">
                                  {ref.category}
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        {ref.website && ref.website !== "#" && (
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
                            <div className="w-7 h-7 rounded-lg bg-gold-500/90 flex items-center justify-center shadow-gold">
                              <ExternalLink className="w-3 h-3 text-noir-900" />
                            </div>
                          </div>
                        )}

                        {ref.featured && (
                          <div className="absolute top-3 left-3">
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-gold">
                              <Star className="w-2.5 h-2.5 text-noir-900 fill-noir-900" />
                              <span className="text-[9px] font-bold text-noir-900 leading-none">Öne Çıkan</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="reveal-up relative rounded-3xl2 overflow-hidden border border-gold-500/20 mt-24">
          <div className="absolute inset-0 bg-gradient-gold opacity-10" />
          <div className="absolute inset-0 bg-mesh-gradient" />
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-gold flex items-center justify-center shadow-lg shadow-gold-500/25">
                <Sparkles className="w-6 h-6 text-noir-900" />
              </div>
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">Etkinliğiniz İçin Birlikte Çalışalım</h3>
                <p className="text-white/60 text-sm md:text-base max-w-xl">
                  Oteliniz, tesisiniz veya markanız için profesyonel organizasyon çözümleri için hemen bizimle iletişime geçin.
                </p>
              </div>
            </div>
            <Link href="/iletisim" className="btn-gold shrink-0 w-full md:w-auto justify-center">
              İletişime Geç
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
