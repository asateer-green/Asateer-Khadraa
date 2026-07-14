// src/features/dashboard/signage-manager/SignageManager.tsx
import { useState } from "react";
import { useSignage, useCreateSignage, useUpdateSignage, useDeleteSignage } from "../../../hooks/api/useSignage";
import { useLanguage } from "../../../hooks/ui/useLanguage";
import type { SignageItem } from "../../../types/api.types";

const EMPTY = { title_ar: "", title_en: "", location: "", image_url: "", is_active: true };

function SignageModal({ initial, language, onClose, onSave, isSaving }: {
  initial?: SignageItem; language: string; onClose: () => void;
  onSave: (d: typeof EMPTY) => void; isSaving: boolean;
}) {
  const ar = language === "ar";
  const [form, setForm] = useState(initial
    ? { title_ar: initial.title_ar, title_en: initial.title_en, location: initial.location ?? "", image_url: initial.image_url ?? "", is_active: initial.is_active }
    : EMPTY
  );
  const set = (k: keyof typeof EMPTY, v: string | boolean) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg rounded-2xl bg-(--card) border border-(--border) shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--border) shrink-0">
          <h2 className="text-base font-semibold text-(--foreground)">
            {initial ? (ar ? "تعديل اللوحة" : "Edit Signage") : (ar ? "إضافة لوحة" : "Add Signage")}
          </h2>
          <button onClick={onClose} aria-label="إغلاق" className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:bg-(--muted) transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="overflow-y-auto flex-1">
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-(--foreground)">{ar ? "الاسم بالعربي" : "Name (AR)"} *</label>
                <input value={form.title_ar} onChange={e => set("title_ar", e.target.value)} required dir="rtl" title="Arabic name" placeholder="اسم اللوحة" className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"/>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-(--foreground)">{ar ? "الاسم بالإنجليزي" : "Name (EN)"} *</label>
                <input value={form.title_en} onChange={e => set("title_en", e.target.value)} required dir="ltr" title="English name" placeholder="Signage name" className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"/>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-(--foreground)">{ar ? "الموقع / المكان" : "Location"}</label>
              <input value={form.location} onChange={e => set("location", e.target.value)} title="Location" placeholder={ar ? "مثال: الرياض، حي العليا" : "e.g. Riyadh, Al-Olaya"} className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"/>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-(--foreground)">{ar ? "رابط الصورة" : "Image URL"}</label>
              <input value={form.image_url} onChange={e => set("image_url", e.target.value)} type="url" title="Image URL" placeholder="https://..." className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"/>
              {form.image_url && <img src={form.image_url} alt="preview" className="mt-2 h-36 w-full object-cover rounded-xl border border-(--border)" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}/>}
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-(--muted)/50 border border-(--border)">
              <span className="text-sm font-medium text-(--foreground)">{ar ? "نشطة" : "Active"}</span>
              <button type="button" role="switch" aria-checked={form.is_active ? "true" : "false"} aria-label={ar ? "تفعيل" : "Toggle active"} onClick={() => set("is_active", !form.is_active)} className={`w-10 h-6 rounded-full transition-colors relative ${form.is_active ? "bg-(--primary)" : "bg-(--muted)"}`}>
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${form.is_active ? "inset-s-5" : "inset-s-1"}`}/>
              </button>
            </div>
          </div>
          <div className="px-6 pb-6 flex gap-3 justify-end border-t border-(--border) pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-(--muted-foreground) hover:bg-(--muted) transition-colors">{ar ? "إلغاء" : "Cancel"}</button>
            <button type="submit" disabled={isSaving} className="px-5 py-2 rounded-xl text-sm font-medium bg-(--primary) text-(--primary-foreground) hover:opacity-90 disabled:opacity-50">
              {isSaving ? "..." : initial ? (ar ? "حفظ" : "Save") : (ar ? "إضافة" : "Add")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const SignageManager = () => {
  const { language } = useLanguage();
  const ar = language === "ar";
  const { data: items = [], isLoading } = useSignage();
  const { mutate: create, isPending: isCreating } = useCreateSignage();
  const { mutate: update, isPending: isUpdating } = useUpdateSignage();
  const { mutate: remove, isPending: isDeleting } = useDeleteSignage();
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<SignageItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = (data: typeof EMPTY) => {
    if (editItem) {
      update({ id: editItem.id, ...data }, { onSuccess: () => setEditItem(null) });
    } else {
      create(data, { onSuccess: () => setShowAdd(false) });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-(--foreground)">{ar ? "إدارة اللوحات" : "Signage Manager"}</h1>
          <p className="text-sm text-(--muted-foreground) mt-0.5">{ar ? `${items.length} لوحة` : `${items.length} items`}</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-(--primary) text-(--primary-foreground) hover:opacity-90 transition-opacity">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {ar ? "إضافة لوحة" : "Add Signage"}
        </button>
      </div>

      <div className="rounded-2xl bg-(--card) border border-(--border) overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 rounded-xl bg-(--muted) animate-pulse"/>)}</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm text-(--muted-foreground)">{ar ? "لا توجد لوحات بعد" : "No signage yet"}</p>
            <button onClick={() => setShowAdd(true)} className="text-sm text-(--primary) hover:underline">{ar ? "أضف أول لوحة" : "Add your first signage"}</button>
          </div>
        ) : (
          <div className="divide-y divide-(--border)">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-(--muted)/30 transition-colors group">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title_ar} className="w-14 h-14 rounded-xl object-cover border border-(--border) shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}/>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-(--muted) flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-(--muted-foreground)"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-(--foreground) truncate">{ar ? item.title_ar : item.title_en}</p>
                  {item.location && <p className="text-xs text-(--muted-foreground) truncate">📍 {item.location}</p>}
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${item.is_active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-(--muted) text-(--muted-foreground)"}`}>
                  {item.is_active ? (ar ? "نشطة" : "Active") : (ar ? "مخفية" : "Hidden")}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditItem(item)} aria-label="edit" className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:bg-(--muted) hover:text-(--foreground) transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={() => setDeleteId(item.id)} aria-label="delete" className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && setDeleteId(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-(--card) border border-(--border) p-6 space-y-4">
            <p className="text-center font-semibold text-(--foreground)">{ar ? "هل تريد حذف هذه اللوحة؟" : "Delete this signage item?"}</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 rounded-xl text-sm text-(--muted-foreground) hover:bg-(--muted)">{ar ? "إلغاء" : "Cancel"}</button>
              <button onClick={() => remove(deleteId, { onSuccess: () => setDeleteId(null) })} disabled={isDeleting} className="flex-1 py-2 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50">{isDeleting ? "..." : ar ? "حذف" : "Delete"}</button>
            </div>
          </div>
        </div>
      )}

      {(showAdd || editItem) && (
        <SignageModal
          initial={editItem ?? undefined}
          language={language}
          onClose={() => { setShowAdd(false); setEditItem(null); }}
          onSave={handleSave}
          isSaving={isCreating || isUpdating}
        />
      )}
    </div>
  );
};

export default SignageManager;