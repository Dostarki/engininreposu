import { NextRequest, NextResponse } from "next/server";
import { createContactMessage } from "@/lib/forms";

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const data = {
      full_name: String(fd.get("full_name") || "").trim(),
      email: String(fd.get("email") || "").trim() || null,
      phone: String(fd.get("phone") || "").trim() || null,
      subject: String(fd.get("subject") || "").trim() || null,
      message: String(fd.get("message") || "").trim() || null,
    };
    if (!data.full_name) {
      return NextResponse.redirect(new URL("/iletisim?status=error", req.nextUrl.origin), 303);
    }
    createContactMessage(data);
    return NextResponse.redirect(new URL("/iletisim?status=success", req.nextUrl.origin), 303);
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(new URL("/iletisim?status=error", new URL(req.url).origin), 303);
  }
}
