import { NextResponse } from "next/server";
import { getApprovedOrientalSlots } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const slots = getApprovedOrientalSlots();
    return NextResponse.json({ ok: true, slots });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, slots: [] }, { status: 500 });
  }
}
