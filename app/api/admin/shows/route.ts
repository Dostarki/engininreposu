import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { createShow, slugify, updateShow, deleteShow } from "@/lib/shows";
import { saveUploadedFile } from "@/lib/upload";

export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.redirect(new URL("/admin", req.nextUrl.origin), 303);
  const fd = await req.formData();
  const _method = String(fd.get("_method") || "").toUpperCase();
  if (_method === "PUT") return PUT(req, fd);
  const name = String(fd.get("name") || "").trim();
  if (!name) return NextResponse.redirect(new URL("/admin/shows/new?err=1", req.nextUrl.origin), 303);
  const slugBase = String(fd.get("slug") || "").trim() || name;
  let slug = slugify(slugBase);
  let idx = 1;
  const { getAllShows } = await import("@/lib/shows");
  const all = getAllShows();
  while (all.some(s => s.slug === slug)) { slug = `${slugify(slugBase)}-${idx++}`; }

  let image = String(fd.get("image") || "").trim() || null;
  let video_url = String(fd.get("video_url") || "").trim() || null;

  const imgFile = await saveUploadedFile(fd, "image_upload", { allowImage: true, allowVideo: false });
  if (imgFile) image = imgFile;

  const vidFile = await saveUploadedFile(fd, "video_upload", { allowImage: false, allowVideo: true });
  if (vidFile) video_url = vidFile;

  createShow({
    name,
    slug,
    short_description: String(fd.get("short_description") || "").trim() || null,
    description: String(fd.get("description") || "").trim() || null,
    image,
    gallery: "[]",
    video_url,
    duration: String(fd.get("duration") || "").trim() || null,
    team_count: String(fd.get("team_count") || "").trim() || null,
    category: String(fd.get("category") || "").trim() || null,
    featured: fd.get("featured") ? 1 : 0,
    sort_order: parseInt(String(fd.get("sort_order") || "0"), 10) || 0,
  });
  return NextResponse.redirect(new URL("/admin/shows?ok=created", req.nextUrl.origin), 303);
}

async function PUT(req: NextRequest, _fd?: FormData) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const fd = _fd || (await req.formData());
  const id = parseInt(String(fd.get("id") || "0"), 10);
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  const name = String(fd.get("name") || "").trim();
  if (!name) return NextResponse.redirect(new URL(`/admin/shows/${id}?err=1`, req.nextUrl.origin), 303);
  const slug = slugify(String(fd.get("slug") || "").trim() || name);

  let image = String(fd.get("image") || "").trim() || null;
  let video_url = String(fd.get("video_url") || "").trim() || null;

  const imgFile = await saveUploadedFile(fd, "image_upload", { allowImage: true, allowVideo: false });
  if (imgFile) image = imgFile;

  const vidFile = await saveUploadedFile(fd, "video_upload", { allowImage: false, allowVideo: true });
  if (vidFile) video_url = vidFile;

  updateShow(id, {
    name,
    slug,
    short_description: String(fd.get("short_description") || "").trim() || null,
    description: String(fd.get("description") || "").trim() || null,
    image,
    video_url,
    duration: String(fd.get("duration") || "").trim() || null,
    team_count: String(fd.get("team_count") || "").trim() || null,
    category: String(fd.get("category") || "").trim() || null,
    featured: fd.get("featured") ? 1 : 0,
    sort_order: parseInt(String(fd.get("sort_order") || "0"), 10) || 0,
  });
  return NextResponse.redirect(new URL(`/admin/shows?ok=updated`, req.nextUrl.origin), 303);
}

export async function DELETE(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const j = await req.json().catch(() => ({}));
  const id = parseInt(String(j.id || "0"), 10);
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  deleteShow(id);
  return NextResponse.json({ ok: true });
}
