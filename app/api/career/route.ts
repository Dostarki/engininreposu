import { NextRequest, NextResponse } from "next/server";
import { createCareerApplication } from "@/lib/forms";

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const data = {
      full_name: String(fd.get("full_name") || "").trim(),
      email: String(fd.get("email") || "").trim() || null,
      phone: String(fd.get("phone") || "").trim() || null,
      position: String(fd.get("position") || "").trim() || null,
      message: String(fd.get("message") || "").trim() || null,
    };
    if (!data.full_name || !data.position) {
      return NextResponse.redirect(new URL("/kariyer?status=error", req.nextUrl.origin), 303);
    }
    createCareerApplication(data);
    return NextResponse.redirect(new URL("/kariyer?status=success", req.nextUrl.origin), 303);
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(new URL("/kariyer?status=error", new URL(req.url).origin), 303);
  }
}
