import type { MetadataRoute } from "next";
import { getAllShows } from "@/lib/shows";
import { getSetting } from "@/lib/db";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://megastarorganizasyon.com";
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/hakkimizda`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/showlar`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/referanslarimiz`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/kariyer`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/iletisim`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ];
  const shows = getAllShows().map(s => ({
    url: `${base}/show/${s.slug}`,
    lastModified: new Date(s.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [...staticPages, ...shows];
}
