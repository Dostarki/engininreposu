import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createReference, updateReference, deleteReference } from "@/lib/db";
import { saveUploadedFile } from "@/lib/upload";

function num(n: FormDataEntryValue | null, def = 0): number {
  const x = Number(n);
  return Number.isFinite(x) ? x : def;
}

export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.redirect(new URL("/admin", req.nextUrl.origin), 303);
  const fd = await req.formData();
  const method = String(fd.get("_method") || "POST").toUpperCase();

  if (method === "PUT") {
    const id = num(fd.get("id"));
    if (id) {
      let logo = String(fd.get("logo") || "").trim();
      const logoFile = await saveUploadedFile(fd, "logo_upload", { allowImage: true, allowVideo: false });
      if (logoFile) logo = logoFile;
      updateReference(id, {
        name: String(fd.get("name") || "").trim(),
        logo,
        website: String(fd.get("website") || "").trim() || null,
        category: String(fd.get("category") || "").trim() || null,
        sort_order: num(fd.get("sort_order")),
        featured: fd.get("featured") ? 1 : 0,
      });
    }
    return NextResponse.redirect(new URL("/admin/settings?tab=references&ok=1", req.nextUrl.origin), 303);
  }

  if (method === "DELETE") {
    const id = num(fd.get("id"));
    if (id) deleteReference(id);
    return NextResponse.redirect(new URL("/admin/settings?tab=references&ok=1", req.nextUrl.origin), 303);
  }

  let logo = String(fd.get("logo") || "").trim();
  const logoFile = await saveUploadedFile(fd, "logo_upload", { allowImage: true, allowVideo: false });
  if (logoFile) logo = logoFile;

  createReference({
    name: String(fd.get("name") || "").trim(),
    logo,
    website: String(fd.get("website") || "").trim() || null,
    category: String(fd.get("category") || "").trim() || null,
    sort_order: num(fd.get("sort_order")),
    featured: fd.get("featured") ? 1 : 0,
  });
  return NextResponse.redirect(new URL("/admin/settings?tab=references&ok=1", req.nextUrl.origin), 303);
}
