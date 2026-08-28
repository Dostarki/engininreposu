import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import RevealObserver from "@/components/RevealObserver";
import { getSetting, getAllSettings } from "@/lib/db";

const defaultTitle = "Megastar Organizasyon | Antalya Profesyonel Organizasyon Şirketi";
const defaultDesc =
  "Megastar Organizasyon - Antalya merkezli profesyonel organizasyon şirketi. Show grupları, dans gösterileri, çocuk etkinlikleri, otel eğlenceleri ve özel günler için yaratıcı çözümler.";

export function generateMetadata(): Metadata {
  const title = getSetting("site_title", defaultTitle);
  const desc = getSetting("meta_description", defaultDesc);
  const kw = getSetting("meta_keywords", "Antalya organizasyon, Megastar Organizasyon, show grupları, dans gösterisi, çocuk etkinliği, otel eğlencesi, profesyonel organizasyon, Antalya");
  return {
    title,
    description: desc,
    keywords: kw.split(",").map(k => k.trim()),
    authors: [{ name: "Megastar Organizasyon" }],
    metadataBase: new URL("https://megastarorganizasyon.com"),
    openGraph: {
      type: "website",
      title,
      description: desc,
      siteName: "Megastar Organizasyon",
      locale: "tr_TR",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
    },
    alternates: { canonical: "/" },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const s = getAllSettings();
  const wa = s.whatsapp_number || "";
  const siteLogo = s.site_logo || "/megastar-logo.svg";
  const phone = s.phone || "";
  return (
    <html lang="tr">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="min-h-screen">
        <div className="navbar-wrapper">
          <Navbar siteLogo={siteLogo} phone={phone} />
        </div>
        <main>{children}</main>
        <div className="footer-wrapper">
          <Footer siteLogo={siteLogo} phone={phone} />
        </div>
        <div className="whatsapp-btn-wrapper">
          <WhatsAppButton number={wa} />
        </div>
        <RevealObserver />
      </body>
    </html>
  );
}
