import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { setSetting, getAllSettings } from "@/lib/db";
import { saveUploadedFile } from "@/lib/upload";

export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.redirect(new URL("/admin", req.nextUrl.origin), 303);
  const fd = await req.formData();
  const keys = [
    "whatsapp_number", "site_title", "meta_description", "meta_keywords",
    "address", "phone", "email", "facebook_url", "instagram_url", "youtube_url",
    "hero_title", "hero_subtitle", "hero_image", "hero_video_url", "about_text", "site_logo",
  ];
  for (const k of keys) {
    if (fd.has(k)) setSetting(k, String(fd.get(k) || "").trim());
  }

  // Dosya yükleme - logo
  const logoFile = await saveUploadedFile(fd, "site_logo_upload", { allowImage: true, allowVideo: false });
  if (logoFile) setSetting("site_logo", logoFile);

  // Dosya yükleme - hero görsel
  const heroImgFile = await saveUploadedFile(fd, "hero_image_upload", { allowImage: true, allowVideo: false });
  if (heroImgFile) setSetting("hero_image", heroImgFile);

  // Dosya yükleme - hero video
  const heroVideoFile = await saveUploadedFile(fd, "hero_video_upload", { allowImage: false, allowVideo: true });
  if (heroVideoFile) setSetting("hero_video_url", heroVideoFile);

  return NextResponse.redirect(new URL("/admin/settings?ok=1", req.nextUrl.origin), 303);
}
