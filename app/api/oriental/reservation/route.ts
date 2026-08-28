import { NextRequest, NextResponse } from "next/server";
import { createOrientalReservation } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const full_name = String(fd.get("full_name") || "").trim();
    const hotel = String(fd.get("hotel") || "").trim() || null;
    const phone = String(fd.get("phone") || "").trim() || null;
    const email = String(fd.get("email") || "").trim() || null;
    const event_date = String(fd.get("event_date") || "").trim();
    const event_time = String(fd.get("event_time") || "").trim() || null;
    const custom_time = String(fd.get("custom_time") || "").trim() || null;
    const notes = String(fd.get("notes") || "").trim() || null;
    const show_name = String(fd.get("show_name") || "Oryantal").trim();

    if (!full_name || !event_date || !event_time) {
      return NextResponse.json({ ok: false, error: "Eksik bilgi" }, { status: 400 });
    }
    if (event_time === "custom" && !custom_time) {
      return NextResponse.json({ ok: false, error: "Özel saat belirtiniz" }, { status: 400 });
    }

    createOrientalReservation({
      full_name,
      email,
      phone,
      hotel,
      show_name,
      event_date,
      event_time: event_time === "custom" ? "custom" : event_time,
      custom_time: event_time === "custom" ? custom_time : null,
      notes,
    });

    const redirectBack = new URL("/show/oryantal?status=success", req.nextUrl.origin);
    redirectBack.hash = "randevu-al";
    const accept = req.headers.get("accept") || "";
    if (accept.includes("application/json")) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.redirect(redirectBack, 303);
  } catch (e) {
    console.error(e);
    const accept = req.headers.get("accept") || "";
    if (accept.includes("application/json")) {
      return NextResponse.json({ ok: false, error: "Sunucu hatası" }, { status: 500 });
    }
    const redirectBack = new URL("/show/oryantal?status=error", req.nextUrl.origin);
    redirectBack.hash = "randevu-al";
    return NextResponse.redirect(redirectBack, 303);
  }
}
