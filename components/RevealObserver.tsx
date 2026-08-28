"use client";

import { useEffect } from "react";

export default function RevealObserver() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = Array.from(document.querySelectorAll<HTMLElement>(".reveal-up"));

    if (prefersReduced) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    // GÜVENLİ FALLBACK: Sadece JS çalıştığında reveal-up'ları başlangıçta şeffaf yap
    // JS yüklenmezse CSS'te opacity:1 kaldığı için her şey görünür
    items.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(40px)";
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "";
            el.style.transform = "";
            el.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
    );

    items.forEach((el) => io.observe(el));

    // 5 sn sonra hala görünmemiş olanları görünür yap (güvenlik)
    const t = window.setTimeout(() => {
      items.forEach((el) => {
        if (!el.classList.contains("is-visible")) {
          el.style.opacity = "";
          el.style.transform = "";
          el.classList.add("is-visible");
        }
      });
    }, 5000);

    return () => {
      window.clearTimeout(t);
      io.disconnect();
    };
  }, []);

  return null;
}
