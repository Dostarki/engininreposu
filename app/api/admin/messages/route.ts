import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { markCareerRead, deleteCareerApplication, markContactRead, deleteContactMessage } from "@/lib/forms";

export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const j = await req.json().catch(() => ({}));
  const { action, type, id } = j;
  const iid = parseInt(String(id || "0"), 10);
  if (!iid) return NextResponse.json({ ok: false }, { status: 400 });
  if (type === "career") {
    if (action === "read") markCareerRead(iid);
    else if (action === "delete") deleteCareerApplication(iid);
  } else if (type === "contact") {
    if (action === "read") markContactRead(iid);
    else if (action === "delete") deleteContactMessage(iid);
  } else {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
