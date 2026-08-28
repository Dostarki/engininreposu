"use client";

import { useMemo, useState } from "react";
import ShowCard from "@/components/ShowCard";
import { Show } from "@/lib/shows";
import { Search, SlidersHorizontal, Grid3X3, LayoutGrid, X } from "lucide-react";

interface Props { shows: Show[]; }

export default function ShowsClient({ shows }: Props) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<string>();
    shows.forEach(s => s.category && set.add(s.category));
    return Array.from(set);
  }, [shows]);

  const filtered = shows.filter(s => {
    const matchQ = !query || s.name.toLowerCase().includes(query.toLowerCase()) || (s.short_description || "").toLowerCase().includes(query.toLowerCase());
    const matchC = !activeCat || s.category === activeCat;
    return matchQ && matchC;
  });

  return (
    <>
      <div className="glass-panel p-5 md:p-7 rounded-3xl2 mb-10 md:mb-12 border-white/5 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl" />

        <div className="relative flex flex-col gap-5">
          {/* Search */}
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-xl group">
              <div className="absolute inset-0 bg-gradient-gold rounded-2xl opacity-0 group-hover:opacity-10 group-focus-within:opacity-15 blur transition" />
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-gold-400 transition" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Show ara..."
                  className="input-field pl-14 !pr-14 !py-4 !rounded-2xl"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="lg:hidden inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white/80 font-semibold"
            >
              <SlidersHorizontal className="w-4.5 h-4.5" />
              Kategoriler
              {activeCat && (
                <span className="ml-1 px-2 py-0.5 text-[11px] rounded-full bg-gradient-gold text-noir-900 font-bold">1</span>
              )}
            </button>
          </div>

          {/* Categories */}
          <div className={`flex flex-wrap gap-2.5 lg:!flex ${filtersOpen ? "flex" : "hidden lg:flex"}`}>
            <button
              onClick={() => setActiveCat(null)}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeCat === null
                  ? "bg-gradient-gold text-noir-900 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30"
                  : "bg-white/[0.03] border border-white/10 text-white/70 hover:border-gold-500/40 hover:text-white hover:bg-white/[0.05]"
              }`}
            >
              <span className="inline-flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5" />
                Tümü ({shows.length})
              </span>
            </button>
            {categories.map(c => {
              const count = shows.filter(s => s.category === c).length;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCat(activeCat === c ? null : c)}
                  className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    activeCat === c
                      ? "bg-gradient-gold text-noir-900 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30"
                      : "bg-white/[0.03] border border-white/10 text-white/70 hover:border-gold-500/40 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Grid3X3 className="w-3.5 h-3.5" />
                    {c}
                    <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${activeCat === c ? "bg-noir-900/20 text-noir-900" : "bg-white/5 text-white/50"}`}>
                      {count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active filter pill */}
          {(query || activeCat) && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
              <span className="text-xs text-white/50 font-medium">Aktif Filtreler:</span>
              {activeCat && (
                <button
                  onClick={() => setActiveCat(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-gold/10 border border-gold-500/30 text-gold-400 hover:bg-gradient-gold hover:text-noir-900 hover:border-transparent transition-all"
                >
                  {activeCat}
                  <X className="w-3 h-3" />
                </button>
              )}
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition"
                >
                  Arama: "{query}"
                  <X className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={() => { setActiveCat(null); setQuery(""); }}
                className="text-xs font-semibold text-white/40 hover:text-white/70 underline underline-offset-4 ml-1"
              >
                Tümünü Temizle
              </button>
            </div>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 glass-panel rounded-3xl2 border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh-gradient opacity-50" />
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-gold/10 border border-gold-500/20 flex items-center justify-center">
              <Search className="w-10 h-10 text-gold-400" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2 text-white">Show Bulunamadı</h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">Aradığınız kriterlere uygun show bulunamadı. Filtreleri temizleyerek veya farklı bir kelime arayarak tekrar deneyin.</p>
            <button
              onClick={() => { setActiveCat(null); setQuery(""); }}
              className="btn-outline"
            >
              Filtreleri Sıfırla
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6 px-1">
            <p className="text-sm text-white/50 font-medium">
              <span className="text-gold-400 font-bold">{filtered.length}</span> adet show listeleniyor
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {filtered.map((s, i) => (
              <div key={s.id} className="reveal-up" style={{ animationDelay: `${i * 50}ms` }}>
                <ShowCard show={s} />
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
