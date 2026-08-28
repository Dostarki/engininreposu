import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getSetting } from "@/lib/db";
import Link from "next/link";
import { Star, Lock, User, ArrowRight, AlertCircle } from "lucide-react";

export default function AdminLoginPage({ searchParams }: { searchParams: { login?: string } }) {
  const u = getSessionUser();
  if (u) redirect("/admin/dashboard");
  const error = searchParams.login === "error";
  const siteLogo = getSetting("site_logo") || "/megastar-logo.svg";
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_50%,_#fbbf24_0%,_transparent_50%),radial-gradient(circle_at_80%_50%,_#f59e0b_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-white border-4 border-white/10 flex items-center justify-center shadow-2xl shadow-amber-500/10 overflow-hidden">
              <img src={siteLogo} alt="Megastar Organizasyon" className="w-full h-full object-contain p-1" />
            </div>
          </Link>
          <h1 className="font-display text-4xl font-bold mb-2">Megastar</h1>
          <p className="text-white/50 text-sm tracking-[0.3em] uppercase">Yönetici Girişi</p>
        </div>
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold mb-0.5">Giriş Başarısız</div>
                <div className="text-red-300/70 text-xs">Kullanıcı adı veya şifre hatalı. Lütfen tekrar deneyin.</div>
              </div>
            </div>
          )}
          <form action="/api/admin/login" method="POST" className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Kullanıcı Adı</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  required
                  name="username"
                  placeholder="hamdullaherdem"
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-900/60 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  required
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-900/60 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-slate-900 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:scale-[1.01] transition"
            >
              Giriş Yap
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <Link href="/" className="text-xs text-white/40 hover:text-white/60 transition">
              ← Siteye Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
