// src/features/dashboard/signage-manager/SignagePreviewModal.tsx
import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Calendar, User, Layers, MapPin } from "lucide-react";

export interface SignagePreview {
  title: string;
  tag: string; // الموقع (أو نص افتراضي) بيظهر مكان "التصنيف" في معرض الأعمال
  description: string;
  client: string;
  year: string;
  scope: string[];
  gallery: string[];
}

export function SignagePreviewModal({ item, ar, onClose }: { item: SignagePreview; ar: boolean; onClose: () => void }) {
  // نفس أسلوب PortfolioPreviewModal: السلايدر state داخلي للمكوّن بدل ما يتسرّب لأعلى SignageManager
  const [currentIdx, setCurrentIdx] = useState(0);
  const hasMultiple = item.gallery.length > 1;

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx(i => (i === 0 ? item.gallery.length - 1 : i - 1));
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx(i => (i === item.gallery.length - 1 ? 0 : i + 1));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-zinc-950/85 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div
        className="relative w-full max-w-5xl bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 grid grid-cols-1 md:grid-cols-12 max-h-[90vh] md:max-h-[85vh]"
        onClick={e => e.stopPropagation()}
        dir={ar ? "rtl" : "ltr"}
      >
        <button
          type="button"
          onClick={onClose}
          title={ar ? "إغلاق" : "Close"}
          aria-label={ar ? "إغلاق" : "Close"}
          className={`absolute top-4 z-30 p-2 rounded-full bg-zinc-950/50 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer ${ar ? "left-4" : "right-4"}`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* يمين/يسار: سلايدر الصور + الصور المصغّرة */}
        <div className="md:col-span-7 bg-zinc-950 flex flex-col justify-between relative p-4 group/slider">
          <div className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-900">
            <img
              src={item.gallery[currentIdx] ?? item.gallery[0]}
              alt={item.title}
              className="max-w-full max-h-full object-contain transition-all duration-500"
            />

            {hasMultiple && (
              <>
                <button type="button" onClick={prev} title={ar ? "السابقة" : "Previous image"} className="absolute left-4 p-2.5 rounded-full bg-zinc-900/80 hover:bg-emerald-500 text-white border border-zinc-800/50 transition-all shadow-md transform -translate-y-1/2 top-1/2 opacity-0 group-hover/slider:opacity-100 cursor-pointer">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button type="button" onClick={next} title={ar ? "التالية" : "Next image"} className="absolute right-4 p-2.5 rounded-full bg-zinc-900/80 hover:bg-emerald-500 text-white border border-zinc-800/50 transition-all shadow-md transform -translate-y-1/2 top-1/2 opacity-0 group-hover/slider:opacity-100 cursor-pointer">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {item.gallery.length > 0 && (
            <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1 justify-center max-w-full scrollbar-thin scrollbar-thumb-zinc-800">
              {item.gallery.map((img, idx) => (
                <button
                  key={img + idx}
                  onClick={() => setCurrentIdx(idx)}
                  aria-label={ar ? `صورة ${idx + 1}` : `Image ${idx + 1}`}
                  className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    currentIdx === idx ? "border-emerald-500 scale-105 shadow-md ring-2 ring-emerald-500/20" : "border-transparent opacity-50 hover:opacity-100 hover:border-zinc-700"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* لوحة التفاصيل */}
        <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[40vh] md:max-h-full border-t md:border-t-0 md:border-s border-zinc-800 bg-zinc-900/60">
          <div className="text-start">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">
              <MapPin className="w-3.5 h-3.5" />
              {item.tag}
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mb-4 leading-snug">{item.title}</h2>
            <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-normal mb-6 border-b border-zinc-800/60 pb-6">{item.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6 border-b border-zinc-800/60 pb-6">
              <div>
                <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-bold uppercase tracking-wider mb-1">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{ar ? "العميل" : "Client"}</span>
                </div>
                <p className="text-sm font-bold text-zinc-200">{item.client || "—"}</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-bold uppercase tracking-wider mb-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{ar ? "السنة" : "Year"}</span>
                </div>
                <p className="text-sm font-bold text-zinc-200">{item.year || "—"}</p>
              </div>
            </div>

            {item.scope.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-bold uppercase tracking-wider mb-3">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{ar ? "نطاق العمل" : "SCOPE OF WORK"}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.scope.map((tag, index) => (
                    <span key={index} className="px-3 py-1.5 text-xs font-medium rounded-full bg-zinc-950 text-zinc-300 border border-zinc-800/80 hover:border-emerald-500/30 transition-colors">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}