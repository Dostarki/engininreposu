"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

export default function FormToast({ status }: { status?: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!status) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 6000);
    return () => clearTimeout(t);
  }, [status]);
  if (!status || !visible) return null;
  const ok = status === "success";
  return (
    <div className="fixed top-24 right-4 z-[100] max-w-sm w-full animate-in slide-in-from-right">
      <div className={`flex items-start gap-3 p-4 rounded-lg shadow-2xl border backdrop-blur ${ok ? "bg-emerald-50/95 border-emerald-300 text-emerald-900" : "bg-red-50/95 border-red-300 text-red-900"}`}>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${ok ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
          {ok ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <div className="font-semibold">{ok ? "Mesajınız Gönderildi!" : "Hata Oluştu"}</div>
          <div className="text-sm opacity-80 mt-0.5">
            {ok ? "En kısa sürede sizinle iletişime geçeceğiz. Teşekkürler!" : "Form gönderilirken bir sorun oluştu. Lütfen tekrar deneyin veya bizimle iletişime geçin."}
          </div>
        </div>
        <button onClick={() => setVisible(false)} className="opacity-60 hover:opacity-100 p-1">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
