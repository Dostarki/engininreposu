import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  getAllOrientalReservations,
  updateOrientalReservation,
  deleteOrientalReservation,
  getOrientalReservationById,
} from "@/lib/db";
import { markOrientalRead } from "@/lib/forms";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const list = getAllOrientalReservations();
  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get("status");
  const filtered = statusFilter
    ? list.filter(r => String(r.status) === String(statusFilter))
    : list;
  return NextResponse.json({ ok: true, list: filtered });
}

export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const j = await req.json().catch(() => ({}));
  const { action, id, status, notes } = j;
  const iid = parseInt(String(id || "0"), 10);
  if (!iid || !getOrientalReservationById(iid)) {
    return NextResponse.json({ ok: false, error: "Rezervasyon bulunamadı" }, { status: 404 });
  }

  if (action === "read") {
    markOrientalRead(iid);
    return NextResponse.json({ ok: true });
  }

  if (action === "delete") {
    deleteOrientalReservation(iid);
    return NextResponse.json({ ok: true });
  }

  if (action === "update") {
    const patch: Record<string, any> = {};
    if (typeof status === "number" && [0, 1, 2, 3].includes(status)) {
      patch.status = status;
      if (status === 3) {
        deleteOrientalReservation(iid);
        return NextResponse.json({ ok: true });
      }
    }
    if (typeof notes === "string") {
      patch.notes = notes;
    }
    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ ok: false, error: "Güncellenecek alan yok" }, { status: 400 });
    }
    updateOrientalReservation(iid, patch);
    return NextResponse.json({ ok: true });
  }

  if (action === "approve") {
    updateOrientalReservation(iid, { status: 1 });
    return NextResponse.json({ ok: true });
  }

  if (action === "reject") {
    updateOrientalReservation(iid, { status: 2 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "Geçersiz aksiyon" }, { status: 400 });
}
