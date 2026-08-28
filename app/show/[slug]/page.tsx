import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getAllShows, getShowBySlug, type Show } from "@/lib/shows";
import { ArrowRight, Clock, Sparkles, Star, Users, CheckCircle2 } from "lucide-react";
import { formatRichText } from "@/lib/format";
import OrientalReservationClient from "@/components/OrientalReservationClient";

interface Props { params: { slug: string }; }

function resolveVideo(url: string | null | undefined): {
  type: "youtube" | "video" | "none";
  embed?: string;
  raw?: string;
  id?: string;
} {
  if (!url) return { type: "none" };
  try {
    let id = "";
    const m1 = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/);
    if (m1 && m1[1]) {
      id = m1[1];
      return {
        type: "youtube",
        id,
        embed: `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`,
      };
    }
    return { type: "video", raw: url };
  } catch {
    return { type: "none" };
  }
}

export async function generateStaticParams() {
  return getAllShows().map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = getShowBySlug(params.slug);
  if (!s) return {};
  return {
    title: `${s.name} | Megastar Organizasyon - Antalya`,
    description: s.short_description || `${s.name} gösterisi Megastar Organizasyon güvencesiyle. Detaylı bilgi ve rezervasyon için tıklayın.`,
    keywords: [s.name, s.category || "", "Antalya organizasyon", "show", "dans", "akrobati"].filter(Boolean),
    alternates: { canonical: `/show/${s.slug}` },
    openGraph: {
      title: `${s.name} | Megastar Organizasyon`,
      description: s.short_description || "",
      images: s.image ? [s.image] : [],
    },
  };
}

function OrientalShowPage({ show, video }: { show: Show; video: ReturnType<typeof resolveVideo> }) {
  const storyImage = "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20oriental%20belly%20dance%20performer%20in%20elegant%20gold%20costume%20on%20luxury%20hotel%20stage%20warm%20spotlight%20editorial%20event%20photography&image_size=portrait_4_3";
  const stageImage = "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=oriental%20dance%20show%20with%20led%20wings%20and%20golden%20light%20on%20a%20luxury%20night%20stage%20cinematic%20event%20photography&image_size=landscape_4_3";
  const coverImage = show.image || storyImage;

  return (
    <div className="pt-24 md:pt-28">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-5 pb-8 text-sm text-white/45 sm:px-7 lg:px-10">
        <Link href="/" className="transition hover:text-gold-200">Anasayfa</Link>
        <span className="text-gold-400">/</span>
        <Link href="/showlar" className="transition hover:text-gold-200">Sahne gösterileri</Link>
        <span className="text-gold-400">/</span>
        <span className="text-white/75">Oryantal</span>
      </div>

      <section className="section-dark border-y border-white/[0.06] py-12 sm:py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-7 lg:grid-cols-12 lg:gap-16 lg:px-10">
          <div className="lg:col-span-7">
            <div className="group relative overflow-hidden rounded-3xl2 border border-gold-400/20 bg-black shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
              {video.type === "youtube" && video.embed ? (
                <div className="relative aspect-video bg-black">
                  <iframe
                    src={video.embed}
                    title="Oryantal gösterisi video"
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="eager"
                  />
                </div>
              ) : (
                <div className="relative aspect-video">
                  <Image src={coverImage} alt="Oryantal gösterisi" fill priority className="object-cover transition duration-700 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 58vw" />
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="pointer-events-none absolute bottom-5 left-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                <span className="h-2 w-2 rounded-full bg-gold-300 shadow-[0_0_14px_rgba(225,197,142,0.9)]" /> Megastar sahne seçkisi
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-gold-300">
              <Sparkles className="h-3.5 w-3.5" /> Doğu'nun gizemi, modern sahnenin enerjisi
            </div>
            <h1 className="distressed-title text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.85] text-white">ORYANTAL</h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/72 md:text-lg">
              Ritim, zarafet ve tutkunun aynı sahnede buluştuğu; gecenizin atmosferini ilk andan itibaren değiştiren özel bir performans.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-white/60">
              <span className="border border-white/10 px-3 py-2">20-30 dakika</span>
              <span className="border border-white/10 px-3 py-2">1-3 sanatçı</span>
              <span className="border border-white/10 px-3 py-2">Otel ve özel davet</span>
            </div>
            <a href="#randevu-al" className="btn-gold-solid mt-8">
              Randevu Al <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="section-light py-16 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-7 lg:grid-cols-12 lg:gap-20 lg:px-10">
          <div className="lg:col-span-5">
            <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-gold-700"><Star className="h-3.5 w-3.5 fill-gold-600" /> Sahnenin ruhu</div>
            <h2 className="distressed-title text-[clamp(2rem,4.6vw,4rem)] leading-[0.88] text-noir-950">HER HAREKETTE BİR HİKAYE</h2>
            <div className="my-5 h-px w-20 bg-gold-600" />
            <p className="text-lg leading-relaxed text-noir-600">
              Klasik oryantal estetiğini çağdaş koreografiyle buluşturan bu gösteri, izleyiciyi yalnızca seyirci olmaktan çıkarır; gecenin ritmine dahil eder.
            </p>
            <p className="mt-5 text-base leading-relaxed text-noir-500">
              Uluslararası dansçı kadromuzun güçlü sahne hakimiyeti, özgün kostümler ve kusursuz müzik geçişleriyle her performans mekana özel bir atmosfer kazanır.
            </p>
          </div>
          <div className="relative lg:col-span-7">
            <div className="absolute -inset-3 border border-gold-500/25" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl2 bg-noir-950 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.45)]">
              <Image src={storyImage} alt="Oryantal dans sanatçısı" fill className="object-cover transition duration-700 hover:scale-105" sizes="(max-width: 1024px) 100vw, 58vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Zarif. Güçlü. Unutulmaz.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-dark py-16 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-7 lg:grid-cols-12 lg:gap-20 lg:px-10">
          <div className="relative order-2 lg:order-1 lg:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl2 border border-white/10 bg-black shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
              <Image src={stageImage} alt="LED kanatlı oryantal sahne gösterisi" fill className="object-cover transition duration-700 hover:scale-105" sizes="(max-width: 1024px) 100vw, 58vw" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/10" />
            </div>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-5">
            <div className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold-300"><Sparkles className="h-3.5 w-3.5" /> Etkinliğinize göre şekillenir</div>
            <h2 className="distressed-title text-[clamp(2rem,4.6vw,4rem)] leading-[0.88] text-white">SAHNENİZİN İMZASI</h2>
            <div className="my-5 h-px w-20 bg-gold-300" />
            <p className="text-base leading-relaxed text-white/72 md:text-lg">
              Mezdeke performansları, LED kanat koreografileri ve etkileyici ateş şovu; otel gecelerinden özel davetlere kadar her konseptte gecenin finalini yükseltir.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/72">
              {["2'li ve 3'lü senkronize performanslar", "LED kanat ve özel sahne aksesuarları", "Mekanı ve davetli profilini tamamlayan koreografi"].map((item) => (
                <li key={item} className="flex items-start gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-300" /> {item}</li>
              ))}
            </ul>
            <a href="#randevu-al" className="btn-outline mt-8">
              Randevu Al <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section id="randevu-al" className="section-dark py-16 sm:py-20 lg:py-28">
        <Suspense fallback={
          <div className="mx-auto max-w-6xl px-5 sm:px-7 lg:px-10">
            <div className="text-center text-white/50">Yükleniyor...</div>
          </div>
        }>
          <OrientalReservationClient />
        </Suspense>
      </section>
    </div>
  );
}

