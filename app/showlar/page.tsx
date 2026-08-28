import { getAllShows } from "@/lib/shows";
import ShowCard from "@/components/ShowCard";
import type { Metadata } from "next";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Sahne Gösterilerimiz | Megastar Organizasyon - Antalya",
  description: "Megastar Organizasyon show grupları: Dans, akrobati, çocuk etkinlikleri, temalı parti konseptleri ve daha fazlası. Antalya ve tüm Türkiye'de hizmet.",
  keywords: ["Antalya show grupları", "dans gösterisi", "akrobati şovu", "çocuk etkinliği", "otel eğlencesi", "Megastar Organizasyon", "sahne gösterileri"],
  alternates: { canonical: "/showlar" },
};

export default function ShowsPage() {
  const shows = getAllShows();

  return (
    <div className="pt-24 md:pt-28 pb-24 md:pb-32">
      {/* PAGE HEADER HERO - Rakip gibi koyu arka plan + büyük başlık */}
      <section className="relative mb-16 md:mb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-noir-950 via-noir-900 to-noir-950" />
          <div className="absolute inset-0 bg-mesh-gradient opacity-40" />
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-gold-500/10 blur-3xl" />
          <div className="absolute top-10 right-1/4 w-[500px] h-[300px] rounded-full bg-amber-600/10 blur-3xl" />
          <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 md:px-8 pt-10 pb-16 md:pt-16 md:pb-20 text-center">
          <h1 className="distressed-title text-[clamp(2.8rem,7vw,5.5rem)] text-white leading-[0.92] mb-6 md:mb-8 drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
            SAHNE GÖSTERİLER
          </h1>
          <div className="w-20 md:w-24 h-1 bg-gradient-gold-solid mx-auto mb-8 md:mb-10 rounded-full" />

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="inline-flex items-center gap-2 text-sm md:text-base">
            <Link
              href="/"
              className="text-white/70 hover:text-gold-400 transition font-medium tracking-wide"
            >
              Anasayfa
            </Link>
            <span className="text-gold-500 font-bold">|</span>
            <span className="font-impact font-bold tracking-[0.1em] uppercase text-white">
              Sahne Gösteriler
            </span>
          </nav>
        </div>
      </section>

      {/* SHOW GRID - Ana sayfanın koyu atmosferiyle devam eder */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 py-12 md:py-16">
        {/* Toplam bilgi satırı */}
        <div className="flex items-center justify-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/10">
            <Star className="w-3.5 h-3.5 text-gold-500 fill-gold-500" />
            <span className="text-sm md:text-[15px] font-semibold text-white/75">
              Toplam <span className="gold-gradient-text font-bold">{shows.length}</span> adet gösteri mevcut
            </span>
          </div>
        </div>

        {/* 3 kolonlu grid - rakiptaki gibi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          {shows.map((sh, i) => (
            <div key={sh.id} className="reveal-up" style={{ animationDelay: `${i * 40}ms` }}>
              <ShowCard show={sh} />
            </div>
          ))}
        </div>

        {/* Son CTA */}
        <div className="mt-16 md:mt-20 flex justify-center">
          <Link href="/iletisim" className="btn-gold-solid text-sm md:text-base">
            Rezervasyon İçin İletişime Geç
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
