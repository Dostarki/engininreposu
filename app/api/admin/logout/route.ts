import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { destroySession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  destroySession();
  cookies().delete("admin_session");
  return NextResponse.redirect(new URL("/admin", req.nextUrl.origin), 303);
}
