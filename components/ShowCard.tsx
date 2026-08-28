import Link from "next/link";
import Image from "next/image";
import { Show } from "@/lib/shows";

interface Props { show: Show; }

export default function ShowCard({ show }: Props) {
  return (
    <Link
      href={`/show/${show.slug}`}
      aria-label={`${show.name} gösterisi detayı`}
      className="group relative block rounded-[2px] overflow-hidden will-change-transform
                 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.65)]
                 ring-1 ring-white/[0.05]
                 hover:ring-1 hover:ring-gold-500/60
                 hover:shadow-[0_20px_60px_-15px_rgba(199,165,106,0.32)]
                 transition-all duration-[500ms] ease-out
                 focus:outline-none focus:ring-2 focus:ring-gold-400"
    >
      <div className="relative aspect-[1759/2560] overflow-hidden">
        <Image
          src={show.image || "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=stage%20performance%20luxury%20show%20poster&image_size=portrait_4_3"}
          alt={`${show.name} - Megastar Organizasyon`}
          fill
          priority={false}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover
                     transition-transform duration-[650ms] cubic-bezier(0.22, 1, 0.36, 1)
                     group-hover:scale-[1.09]
                     group-active:scale-[1.04]"
        />

        {/* Hover overlay: Altın gradient */}
        <div
          className="absolute inset-0
                     bg-gradient-to-t from-black/65 via-black/10 to-transparent
                     opacity-0 group-hover:opacity-100
                     transition-opacity duration-[500ms] ease-out
                     pointer-events-none"
        />

        {/* Altın çerçeve (hover'da belirir) */}
        <div
          className="absolute inset-0
                     border-2 border-transparent
                     group-hover:border-gold-400/70
                     transition-all duration-[400ms] ease-out
                     pointer-events-none"
        />

        {/* Köşe süsleri (rakip poster havası) */}
        <div
          className="absolute top-3 left-3 w-6 h-6
                     border-t-2 border-l-2 border-gold-400/0
                     group-hover:border-gold-400/80
                     transition-all duration-500 delay-75
                     pointer-events-none"
        />
        <div
          className="absolute top-3 right-3 w-6 h-6
                     border-t-2 border-r-2 border-gold-400/0
                     group-hover:border-gold-400/80
                     transition-all duration-500 delay-75
                     pointer-events-none"
        />
        <div
          className="absolute bottom-3 left-3 w-6 h-6
                     border-b-2 border-l-2 border-gold-400/0
                     group-hover:border-gold-400/80
                     transition-all duration-500 delay-75
                     pointer-events-none"
        />
        <div
          className="absolute bottom-3 right-3 w-6 h-6
                     border-b-2 border-r-2 border-gold-400/0
                     group-hover:border-gold-400/80
                     transition-all duration-500 delay-75
                     pointer-events-none"
        />
      </div>
    </Link>
  );
}
