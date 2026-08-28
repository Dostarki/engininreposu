"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Star, Phone, Sparkles } from "lucide-react";

const navItems = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/showlar", label: "Showlar" },
  { href: "/referanslarimiz", label: "Referanslar" },
  { href: "/kariyer", label: "Kariyer" },
  { href: "/iletisim", label: "İletişim" },
];

interface Props {
  siteLogo?: string;
  phone?: string;
}

export default function Navbar({ siteLogo = "/megastar-logo.svg", phone = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
        scrolled
          ? "bg-noir-950/90 backdrop-blur-2xl border-b border-white/[0.10] py-3 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.85)]"
          : "bg-noir-950/30 backdrop-blur-md border-b border-white/[0.08] py-4 md:py-5"
      }`}
    >
      <div className="container-modern flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          {siteLogo ? (
            <img src={siteLogo} alt="Megastar Organizasyon" className="h-11 md:h-14 w-auto object-contain drop-shadow-[0_4px_20px_rgba(199,165,106,0.24)]" />
          ) : (
            <>
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-gold blur-md opacity-60 group-hover:opacity-90 transition group-hover:scale-110" />
                <div className="relative w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold animate-glow-pulse">
                  <Star className="w-5 h-5 md:w-6 md:h-6 text-noir-950 fill-noir-950" />
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-black text-xl md:text-2xl gold-gradient-text tracking-wide">
                  Megastar
                </span>
                <span className="text-[9px] md:text-[10px] text-white/50 tracking-[0.35em] uppercase font-luxury font-semibold mt-0.5">
                  Organizasyon
                </span>
              </div>
            </>
          )}
        </Link>

        <nav className="hidden lg:flex items-center gap-1 px-1 py-1 border-l border-white/[0.10] pl-5">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative group px-3.5 py-2.5 rounded-md text-sm font-medium transition-all duration-300 ${
                  active
                    ? "text-gold-300 bg-gold-500/[0.08]"
                    : "text-white/75 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {active && (
                  <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-gradient-gold" />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href={`tel:${phone || "+905555555555"}`}
            className="hidden xl:inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium text-white/75 hover:text-gold-300 hover:bg-white/[0.04] border border-white/[0.10] transition-all duration-300"
          >
            <Phone className="w-4 h-4 text-gold-400" />
            Hemen Ara
          </a>
          <Link href="/iletisim" className="btn-gold !py-2.5 !px-6 !text-sm">
            <Sparkles className="w-4 h-4 -ml-0.5" />
            Teklif
          </Link>
        </div>

        <div className="flex lg:hidden items-center gap-2">
          <a
            href={`tel:${phone || "+905555555555"}`}
            aria-label="Ara"
            className="w-11 h-11 rounded-md flex items-center justify-center border border-white/[0.10] bg-white/[0.04] text-gold-400 hover:bg-gold-500/10 hover:border-gold-500/40 transition"
          >
            <Phone className="w-4.5 h-4.5" />
          </a>
          <button
            className="lg:hidden w-11 h-11 rounded-md flex items-center justify-center border border-white/[0.10] bg-white/[0.04] text-white/90 hover:text-gold-300 hover:bg-gold-500/10 hover:border-gold-500/40 transition"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Menüyü Kapat" : "Menüyü Aç"}
          >
            <div className="relative w-5 h-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                  open ? "translate-y-2 rotate-45" : "translate-y-0.5"
                }`}
              />
              <span
                className={`absolute left-0 top-2 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                  open ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
                }`}
              />
              <span
                className={`absolute left-0 bottom-0 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                  open ? "-translate-y-2 -rotate-45" : "-translate-y-0.5"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          className="absolute inset-0 bg-noir-950/80 backdrop-blur-md"
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[88%] sm:w-[420px] bg-gradient-noir border-l border-white/[0.07] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-gold opacity-[0.04] pointer-events-none" />
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
                <Star className="w-5 h-5 text-noir-950 fill-noir-950" />
              </div>
              <div>
                <div className="font-display font-bold text-lg gold-gradient-text leading-none">Megastar</div>
                <div className="text-[9px] text-white/50 tracking-[0.3em] uppercase font-luxury font-semibold mt-0.5">Organizasyon</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-10 h-10 rounded-md flex items-center justify-center border border-white/[0.10] bg-white/[0.03] hover:bg-white/[0.08] hover:text-gold-300 transition"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex flex-col p-5 gap-1.5">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`group flex items-center justify-between px-5 py-4 rounded-2xl text-base font-medium transition-all duration-300 ${
                    active
                      ? "bg-gradient-gold-soft border border-gold-500/30 text-gold-200"
                      : "text-white/80 hover:bg-white/[0.04] hover:text-white border border-transparent"
                  }`}
                >
                  <span className="flex items-center gap-3.5">
                    <span className={`w-1.5 h-1.5 rounded-full transition-all ${active ? "bg-gradient-gold scale-125" : "bg-white/30 group-hover:bg-gold-400"}`} />
                    {item.label}
                  </span>
                  <span className={`text-xs transition ${active ? "opacity-100 text-gold-300" : "opacity-0 group-hover:opacity-60 text-white/60"}`}>
                    →
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-white/[0.06] space-y-3">
            <Link
              href="/iletisim"
              onClick={() => setOpen(false)}
              className="btn-gold w-full"
            >
              <Sparkles className="w-4 h-4" />
              Teklif Al
            </Link>
            <a
              href={`tel:${phone || "+905555555555"}`}
              className="btn-outline w-full !py-3 !text-sm"
            >
              <Phone className="w-4 h-4" />
              Hemen Ara: {phone || "+90 555 555 55 55"}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
