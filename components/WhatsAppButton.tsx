"use client";

import { MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  number: string;
}

export default function WhatsAppButton({ number }: Props) {
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800);
    const tooltip = setTimeout(() => setShowTooltip(true), 2200);
    const hideTooltip = setTimeout(() => setShowTooltip(false), 7500);
    return () => {
      clearTimeout(t);
      clearTimeout(tooltip);
      clearTimeout(hideTooltip);
    };
  }, []);

  if (!number) return null;
  const cleanNum = number.replace(/\D/g, "");
  const href = `https://wa.me/${cleanNum}?text=${encodeURIComponent("Merhaba Megastar Organizasyon, etkinlik için bilgi almak istiyorum.")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`whatsapp-btn-wrapper fixed z-[60] right-4 md:right-7 bottom-4 md:bottom-7 transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      aria-label="WhatsApp ile iletişime geç"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="relative group">
        {/* Pulse ring */}
        <div className="absolute inset-0 -m-2 rounded-full bg-green-500/30 animate-ping" style={{ animationDuration: "2.2s" }} />
        <div className="absolute inset-0 -m-4 rounded-full bg-green-500/15 animate-ping" style={{ animationDuration: "3s", animationDelay: "0.6s" }} />

        {/* Glow */}
        <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition duration-300" />

        {/* Main button */}
        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center shadow-2xl shadow-green-500/40 hover:scale-110 active:scale-95 transition-all duration-300 overflow-hidden">
          {/* Shine sweep */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-white fill-white/90 relative z-10" />
        </div>

        {/* Tooltip */}
        {(showTooltip) && (
          <div className={`absolute right-full mr-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
            showTooltip ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
          }`}>
            <div className="relative whitespace-nowrap">
              <div className="bg-noir-900/98 backdrop-blur-xl border border-gold-500/30 px-5 py-3.5 rounded-2xl shadow-2xl shadow-black/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 text-white fill-white/80" />
                </div>
                <div>
                  <div className="text-[11px] text-white/50 font-semibold uppercase tracking-wider">7/24 Destek</div>
                  <div className="text-sm font-bold text-white leading-tight">WhatsApp'tan Yazın!</div>
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); setShowTooltip(false); }}
                  className="w-6 h-6 ml-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-white/40 hover:text-white transition shrink-0"
                  aria-label="Kapat"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <span className="absolute top-1/2 -right-1.5 w-3 h-3 bg-noir-900/98 border-r border-t border-gold-500/30 rotate-45 -translate-y-1/2" />
            </div>
          </div>
        )}
      </div>
    </a>
  );
}
