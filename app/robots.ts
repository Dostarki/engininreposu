import type { MetadataRoute } from "next";
import { getSetting } from "@/lib/db";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    ],
    sitemap: "https://megastarorganizasyon.com/sitemap.xml",
  };
}
