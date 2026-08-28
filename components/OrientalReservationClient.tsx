"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Clock, Star, CalendarClock, AlertTriangle } from "lucide-react";
import FormToast from "@/components/FormToast";
import { useSearchParams } from "next/navigation";

type Slot = { event_date: string; event_time: string | null; custom_time: string | null };
const DEFAULT_SLOTS = ["19:00", "21:00", "22:00", "23:00", "00:00"];

export default function OrientalReservationClient() {
  const params = useSearchParams();
  const status = params.get("status") || undefined;
  const [slots, setSlots] = useState<Slot[]>([]);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [toastStatus, setToastStatus] = useState(status || undefined);

  useEffect(() => {
    fetch("/api/oriental/slots", { cache: "no-store" })
      .then(r => r.json())
      .then((d: { ok?: boolean; slots?: Slot[] }) => {
        if (d?.ok && Array.isArray(d.slots)) setSlots(d.slots);
      })
      .catch(() => {});
  }, []);

  const bookedForSelectedDate = useMemo(() => {
    const set = new Set<string>();
    slots.forEach(s => {
      if (date && s.event_date === date) {
        if (s.event_time && s.event_time !== "custom") set.add(s.event_time);
      }
    });
    return set;
  }, [date, slots]);

  const bookedDates = useMemo(() => {
    const map = new Map<string, number>();
    slots.forEach(s => {
      const count = (map.get(s.event_date) || 0) + 1;
      map.set(s.event_date, count);
    });
    return map;
  }, [slots]);

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const t = String(fd.get("event_time") || "");
    if (t === "custom" && !String(fd.get("custom_time") || "").trim()) {
      alert("Özel saat istediğinizi yazınız.");
      return;
    }
    setSending(true);
    fetch("/api/oriental/reservation", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: fd,
    })
      .then(async r => {
        const ok = r.ok;
        if (ok) {
          setToastStatus("success");
          (e.currentTarget as HTMLFormElement).reset();
          setDate("");
          setTime("");
        } else {
          setToastStatus("error");
        }
      })
      .catch(() => setToastStatus("error"))
      .finally(() => setSending(false));

    setTimeout(() => setToastStatus(undefined), 6000);
  }

  return (
    <>
      <FormToast status={toastStatus} />

      <div className="mx-auto max-w-6xl px-5 sm:px-7 lg:px-10">
        <div className="mb-12 text-center md:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-gold-300"><Star className="h-3.5 w-3.5 fill-gold-300" /> Oryantal Randevu</div>
          <h2 className="distressed-title text-[clamp(2.2rem,5.2vw,4.5rem)] leading-[0.88] text-white">RANDEVU AL</h2>
          <div className="mx-auto mt-5 h-px w-20 bg-gold-300/80" />
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            Aşağıdaki formu doldurarak oryantal gösterimiz için rezervasyon talebinde bulunun. Onayınız sonrası sizinle iletişime geçeceğiz.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl2 border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 md:p-7">
              <h3 className="font-display font-bold text-white text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold-300" /> Mevcut Saatlerimiz
              </h3>
              <p className="text-sm text-white/65 mb-4">Standart gösteri saatlerimiz aşağıdadır. Özel saat için formda ilgili seçeneği işaretleyin.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {DEFAULT_SLOTS.map(h => (
                  <div key={h} className="rounded-md border border-gold-400/30 bg-gold-500/10 px-3 py-2.5 text-center text-sm font-bold text-gold-100 tracking-wider">
                    {h}
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-white/10 space-y-2">
                <p className="text-xs text-white/50 flex items-start gap-2">
                  <span className="mt-0.5 w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  Dolu saatler ve günler kırmızı ile işaretlenir. İsteğiniz admin tarafından onaylandıktan sonra saat dolu olarak işaretlenir.
                </p>
                <p className="text-xs text-white/50 flex items-start gap-2">
                  <span className="mt-0.5 w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  Bekleme durumundaki randevular henüz dolu sayılmaz. Aynı saatte birden fazla talep olabilir; yönetici hangisini onaylarsa o saat dolu olur.
                </p>
              </div>
            </div>

            <div className="rounded-3xl2 border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 md:p-7">
              <h3 className="font-display font-bold text-white text-lg mb-3">Neler beklemelisiniz?</h3>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li className="flex items-start gap-2.5"><CheckCircle2 className="mt-0.5 w-4 h-4 text-gold-400 shrink-0" /> 20-30 dakika arası özel sahne performansı</li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="mt-0.5 w-4 h-4 text-gold-400 shrink-0" /> LED kanat, mezdeke ve kostüm seçenekleri</li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="mt-0.5 w-4 h-4 text-gold-400 shrink-0" /> 1-3 sanatçı ekibi (isteğe göre artırılabilir)</li>
                <li className="flex items-start gap-2.5"><CheckCircle2 className="mt-0.5 w-4 h-4 text-gold-400 shrink-0" /> Otel veya özel mekana gelme kolaylığı</li>
              </ul>
            </div>

            {date && bookedForSelectedDate.size > 0 && (
              <div className="rounded-3xl2 border border-red-500/30 bg-red-500/10 p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-bold text-red-200 text-sm mb-1.5">Seçtiğiniz tarihin dolu saatleri:</div>
                    <div className="flex flex-wrap gap-2">
                      {[...bookedForSelectedDate].map(bt => (
                        <span key={bt} className="px-2.5 py-1 rounded-md bg-red-500/25 border border-red-500/40 text-red-100 text-xs font-bold tracking-wider">
                          {bt} · DOLU
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-3xl2 border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 md:p-7">
              <h3 className="font-display font-bold text-white text-lg mb-3 flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-gold-300" /> Dolu Günler (Hızlı Bakış)
              </h3>
              {bookedDates.size === 0 ? (
                <p className="text-sm text-white/50">Henüz onaylanmış dolu gün bulunmuyor. İstediğiniz günü rahatça seçebilirsiniz.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
                  {[...bookedDates.entries()].sort().map(([d, count]) => (
                    <div key={d} className="px-2.5 py-2 rounded-md bg-red-500/15 border border-red-500/30 text-[11px] font-bold text-red-200 tracking-wide">
                      {new Date(d).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", weekday: "short" })}
                      <span className="block text-[10px] text-red-300/80 mt-0.5">{count} Dolu Slot</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl2 border border-white/[0.08] bg-black/30 backdrop-blur-md p-6 md:p-8 space-y-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/55 mb-2">Ad Soyad *</label>
                  <input required name="full_name" placeholder="Adınız ve soyadınız" className="w-full px-4 py-3.5 rounded-md bg-noir-900/70 border border-white/[0.12] text-white placeholder:text-white/40 focus:outline-none focus:border-gold-400/70 focus:ring-4 focus:ring-gold-500/10 transition" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/55 mb-2">Otel / Mekan *</label>
                  <input required name="hotel" placeholder="Otel adı veya mekan bilgisi" className="w-full px-4 py-3.5 rounded-md bg-noir-900/70 border border-white/[0.12] text-white placeholder:text-white/40 focus:outline-none focus:border-gold-400/70 focus:ring-4 focus:ring-gold-500/10 transition" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/55 mb-2">İletişim Numarası *</label>
                  <input required type="tel" name="phone" placeholder="05XX XXX XX XX" className="w-full px-4 py-3.5 rounded-md bg-noir-900/70 border border-white/[0.12] text-white placeholder:text-white/40 focus:outline-none focus:border-gold-400/70 focus:ring-4 focus:ring-gold-500/10 transition" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/55 mb-2">E-posta *</label>
                  <input required type="email" name="email" placeholder="ornek@email.com" className="w-full px-4 py-3.5 rounded-md bg-noir-900/70 border border-white/[0.12] text-white placeholder:text-white/40 focus:outline-none focus:border-gold-400/70 focus:ring-4 focus:ring-gold-500/10 transition" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/55 mb-2">Tarih *</label>
                  <input
                    required
                    type="date"
                    name="event_date"
                    value={date}
                    min={minDate}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-md bg-noir-900/70 border border-white/[0.12] text-white placeholder:text-white/40 focus:outline-none focus:border-gold-400/70 focus:ring-4 focus:ring-gold-500/10 transition [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/55 mb-2">Saat *</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {DEFAULT_SLOTS.map(t => {
                      const isBooked = bookedForSelectedDate.has(t);
                      return (
                        <label key={t} className={`cursor-pointer ${isBooked ? "opacity-50 pointer-events-none" : ""}`}>
                          <input
                            type="radio"
                            name="event_time"
                            value={t}
                            className="peer sr-only"
                            checked={time === t}
                            disabled={isBooked}
                            onChange={() => setTime(t)}
                          />
                          <div className={`px-2 py-2.5 rounded-md border text-center text-xs font-bold tracking-wider transition ${
                            isBooked
                              ? "bg-red-500/20 border-red-500/50 text-red-300 line-through"
                              : time === t
                              ? "bg-gold-400 text-noir-950 border-gold-300 shadow-gold"
                              : "bg-noir-900/50 border-white/10 text-white/75 hover:border-gold-400/40"
                          }`}>
                            {isBooked ? `${t} · DOLU` : t}
                          </div>
                        </label>
                      );
                    })}
                    <label className="cursor-pointer col-span-3 sm:col-span-5">
                      <input
                        type="radio"
                        name="event_time"
                        value="custom"
                        className="peer sr-only"
                        checked={time === "custom"}
                        onChange={() => setTime("custom")}
                      />
                      <div className={`px-3 py-2.5 rounded-md border text-center text-xs font-bold tracking-wider transition ${
                        time === "custom"
                          ? "bg-gold-400 text-noir-950 border-gold-300 shadow-gold"
                          : "bg-noir-900/50 border-white/10 text-white/75 hover:border-gold-400/40"
                      }`}>
                        Özel saat belirle
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              {time === "custom" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/55 mb-2">İstediğiniz Özel Saat *</label>
                  <input required type="text" name="custom_time" placeholder="Örn: 20:30 veya 01:00 arası gibi" className="w-full px-4 py-3.5 rounded-md bg-noir-900/70 border border-white/[0.12] text-white placeholder:text-white/40 focus:outline-none focus:border-gold-400/70 focus:ring-4 focus:ring-gold-500/10 transition" />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-white/55 mb-2">Ek Not / İstekler</label>
                <textarea name="notes" rows={3} placeholder="Özel istekleriniz veya ek bilgiler..." className="w-full px-4 py-3.5 rounded-md bg-noir-900/70 border border-white/[0.12] text-white placeholder:text-white/40 focus:outline-none focus:border-gold-400/70 focus:ring-4 focus:ring-gold-500/10 transition resize-none" />
              </div>
              <input type="hidden" name="show_name" value="Oryantal" />
              <button
                type="submit"
                disabled={sending}
                className="btn-gold-solid w-full !justify-center text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? "Gönderiliyor..." : "Randevu Talebi Gönder"} <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-white/45 text-center leading-relaxed">
                Formu gönderdikten sonra talebiniz yönetici onayına düşer. Onaylandıktan sonra sizinle iletişime geçilecektir. Aynı saat için birden fazla talep olabilir, yönetici hangisini onaylarsa o saat dolu olarak işaretlenir.
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
