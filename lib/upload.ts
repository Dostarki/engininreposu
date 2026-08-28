import fs from "fs";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
const VIDEO_EXTS = [".mp4", ".webm", ".mov"];
const ALL_EXTS = [...IMAGE_EXTS, ...VIDEO_EXTS];

const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20 MB
const MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200 MB

function getExt(filename: string): string {
  return path.extname(filename).toLowerCase();
}

function safeName(filename: string): string {
  const ext = getExt(filename);
  const ts = Date.now().toString(36);
  const rand = crypto.randomBytes(4).toString("hex");
  return `${ts}-${rand}${ext}`;
}

export function isImageExt(filename: string): boolean {
  return IMAGE_EXTS.includes(getExt(filename));
}

export function isVideoExt(filename: string): boolean {
  return VIDEO_EXTS.includes(getExt(filename));
}

export function isAllowedExt(filename: string): boolean {
  return ALL_EXTS.includes(getExt(filename));
}

export async function saveUploadedFile(
  fd: FormData,
  fieldName: string,
  opts: { allowImage?: boolean; allowVideo?: boolean } = {}
): Promise<string | null> {
  const allowImage = opts.allowImage !== false;
  const allowVideo = opts.allowVideo !== undefined ? opts.allowVideo : true;
  const file = fd.get(fieldName);
  if (!file || !(file instanceof File) || file.size === 0) return null;
  if (!file.name) return null;

  const ext = getExt(file.name);
  const isImg = isImageExt(file.name);
  const isVid = isVideoExt(file.name);

  if (!isImg && !isVid) return null;
  if (isImg && !allowImage) return null;
  if (isVid && !allowVideo) return null;

  const maxSize = isImg ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
  if (file.size > maxSize) return null;

  const name = safeName(file.name);
  const dest = path.join(UPLOAD_DIR, name);
  const buf = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return `/uploads/${name}`;
}
