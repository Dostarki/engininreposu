import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Play,
  Sparkles,
  Star,
} from "lucide-react";
import { getAllShows } from "@/lib/shows";
import { getSetting } from "@/lib/db";
import ShowCard from "@/components/ShowCard";
import { formatRichText } from "@/lib/format";

function getYouTubeEmbed(url: string): { type: "youtube" | "video" | "none"; src: string } {
  if (!url) return { type: "none", src: "" };
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/);
  if (match?.[1]) {
    return {
      type: "youtube",
      src: `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&controls=0&playsinline=1&rel=0&playlist=${match[1]}`,
    };
  }
  return { type: "video", src: url };
}

export default function HomePage() {
  const shows = getAllShows().slice(0, 9);
  const settings = {
    heroImage: getSetting("hero_image"),
    heroVideo: getSetting("hero_video_url"),
    heroSubtitle: getSetting("hero_subtitle"),
    about: getSetting("about_text"),
    address: getSetting("address", "Antalya Merkez / Muratpaşa, Türkiye"),
    phone: getSetting("phone", "+90 555 555 55 55"),
    email: getSetting("email", "info@megastarorganizasyon.com"),
  };
  const heroVideo = getYouTubeEmbed(settings.heroVideo || "");
  const aboutHtml = settings.about
    ? formatRichText(settings.about)
    : "<p>Antalya merkezli Megastar Organizasyon, lüks oteller, kurumsal markalar ve özel etkinlikler için yaratıcı sahne deneyimleri tasarlar. Profesyonel ekibimizle her etkinliği estetik, enerji ve kusursuz organizasyon anlayışıyla hayata geçiriyoruz.</p>";
  const heroImage = settings.heroImage || "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20hotel%20stage%20performance%20dancers%20warm%20spotlights%20premium%20event%20antalya&image_size=landscape_16_9";

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* ARKA PLAN VİDEOSU - Her zaman öncelikli */}
        {heroVideo.type !== "none" ? (
          <div className="absolute inset-0 z-[1]">
            {heroVideo.type === "youtube" ? (
              <iframe
                src={heroVideo.src}
                title="Megastar Organizasyon sahne gösterisi - arka plan"
                className="absolute inset-0 h-full w-full pointer-events-none"
                allow="autoplay; encrypted-media; playsinline"
                frameBorder={0}
              />
            ) : (
              <video
                src={heroVideo.src}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full object-cover"
                poster={heroImage}
              />
            )}
          </div>
        ) : (
          /* Video yoksa fallback: kapak fotoğrafı */
          <Image src={heroImage} alt="Megastar Organizasyon sahne gösterisi" fill priority className="object-cover object-center" sizes="100vw" />
        )}
        {/* Karartıcı gradyanlar (video daha net görünür, butonlar yine okunaklı) */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/45 via-black/20 to-black/70" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-black/30 via-transparent to-black/30" />
        <div className="absolute inset-0 z-[2] bg-mesh-gradient opacity-10" />

        {/* ORTADAKİ İÇERİK - Üst etiket + ortada ŞEFFAF BÜYÜK Megastar Organizasyon + altta butonlar */}
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pt-12 md:pt-14 text-center min-h-screen flex flex-col items-center justify-center">
          <div className="mb-4 md:mb-8 inline-flex items-center gap-2 border border-gold-300/35 bg-black/30 px-4 py-2 text-[11px] md:text-xs font-semibold uppercase tracking-[0.22em] text-gold-200 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" /> Antalya'nın sahne ve eğlence uzmanı · 10+ Yıl
          </div>

          {/* MERKEZDE ŞEFFAF BÜYÜK Megastar Organizasyon - KALIN font, DÜŞÜK opaklık (video rahat görünsün) */}
          <div className="pointer-events-none select-none my-4 md:my-8">
            <div className="hero-brand-mega text-[clamp(3.2rem,12vw,10.5rem)] leading-[0.88] text-white/15">
              Megastar
            </div>
            <div className="mt-2 md:mt-3 hero-brand-org text-[clamp(1.6rem,6.5vw,5.2rem)] leading-[0.9] text-gold-200/15">
              Organizasyon
            </div>
          </div>

          <p className="mx-auto mt-3 md:mt-6 max-w-2xl text-base leading-relaxed text-white/78 md:text-lg">
            {settings.heroSubtitle || "Profesyonel show gruplarımız, özel sahne konseptlerimiz ve kusursuz prodüksiyon ile Antalya'daki 5 yıldızlı oteller ve özel etkinlikler için sahne deneyimleri tasarlıyoruz."}
          </p>

          <div className="mt-8 md:mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/showlar" className="btn-gold-solid">
              Gösterilerimizi keşfedin <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/iletisim" className="btn-outline border-white/35 text-white hover:border-gold-300 hover:text-gold-100">
              Teklif alın <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <Link href="#etkinlikler" className="mx-auto mt-12 md:mt-16 flex w-fit flex-col items-center gap-2 text-white/50 transition hover:text-gold-200">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Aşağı kaydır</span>
            <span className="flex h-10 w-6 items-start justify-center rounded-full border border-current p-1.5"><span className="h-2 w-1 rounded-full bg-current animate-bounce" /></span>
          </Link>
        </div>
      </section>

      <section id="etkinlikler" className="section-dark relative overflow-hidden py-20 sm:py-24 lg:py-32">
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-7 lg:px-10">
          <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-gold-300"><Star className="h-3.5 w-3.5 fill-gold-300" /> Megastar seçkisi</div>
              <h2 className="distressed-title text-[clamp(2.2rem,5.2vw,4.5rem)] leading-[0.88] text-white">SAHNE GÖSTERİLERİ</h2>
              <div className="mt-4 h-px w-20 bg-gold-300/80" />
            </div>
            <Link href="/showlar" className="btn-gold-solid self-start text-sm md:self-end">Tüm gösteriler <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
            {shows.map((show) => <ShowCard key={show.id} show={show} />)}
          </div>
        </div>
      </section>

      <section id="hakkimizda" className="section-light relative overflow-hidden py-20 sm:py-24 lg:py-32">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 sm:px-7 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-gold-700"><Star className="h-3.5 w-3.5 fill-gold-600" /> Biz kimiz?</div>
            <h2 className="distressed-title text-[clamp(2.2rem,5.2vw,4.5rem)] leading-[0.88] text-noir-950">HAYALİ GERÇEĞE DÖNÜŞTÜRÜYORUZ</h2>
            <div className="my-5 h-px w-20 bg-gold-600" />
            <div
              className="max-w-2xl text-base leading-relaxed text-noir-600 md:text-lg space-y-3 md:space-y-4 [&_strong]:text-noir-900 [&_strong]:font-semibold [&_em]:text-gold-700 [&_em]:font-semibold [&_em]:not-italic [&_h3]:text-xl [&_h3]:text-noir-900 [&_h3]:font-bold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:pl-1"
              dangerouslySetInnerHTML={{ __html: aboutHtml }}
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {["Özgün sahne konseptleri", "Profesyonel sanatçı kadrosu", "Lüks otel deneyimi", "7/24 çözüm ortağı"].map((item) => (
                <div key={item} className="flex items-center gap-3 border border-noir-100 bg-white/55 p-3.5 text-sm font-semibold text-noir-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-600" /> {item}
                </div>
              ))}
            </div>
            <Link href="/hakkimizda" className="btn-gold-solid mt-9 text-sm">Hakkımızda <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 border border-gold-500/25" />
            <div className="relative aspect-[4/3] overflow-hidden bg-noir-950 shadow-[0_35px_80px_-25px_rgba(0,0,0,0.45)]">
              <Image src={heroImage} alt="Megastar Organizasyon sahnesi" fill className="object-cover opacity-80" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute inset-x-6 bottom-6 md:inset-x-8 md:bottom-8 pointer-events-none">
                <div className="font-display text-[22px] md:text-3xl leading-[0.85] font-black text-white/15 tracking-widest">MEGASTAR</div>
                <div className="font-display text-[18px] md:text-2xl leading-[0.85] font-bold text-gold-300/15 tracking-[0.2em] mt-1">ORGANİZASYON</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="iletisim" className="section-dark py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[1300px] px-5 sm:px-7 lg:px-10">
          <div className="contact-panel overflow-hidden bg-white shadow-[0_50px_100px_-30px_rgba(0,0,0,0.5)]">
            <div className="grid lg:grid-cols-2">
              <div className="border-b border-noir-100 p-8 sm:p-10 lg:border-b-0 lg:border-r lg:p-14">
                <h2 className="distressed-title text-[clamp(2rem,4.2vw,3.6rem)] leading-[0.88] text-noir-950">ETKİNLİĞİNİZİ KONUŞALIM</h2>
                <div className="my-5 h-px w-20 bg-gold-600" />
                <p className="max-w-md text-base leading-relaxed text-noir-500">Etkinliğiniz için doğru gösteriyi, doğru ekibi ve doğru atmosferi birlikte tasarlayalım.</p>
                <div className="mt-10 space-y-6">
                  <div className="flex items-start gap-4"><MapPin className="mt-1 h-5 w-5 shrink-0 text-gold-600" /><div><strong className="block font-display text-xl text-noir-950">Adres</strong><span className="text-noir-600">{settings.address}</span></div></div>
                  <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="flex items-start gap-4"><Phone className="mt-1 h-5 w-5 shrink-0 text-gold-600" /><div><strong className="block font-display text-xl text-noir-950">Telefon</strong><span className="font-semibold text-noir-600">{settings.phone}</span></div></a>
                  <a href={`mailto:${settings.email}`} className="flex items-start gap-4"><Mail className="mt-1 h-5 w-5 shrink-0 text-gold-600" /><div><strong className="block font-display text-xl text-noir-950">E-posta</strong><span className="font-semibold text-noir-600">{settings.email}</span></div></a>
                </div>
              </div>
              <div className="bg-noir-50/40 p-8 sm:p-10 lg:p-14">
                <form action="/api/contact" method="POST" className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input required name="first_name" placeholder="Adınız" className="light-input" />
                    <input required name="last_name" placeholder="Soyadınız" className="light-input" />
                  </div>
                  <input required type="email" name="email" placeholder="E-posta adresiniz" className="light-input" />
                  <input type="tel" name="phone" placeholder="Telefon" className="light-input" />
                  <input name="subject" placeholder="Etkinlik konusu" className="light-input" />
                  <textarea required name="message" rows={5} placeholder="Etkinliğinizden bahsedin..." className="light-input resize-none" />
                  <button type="submit" className="btn-gold-solid w-full justify-center text-sm">Mesaj gönder <ArrowRight className="h-4 w-4" /></button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
