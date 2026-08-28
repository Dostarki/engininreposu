import { mutate, readDB, type DBShow } from "./db";

export type Show = DBShow;

export function getAllShows(): Show[] {
  return [...readDB().shows].sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);
}

export function getFeaturedShows(): Show[] {
  return getAllShows().filter(s => s.featured).slice(0, 12);
}

export function getShowBySlug(slug: string): Show | null {
  return readDB().shows.find(s => s.slug === slug) || null;
}

export function getShowById(id: number): Show | null {
  return readDB().shows.find(s => s.id === id) || null;
}

export function createShow(data: Omit<Show, "id" | "created_at">): number {
  return mutate<number>(db => {
    db.seq.shows++;
    const id = db.seq.shows;
    db.shows.push({ id, created_at: new Date().toISOString(), ...data });
    return id;
  });
}

export function updateShow(id: number, data: Partial<Omit<Show, "id" | "created_at">>) {
  return mutate<void>(db => {
    const idx = db.shows.findIndex(s => s.id === id);
    if (idx < 0) return;
    db.shows[idx] = { ...db.shows[idx], ...data };
  });
}

export function deleteShow(id: number) {
  return mutate<void>(db => {
    db.shows = db.shows.filter(s => s.id !== id);
  });
}

export function slugify(str: string): string {
  const map: Record<string, string> = {
    ç: "c", Ç: "C", ğ: "g", Ğ: "G", ı: "i", İ: "I", ö: "o", Ö: "O", ş: "s", Ş: "S", ü: "u", Ü: "U",
  };
  return str.replace(/[çÇğĞıİöÖşŞüÜ]/g, c => map[c] || c)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
