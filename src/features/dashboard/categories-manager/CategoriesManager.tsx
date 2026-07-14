// src/features/dashboard/categories-manager/CategoriesManager.tsx
import { useState } from "react";
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from "../../../hooks/api/useCategories";
import { useLanguage } from "../../../hooks/ui/useLanguage";
import type { Category } from "../../../types/api.types";

const EMPTY = { name_ar: "", name_en: "", image_url: "" };

const CategoriesManager = () => {
  const { language } = useLanguage();
  const ar = language === "ar";

  const { data: cats = [], isLoading } = useCategories();
  const { mutate: create, isPending: isCreating } = useCreateCategory();
  const { mutate: update, isPending: isUpdating } = useUpdateCategory();
  const { mutate: remove, isPending: isDeleting } = useDeleteCategory();

  const [form,     setForm]     = useState(EMPTY);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showAdd,  setShowAdd]  = useState(false);

  const resetForm = () => { setForm(EMPTY); setEditItem(null); setShowAdd(false); };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name_ar.trim() || !form.name_en.trim()) return;
    if (editItem) {
      update({ id: editItem.id, ...form }, { onSuccess: resetForm });
    } else {
      create(form, { onSuccess: resetForm });
    }
  };

  const startEdit = (cat: Category) => {
    setForm({ name_ar: cat.name_ar, name_en: cat.name_en, image_url: cat.image_url ?? "" });
    setEditItem(cat);
    setShowAdd(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-(--foreground)">{ar ? "إدارة التصنيفات" : "Categories Manager"}</h1>
          <p className="text-sm text-(--muted-foreground) mt-0.5">{ar ? `${cats.length} تصنيف` : `${cats.length} categories`}</p>
        </div>
        <button
          onClick={() => { setForm(EMPTY); setEditItem(null); setShowAdd(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-(--primary) text-(--primary-foreground) hover:opacity-90 transition-opacity"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {ar ? "إضافة تصنيف" : "Add Category"}
        </button>
      </div>

      {/* Inline Add/Edit Form */}
      {showAdd && (
        <div className="rounded-2xl bg-(--card) border border-(--primary)/30 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-(--foreground)">
            {editItem ? (ar ? "تعديل التصنيف" : "Edit Category") : (ar ? "تصنيف جديد" : "New Category")}
          </h2>
          <form onSubmit={handleSave} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-(--foreground)">{ar ? "الاسم بالعربي" : "Name (Arabic)"} *</label>
                <input
                  value={form.name_ar}
                  onChange={e => setForm(f => ({ ...f, name_ar: e.target.value }))}
                  required dir="rtl"
                  title={ar ? "الاسم بالعربي" : "Arabic name"}
                  placeholder="مثال: طباعة"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-(--foreground)">{ar ? "الاسم بالإنجليزي" : "Name (English)"} *</label>
                <input
                  value={form.name_en}
                  onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))}
                  required dir="ltr"
                  title={ar ? "الاسم بالإنجليزي" : "English name"}
                  placeholder="e.g. Printing"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-(--foreground)">{ar ? "رابط الصورة" : "Image URL"}</label>
              <input
                value={form.image_url}
                onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                type="url"
                title={ar ? "رابط الصورة" : "Image URL"}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
              />
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt="preview"
                  className="mt-2 h-24 w-full object-cover rounded-xl border border-(--border)"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={resetForm} className="px-4 py-2 rounded-xl text-sm text-(--muted-foreground) hover:bg-(--muted) transition-colors">
                {ar ? "إلغاء" : "Cancel"}
              </button>
              <button type="submit" disabled={isCreating || isUpdating} className="px-5 py-2 rounded-xl text-sm font-medium bg-(--primary) text-(--primary-foreground) hover:opacity-90 disabled:opacity-50 transition-opacity">
                {(isCreating || isUpdating) ? "..." : editItem ? (ar ? "حفظ" : "Save") : (ar ? "إضافة" : "Add")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories list */}
      <div className="rounded-2xl bg-(--card) border border-(--border) overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 rounded-xl bg-(--muted) animate-pulse"/>)}
          </div>
        ) : cats.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-(--muted-foreground)">{ar ? "لا توجد تصنيفات بعد" : "No categories yet"}</p>
          </div>
        ) : (
          <div className="divide-y divide-(--border)">
            {cats.map(cat => (
              <div key={cat.id} className="flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-3.5 hover:bg-(--muted)/30 transition-colors group">
                {/* Image / Icon */}
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name_ar}
                    className="w-8 h-8 rounded-lg object-cover border border-(--border) shrink-0"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-(--primary)/10 flex items-center justify-center shrink-0">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-(--primary)">
                      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                      <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
                      <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
                    </svg>
                  </div>
                )}

                {/* Names: stacked on mobile, side by side on larger screens */}
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-3">
                  <span className="font-medium text-(--foreground) truncate">{cat.name_ar}</span>
                  <span className="hidden sm:inline text-(--muted-foreground) text-sm">·</span>
                  <span className="text-xs sm:text-sm text-(--muted-foreground) truncate">{cat.name_en}</span>
                </div>

                {/* Actions: always visible on mobile, hover-reveal on desktop */}
                <div className="flex gap-1 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(cat)}
                    aria-label={ar ? "تعديل" : "Edit"}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:bg-(--muted) hover:text-(--foreground) transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteId(cat.id)}
                    aria-label={ar ? "حذف" : "Delete"}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                    </svg>
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
          <div className="w-full max-w-sm rounded-2xl bg-(--card) border border-(--border) p-6 space-y-4 shadow-xl">
            <p className="text-center font-semibold text-(--foreground)">
              {ar ? "هل تريد حذف هذا التصنيف؟" : "Delete this category?"}
            </p>
            <p className="text-center text-xs text-(--muted-foreground)">
              {ar ? "الأعمال المرتبطة به لن تُحذف" : "Portfolio items linked to it won't be deleted"}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 rounded-xl text-sm text-(--muted-foreground) hover:bg-(--muted) transition-colors">
                {ar ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={() => remove(deleteId, { onSuccess: () => setDeleteId(null) })}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? "..." : ar ? "حذف" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManager;