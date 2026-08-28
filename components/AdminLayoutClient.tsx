"use client";
import { useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";

interface Props {
  children: React.ReactNode;
  initialCounts: { career: number; contact: number; oriental?: number };
  username: string;
  siteLogo?: string;
}

export default function AdminLayoutClient({ children, initialCounts, username, siteLogo = "" }: Props) {
  useEffect(() => {
    document.body.classList.add("is-admin-page");
    return () => {
      document.body.classList.remove("is-admin-page");
    };
  }, []);
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <AdminSidebar counts={initialCounts} username={username} siteLogo={siteLogo} />
      <main className="md:ml-64 pt-16 md:pt-0 pb-10 min-h-screen">
        <div className="px-4 md:px-8 pt-6 md:pt-10 max-w-[1600px] mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}
