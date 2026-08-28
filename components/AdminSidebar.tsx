"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Drama,
  Briefcase,
  MessageSquare,
  Settings,
  LogOut,
  Star,
  Menu,
  X,
  CalendarClock,
} from "lucide-react";

interface Props {
  counts: { career: number; contact: number; oriental?: number };
  username: string;
  siteLogo?: string;
}

export default function AdminSidebar({ counts, username, siteLogo = "" }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = [
    { href: "/admin/dashboard", label: "Panel", Icon: LayoutDashboard, badge: 0 },
    { href: "/admin/shows", label: "Show Yönetimi", Icon: Drama, badge: 0 },
    { href: "/admin/oriental-reservations", label: "Oryantal Randevular", Icon: CalendarClock, badge: counts.oriental || 0 },
    { href: "/admin/applications", label: "Kariyer Başvuruları", Icon: Briefcase, badge: counts.career },
    { href: "/admin/messages", label: "İletişim Mesajları", Icon: MessageSquare, badge: counts.contact },
    { href: "/admin/settings", label: "Site Ayarları", Icon: Settings, badge: 0 },
  ];

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") return pathname === "/admin" || pathname === "/admin/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* topbar for mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-slate-200 shadow bg-white flex items-center justify-center">
            <img src={siteLogo || "/megastar-logo.svg"} alt="Megastar" className="w-full h-full object-contain" />
          </div>
          <span className="font-display font-bold text-slate-900">Megastar Yönetim</span>
        </Link>
        <button onClick={() => setOpen(!open)} className="p-2 text-slate-700" aria-label="Menü">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="h-16 border-b border-white/10 flex items-center gap-3 px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white border-2 border-slate-700 shadow-lg flex items-center justify-center">
              <img src={siteLogo || "/megastar-logo.svg"} alt="Megastar" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="font-display font-bold text-base leading-tight">Megastar</div>
              <div className="text-[10px] text-white/50 tracking-widest uppercase">Yönetim Paneli</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {items.map(({ href, label, Icon, badge }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                isActive(href)
                  ? "bg-gradient-to-r from-yellow-400/20 to-yellow-600/10 text-yellow-400 border border-yellow-500/30"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="flex-1">{label}</span>
              {badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="px-3 py-2 bg-white/5 rounded-lg">
            <div className="text-[10px] text-white/50 uppercase tracking-wider">Oturum</div>
            <div className="text-sm font-semibold truncate">@{username}</div>
          </div>
          <form action="/api/admin/logout" method="POST">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-400 transition">
              <LogOut className="w-5 h-5" />
              <span>Güvenli Çıkış</span>
            </button>
          </form>
          <Link href="/" className="block text-center text-xs text-white/40 hover:text-white/60 transition" target="_blank">
            Siteyi Görüntüle →
          </Link>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