export default function ShowDetailPage({ params }: Props) {
  const show = getShowBySlug(params.slug);
  if (!show) notFound();
  const video = resolveVideo(show.video_url);

  if (show.slug === "oryantal") {
    return <OrientalShowPage show={show} video={video} />;
  }

  return (
    <div className="pt-24 md:pt-28 pb-20 md:pb-24">
      {/* ======================= 1. HERO - Üstte büyük başlık + breadcrumb ======================= */}
      <section className="relative w-full overflow-hidden mb-14 md:mb-20">
        <div className="absolute inset-0">
          <Image
            src={show.image || "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20stage%20performance%20concert&image_size=landscape_16_9"}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-noir-950/80 via-noir-900/75 to-noir-950/95" />
          <div className="absolute inset-0 bg-mesh-gradient opacity-30" />
          <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none" />
        </div>

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 md:px-8 pt-16 md:pt-20 pb-20 md:pb-24 text-center">
          <h1 className="distressed-title text-[clamp(2.2rem,5.5vw,4.5rem)] text-white leading-[0.95] mb-6 md:mb-8 drop-shadow-[0_6px_24px_rgba(0,0,0,0.7)]">
            {show.name}
          </h1>

          {/* Breadcrumb: Anasayfa | Sahne Gösterileri | {Show Adı} */}
          <nav aria-label="Breadcrumb" className="inline-flex items-center gap-2 text-sm md:text-[15px]">
            <Link href="/" className="text-white/60 hover:text-gold-400 transition font-medium">
              Anasayfa
            </Link>
            <span className="text-gold-500 font-bold">|</span>
            <Link href="/showlar" className="text-white/60 hover:text-gold-400 transition font-medium">
              Sahne Gösterileri
            </Link>
            <span className="text-gold-500 font-bold">|</span>
            <span className="font-impact font-bold tracking-[0.08em] uppercase text-white">
              {show.name}
            </span>
          </nav>
        </div>
      </section>

      {/* ======================= 2. İÇERİK ALANI - Beyaz arka plan, 2 kolon ======================= */}
      <section className="section-light max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-10 md:py-14 rounded-3xl2 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] border border-white/[0.05]">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ===== SOL KOLON: Video kapak + başlık + metin ===== */}
          <div className="lg:col-span-8 space-y-6 md:space-y-7">
            {/* VIDEO KAPAK - SİTE İÇİNDE OYNATMA (Artık YouTube'a yönlendirmiyor) */}
            <div className="rounded-2xl overflow-hidden group relative shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] border border-noir-100">
              {video.type === "youtube" && video.embed ? (
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    src={video.embed}
                    title={`${show.name} - Video`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    frameBorder={0}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : video.type === "video" && video.raw ? (
                <div className="relative aspect-video w-full bg-black">
                  <video
                    src={video.raw}
                    controls
                    playsInline
                    preload="metadata"
                    poster={show.image || undefined}
                    className="absolute inset-0 w-full h-full object-contain bg-black"
                  />
                </div>
              ) : (
                <div className="relative aspect-video">
                  <Image
                    src={show.image || "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=stage%20performance%20poster&image_size=landscape_16_9"}
                    alt={`${show.name} görseli`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    className="object-cover"
                  />
                </div>
              )}

              {/* Video varsa play overlay (opsiyonel görünüm) — sadece thumbnail kullanılan video durumlarında */}
              {video.type === "none" && (
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-noir-950/40 via-transparent to-transparent" />
              )}
            </div>

            {/* BAŞLIK + METİN */}
            <div className="space-y-5 md:space-y-6">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-noir-950 leading-tight">
                {show.name}
              </h2>

              {show.short_description && (
                <p className="text-noir-700 text-[15px] md:text-base leading-relaxed">
                  {show.short_description}
                </p>
              )}

              {show.description && (
                <div
                  className="space-y-4 text-noir-650 text-[15px] md:text-base leading-relaxed [&_strong]:text-noir-900 [&_strong]:font-semibold [&_em]:text-gold-700 [&_em]:not-italic [&_em]:font-semibold [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-noir-950 [&_h2]:mt-6 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-noir-900 [&_h3]:mt-5 [&_h4]:text-lg [&_h4]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_li]:pl-1"
                  dangerouslySetInnerHTML={{ __html: formatRichText(show.description) }}
                />
              )}
            </div>
          </div>

          {/* ===== SAĞ KOLON: ETKİNLİK BİLGİSİ KARTI ===== */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 bg-white rounded-2xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.15)] border border-noir-100 p-6 md:p-7 space-y-5 md:space-y-6">
              <div>
                <h3 className="text-xs md:text-sm font-impact font-bold uppercase tracking-[0.15em] text-noir-950 pb-3 md:pb-4 border-b border-noir-100">
                  ETKİNLİK BİLGİSİ
                </h3>
              </div>

              {/* Bilgi satırları */}
              <ul className="space-y-4 md:space-y-5">
                <li className="flex items-center gap-3.5">
                  <span className="w-9 h-9 shrink-0 rounded-lg bg-noir-50 border border-noir-100 flex items-center justify-center text-noir-500">
                    <Clock className="w-4 h-4 md:w-4.5 md:h-4.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] md:text-xs uppercase tracking-wider text-noir-400 font-bold">Süre</p>
                    <p className="text-noir-900 font-semibold text-sm md:text-[15px]">
                      {show.duration || "İsteğe Göre"}
                    </p>
                  </div>
                </li>

                <li className="flex items-center gap-3.5">
                  <span className="w-9 h-9 shrink-0 rounded-lg bg-noir-50 border border-noir-100 flex items-center justify-center text-noir-500">
                    <Users className="w-4 h-4 md:w-4.5 md:h-4.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] md:text-xs uppercase tracking-wider text-noir-400 font-bold">Kişi Sayısı</p>
                    <p className="text-noir-900 font-semibold text-sm md:text-[15px]">
                      {show.team_count || "İsteğe Göre"}
                    </p>
                  </div>
                </li>
              </ul>

              {/* BİZE ULAŞIN BUTONU - altın gradient */}
              <Link
                href={`/iletisim?show=${encodeURIComponent(show.name)}`}
                className="btn-gold-solid w-full !py-3.5 md:!py-4 text-sm md:text-[15px] justify-center"
              >
                BİZE ULAŞIN
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
