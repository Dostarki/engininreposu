import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSession, destroySession, verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const username = String(fd.get("username") || "").trim();
    const password = String(fd.get("password") || "");
    const redirect = String(fd.get("redirect") || "/admin");
    const user = verifyPassword(username, password);
    if (!user) {
      return NextResponse.redirect(new URL("/admin?login=error", req.nextUrl.origin), 303);
    }
    const token = createSession(user);
    cookies().set("admin_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return NextResponse.redirect(new URL(redirect, req.nextUrl.origin), 303);
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(new URL("/admin?login=error", new URL(req.url).origin), 303);
  }
}
