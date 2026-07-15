// src/features/dashboard/portfolio-manager/PortfolioManager.tsx
//
// ملاحظة: تمت إضافة حقول (description_ar, description_en, client, year, scope_ar, scope_en)
// لأن نافذة المعاينة وصفحة الموقع كانتا تعرضانها بالفعل لكن نموذج الإضافة/التعديل لم يكن
// يسمح بإدخالها. تأكد من إضافة هذه الحقول إلى PortfolioItem في types/api.types.ts وإلى
// الـ API/الجدول في الباك إند حتى يتم حفظها فعلياً.
//
// Note: (description_ar, description_en, client, year, scope_ar, scope_en) were added because
// the preview modal and the public site were already displaying them, but the Add/Edit form
// never collected them. Make sure PortfolioItem in types/api.types.ts and the backend
// table/API are updated to persist these fields.

import { useState } from "react";
import {
  usePortfolio,
  useCreatePortfolio,
  useUpdatePortfolio,
  useDeletePortfolio,
} from "../../../hooks/api/usePortfolio";
import { useLanguage } from "../../../hooks/ui/useLanguage";
import type { PortfolioItem } from "../../../types/api.types";

// استيراد الأيقونات المطلوبة للنافذة الفاخرة وسلايدر الصور والحقول التفاعلية
import {
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Layers,
  Plus,
  Trash2,
} from "lucide-react";

const EMPTY_FORM = {
  title_ar:       "",
  title_en:       "",
  category_id:    "",
  image_url:      "",
  description_ar: "",
  description_en: "",
  client:         "",
  year:           "",
  scope_ar:       "", // مفصولة بفواصل، تتحول إلى مصفوفة عند الحفظ
  scope_en:       "", // comma separated, converted to an array on save
  is_featured:    false,
  gallery:        "",
};

// يحوّل "أ, ب, ج" إلى ["أ","ب","ج"] ويتجاهل الفراغات بشكل آمن
const toTags = (raw: any): string[] => {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    return raw.split(",").map(s => s.trim()).filter(Boolean);
  }
  return [];
};

// ── Portfolio Form Modal ───────────────────────────────────────────────────
function PortfolioModal({
  initial, language, onClose, onSave, isSaving,
}: {
  initial?: PortfolioItem;
  language: string;
  onClose: () => void;
  onSave: (data: typeof EMPTY_FORM) => void;
  isSaving: boolean;
}) {
  const ar = language === "ar";
  const [form, setForm] = useState(
    initial
      ? {
          title_ar:       initial.title_ar,
          title_en:       initial.title_en,
          category_id:    initial.category_id    ?? "",
          image_url:      initial.image_url      ?? "",
          description_ar: (initial as any).description_ar ?? "",
          description_en: (initial as any).description_en ?? "",
          client:         (initial as any).client         ?? "",
          year:           (initial as any).year           ?? "",
          scope_ar: Array.isArray((initial as any).scope_ar)
            ? (initial as any).scope_ar.join(", ")
            : (typeof (initial as any).scope_ar === "string" ? (initial as any).scope_ar : ""),
          scope_en: Array.isArray((initial as any).scope_en)
            ? (initial as any).scope_en.join(", ")
            : (typeof (initial as any).scope_en === "string" ? (initial as any).scope_en : ""),
          is_featured:    initial.is_featured,
          gallery:        (initial as any).gallery        ?? "",
        }
      : EMPTY_FORM
  );

  const set = (key: keyof typeof EMPTY_FORM, value: string | boolean) =>
    setForm(f => ({ ...f, [key]: value }));

  // الـ State المسؤول عن الحقول الديناميكية لمعرض الصور المصغرة (روابط إضافية)
  const [galleryUrls, setGalleryUrls] = useState<string[]>(() => {
    if (initial && (initial as any).gallery) {
      const rawGallery = (initial as any).gallery;
      if (Array.isArray(rawGallery)) return rawGallery;
      return rawGallery.split(",").map((s: string) => s.trim()).filter(Boolean);
    }
    return [""]; // حقل إدخال واحد فارغ مبدئياً عند إضافة مشروع جديد
  });

  // إضافة حقل إدخال رابط صورة جديد إلى المعرض
  const handleAddGalleryField = () => {
    setGalleryUrls([...galleryUrls, ""]);
  };

  // حذف حقل صورة معين من المعرض
  const handleRemoveGalleryField = (index: number) => {
    const updated = galleryUrls.filter((_, idx) => idx !== index);
    setGalleryUrls(updated.length > 0 ? updated : [""]); // إبقاء حقل واحد كحد أدنى بدلاً من تركه فارغاً تماماً
  };

  // تحديث قيمة الرابط في حقل معين بناءً على الـ index
  const handleGalleryUrlChange = (index: number, value: string) => {
    const updated = [...galleryUrls];
    updated[index] = value;
    setGalleryUrls(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title_ar.trim() || !form.title_en.trim()) return;
    
    // تصفية الروابط الفارغة وتحويل مصفوفة المعرض إلى نص مفصول بفاصلة
    const cleanGallery = galleryUrls.filter(url => url.trim() !== "").join(", ");
    
    // نرسل الـ form كاملاً متضمناً الـ gallery المصفى
    onSave({
      ...form,
      gallery: cleanGallery
    });
  };

  const isEdit = !!initial;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-2xl bg-(--card) border border-(--border) shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--border) shrink-0">
          <h2 className="text-base font-semibold text-(--foreground)">
            {isEdit ? (ar ? "تعديل العمل" : "Edit Item") : (ar ? "إضافة عمل جديد" : "Add Portfolio Item")}
          </h2>
          <button type="button" onClick={onClose} aria-label="إغلاق" className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:bg-(--muted) transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="p-6 space-y-4">

            {/* Titles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-(--foreground)">{ar ? "العنوان بالعربي" : "Title (Arabic)"} *</label>
                <input
                  value={form.title_ar}
                  onChange={e => set("title_ar", e.target.value)}
                  required dir="rtl"
                  placeholder="اسم العمل"
                  title={ar ? "العنوان بالعربي" : "Arabic title"}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-(--foreground)">{ar ? "العنوان بالإنجليزي" : "Title (English)"} *</label>
                <input
                  value={form.title_en}
                  onChange={e => set("title_en", e.target.value)}
                  required dir="ltr"
                  placeholder="Project name"
                  title={ar ? "العنوان بالإنجليزي" : "English title"}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-(--foreground)">{ar ? "رابط الصورة الرئيسية" : "Main Image URL"}</label>
              <input
                value={form.image_url}
                onChange={e => set("image_url", e.target.value)}
                type="url"
                placeholder="https://..."
                title={ar ? "رابط الصورة الرئيسية" : "Main Image URL"}
                className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
              />
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt="preview"
                  className="mt-2 h-40 w-full object-cover rounded-xl border border-(--border)"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
            </div>

            {/* ── حقول إدخال معرض الصور المصغرة التفاعلي ── */}
            <div className="space-y-2 border-t border-(--border) pt-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-(--foreground)">
                  {ar ? "صور المعرض الإضافية" : "Additional Gallery Images"}
                </label>
                <button
                  type="button"
                  onClick={handleAddGalleryField}
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors px-2 py-1 rounded-lg hover:bg-emerald-500/10"
                >
                  <Plus className="w-4 h-4" />
                  {ar ? "إضافة رابط صورة" : "Add Image URL"}
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {galleryUrls.map((url, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      value={url}
                      onChange={e => handleGalleryUrlChange(idx, e.target.value)}
                      type="url"
                      placeholder={ar ? `رابط صورة إضافية #${idx + 1}` : `Extra Image URL #${idx + 1}`}
                      title={ar ? `رابط صورة إضافية #${idx + 1}` : `Extra Image URL #${idx + 1}`}
                      className="flex-1 px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryField(idx)}
                      disabled={galleryUrls.length === 1 && url === ""}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30 transition-all shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-(--muted-foreground)">
                {ar 
                  ? "* ستظهر هذه الصور المصغرة أسفل المعاينة لتمكين المستخدمين من التنقل بينها." 
                  : "* These thumbnails will appear at the bottom of the preview modal."}
              </p>
            </div>

            {/* Category */}
            <div className="space-y-1.5 border-t border-(--border) pt-4">
              <label className="text-sm font-medium text-(--foreground)">{ar ? "التصنيف" : "Category"}</label>
              <input
                value={form.category_id}
                onChange={e => set("category_id", e.target.value)}
                placeholder={ar ? "مثال: تصميم هوية" : "e.g. Branding"}
                title={ar ? "التصنيف" : "Category"}
                className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
              />
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-(--foreground)">{ar ? "الوصف بالعربي" : "Description (Arabic)"}</label>
                <textarea
                  value={form.description_ar}
                  onChange={e => set("description_ar", e.target.value)}
                  dir="rtl"
                  rows={3}
                  placeholder={ar ? "تفاصيل المشروع..." : "Project details in Arabic..."}
                  title={ar ? "الوصف بالعربي" : "Arabic description"}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring) resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-(--foreground)">{ar ? "الوصف بالإنجليزي" : "Description (English)"}</label>
                <textarea
                  value={form.description_en}
                  onChange={e => set("description_en", e.target.value)}
                  dir="ltr"
                  rows={3}
                  placeholder="Project details in English..."
                  title={ar ? "الوصف بالإنجليزي" : "English description"}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring) resize-none"
                />
              </div>
            </div>

            {/* Client & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-(--foreground)">{ar ? "العميل" : "Client"}</label>
                <input
                  value={form.client}
                  onChange={e => set("client", e.target.value)}
                  placeholder={ar ? "اسم العميل" : "Client name"}
                  title={ar ? "العميل" : "Client"}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-(--foreground)">{ar ? "السنة" : "Year"}</label>
                <input
                  value={form.year}
                  onChange={e => set("year", e.target.value)}
                  inputMode="numeric"
                  placeholder="2026"
                  title={ar ? "السنة" : "Year"}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
                />
              </div>
            </div>

            {/* Scope of work */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-(--foreground)">{ar ? "نطاق العمل بالعربي" : "Scope (Arabic)"}</label>
                <input
                  value={form.scope_ar}
                  onChange={e => set("scope_ar", e.target.value)}
                  dir="rtl"
                  placeholder="تصميم هوية, إنتاج متكامل"
                  title={ar ? "نطاق العمل بالعربي (افصل بينها بفواصل)" : "Scope tags, comma separated"}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
                />
                <p className="text-xs text-(--muted-foreground)">{ar ? "افصل بين الوسوم بفاصلة" : "Comma separated"}</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-(--foreground)">{ar ? "نطاق العمل بالإنجليزي" : "Scope (English)"}</label>
                <input
                  value={form.scope_en}
                  onChange={e => set("scope_en", e.target.value)}
                  dir="ltr"
                  placeholder="Identity Craft, Production"
                  title={ar ? "نطاق العمل بالإنجليزي (افصل بينها بفواصل)" : "Scope tags, comma separated"}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
                />
                <p className="text-xs text-(--muted-foreground)">{ar ? "افصل بين الوسوم بفاصلة" : "Comma separated"}</p>
              </div>
            </div>

            {/* Featured toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-(--muted)/50 border border-(--border)">
              <div>
                <p className="text-sm font-medium text-(--foreground)">{ar ? "عمل مميز" : "Featured Item"}</p>
                <p className="text-xs text-(--muted-foreground)">{ar ? "يظهر في الصفحة الرئيسية" : "Shown on homepage"}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.is_featured ? "true" : "false"}
                aria-label={ar ? "تمييز العمل" : "Toggle featured"}
                onClick={() => set("is_featured", !form.is_featured)}
                className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${form.is_featured ? "bg-(--primary)" : "bg-(--muted)"}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${form.is_featured ? "inset-s-5" : "inset-s-1"}`} />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex gap-3 justify-end border-t border-(--border) pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-(--muted-foreground) hover:bg-(--muted) transition-colors">
              {ar ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-sm font-medium bg-(--primary) text-(--primary-foreground) hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isSaving ? "..." : isEdit ? (ar ? "حفظ التعديلات" : "Save Changes") : (ar ? "إضافة العمل" : "Add Item")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete confirm ─────────────────────────────────────────────────────────
function DeleteConfirm({ item, language, onClose, onConfirm, isDeleting }: {
  item: PortfolioItem; language: string; onClose: () => void;
  onConfirm: () => void; isDeleting: boolean;
}) {
  const ar = language === "ar";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-sm rounded-2xl bg-(--card) border border-(--border) shadow-xl p-6 space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mx-auto">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-(--foreground)">{ar ? "حذف العمل" : "Delete Item"}</h3>
          <p className="text-sm text-(--muted-foreground) mt-1">
            {ar ? `هل تريد حذف "${item.title_ar}"؟` : `Delete "${item.title_en}"?`}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl text-sm text-(--muted-foreground) hover:bg-(--muted) transition-colors">
            {ar ? "إلغاء" : "Cancel"}
          </button>
          <button onClick={onConfirm} disabled={isDeleting} className="flex-1 py-2 rounded-xl text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50">
            {isDeleting ? "..." : ar ? "حذف" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
const PortfolioManager = () => {
  const { language } = useLanguage();
  const ar = language === "ar";

  const { data: items = [], isLoading, isError } = usePortfolio();
  const { mutate: createItem,  isPending: isCreating } = useCreatePortfolio();
  const { mutate: updateItem,  isPending: isUpdating } = useUpdatePortfolio();
  const { mutate: deleteItem,  isPending: isDeleting } = useDeletePortfolio();

  const [showAdd,    setShowAdd]    = useState(false);
  const [editItem,   setEditItem]   = useState<PortfolioItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioItem | null>(null);
  const [filter,     setFilter]     = useState<"all" | "featured">("all");

  // حالتا الـ State الخاصتان بمعاينة تفاصيل العمل الفاخرة
  const [previewItem, setPreviewItem] = useState<any>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState<number>(0);

  const filtered = filter === "featured" ? items.filter(i => i.is_featured) : items;

  const handleSave = (data: typeof EMPTY_FORM) => {
    const payload = {
      ...data,
      category_id: data.category_id || undefined,
      scope_ar: toTags(data.scope_ar),
      scope_en: toTags(data.scope_en),
    };
    if (editItem) {
      updateItem({ id: editItem.id, ...payload }, { onSuccess: () => setEditItem(null) });
    } else {
      createItem(payload, { onSuccess: () => setShowAdd(false) });
    }
  };

  // معالجة وإعداد بيانات العمل الحقيقية لعرضها في نافذة المعاينة الفاخرة
  const handleOpenPreview = (item: PortfolioItem) => {
    const it = item as any;
    const description = ar ? it.description_ar : it.description_en;
    
    // 1. تحويل نطاق العمل لمصفوفة
    const rawScope = ar ? it.scope_ar : it.scope_en;
    const scope = rawScope 
      ? (Array.isArray(rawScope) ? rawScope : rawScope.split(',').map((s: string) => s.trim()).filter(Boolean))
      : [];

    // 2. تحويل الصور المتعددة (الجاليري) لمصفوفة روابط
    const rawGallery = it.gallery || it.images;
    let gallery: string[] = [];
    if (rawGallery) {
      gallery = Array.isArray(rawGallery) 
        ? rawGallery 
        : rawGallery.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    // إذا لم يكن هناك جاليري، نضع الصورة الأساسية كأول صورة في المصفوفة
    if (gallery.length === 0 && item.image_url) {
      gallery.push(item.image_url);
    }

    const formattedItem = {
      title: ar ? item.title_ar : item.title_en,
      category: it.category_id || (ar ? "معرض الأعمال" : "Portfolio Showcase"),
      description:
        description && description.trim().length > 0
          ? description
          : (ar
              ? "لم يتم إضافة تفاصيل عن المشروع بعد."
              : "No project details have been added yet."),
      client: it.client || "—",
      year: it.year || "—",
      scope,
      gallery, // مصفوفة الصور الجاهزة للعرض
      image_url: item.image_url,
    };
    setPreviewItem(formattedItem);
    setCurrentImgIndex(0);
  };

  const handlePrevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!previewItem || !previewItem.gallery) return;
    setCurrentImgIndex((prev) => (prev === 0 ? previewItem.gallery.length - 1 : prev - 1));
  };

  const handleNextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!previewItem || !previewItem.gallery) return;
    setCurrentImgIndex((prev) => (prev === previewItem.gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-(--foreground)">{ar ? "إدارة الأعمال" : "Portfolio Manager"}</h1>
          <p className="text-sm text-(--muted-foreground) mt-0.5">
            {ar ? `${items.length} عمل` : `${items.length} items`}
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-(--primary) text-(--primary-foreground) hover:opacity-90 transition-opacity"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {ar ? "إضافة عمل" : "Add Item"}
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-(--muted)/50 rounded-xl w-fit">
        {[
          { key: "all",      ar: "الكل",     en: "All"      },
          { key: "featured", ar: "المميزة",  en: "Featured" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as "all" | "featured")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key
                ? "bg-(--card) text-(--foreground) shadow-sm"
                : "text-(--muted-foreground) hover:text-(--foreground)"
            }`}
          >
            {tab[language as "ar" | "en"]}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-(--muted) animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-center text-sm text-(--muted-foreground) py-12">
          {ar ? "تعذّر تحميل الأعمال" : "Could not load portfolio"}
        </p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-(--muted-foreground)">{ar ? "لا توجد أعمال بعد" : "No items yet"}</p>
          <button onClick={() => setShowAdd(true)} className="text-sm text-(--primary) hover:underline">
            {ar ? "أضف أول عمل" : "Add your first item"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => handleOpenPreview(item)} // فتح تفاصيل العرض الفاخرة عند النقر على كرت العمل
              className="group relative rounded-2xl overflow-hidden border border-(--border) bg-(--card) aspect-square cursor-pointer transition-all duration-300 hover:border-emerald-500/30"
            >
              {/* Image */}
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={ar ? item.title_ar : item.title_en}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-(--muted)">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-(--muted-foreground)">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              )}

              {/* Featured badge */}
              {item.is_featured && (
                <div className="absolute top-2 inset-s-2 px-2 py-0.5 rounded-full bg-amber-400 text-amber-900 text-xs font-bold z-10">
                  ★
                </div>
              )}

              {/* Overlay: always visible on mobile, hover-reveal on desktop */}
              <div className="absolute inset-0 bg-black/40 sm:bg-black/60 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 sm:p-3 z-20">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // لمنع فتح نافذة المعاينة الفاخرة عند الضغط على التعديل
                      setEditItem(item);
                    }}
                    aria-label={ar ? "تعديل" : "Edit"}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // لمنع فتح نافذة المعاينة الفاخرة عند الضغط على الحذف
                      setDeleteTarget(item);
                    }}
                    aria-label={ar ? "حذف" : "Delete"}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                    </svg>
                  </button>
                </div>
                <p className="text-white text-xs sm:text-sm font-medium truncate">
                  {ar ? item.title_ar : item.title_en}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {(showAdd || editItem) && (
        <PortfolioModal
          initial={editItem ?? undefined}
          language={language}
          onClose={() => { setShowAdd(false); setEditItem(null); }}
          onSave={handleSave}
          isSaving={isCreating || isUpdating}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          item={deleteTarget}
          language={language}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteItem(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })}
          isDeleting={isDeleting}
        />
      )}

      {/* ── الـ Modal المتكامل وتفاصيل العمل المختار الفاخر (مماثل لـ PortfolioView) ── */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-zinc-950/85 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 grid grid-cols-1 md:grid-cols-12 max-h-[90vh] md:max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
            dir={ar ? "rtl" : "ltr"}
          >
            <button
              type="button"
              onClick={() => setPreviewItem(null)}
              title={ar ? "إغلاق" : "Close"}
              aria-label={ar ? "إغلاق" : "Close"}
              className={`absolute top-4 z-30 p-2 rounded-full bg-zinc-950/50 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer ${
                ar ? "left-4" : "right-4"
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* الجزء الأيسر: سلايدر معرض الصور المصغر و الـ Thumbnails */}
            <div className="md:col-span-7 bg-zinc-950 flex flex-col justify-between relative p-4 group/slider">
              <div className="relative flex-1 flex items-center justify-center aspect-16/10 md:aspect-auto overflow-hidden rounded-2xl bg-zinc-900">
                <img
                  src={
                    (previewItem.gallery && previewItem.gallery[currentImgIndex]) ||
                    previewItem.image_url
                  }
                  alt={previewItem.title}
                  className="max-w-full max-h-[50vh] md:max-h-[55vh] object-contain transition-all duration-500"
                />

                {previewItem.gallery?.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImg}
                      title="Previous image"
                      className="absolute left-4 p-2.5 rounded-full bg-zinc-900/80 hover:bg-emerald-500 text-white border border-zinc-800/50 transition-all shadow-md transform -translate-y-1/2 top-1/2 opacity-0 group-hover/slider:opacity-100 cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImg}
                      title="Next image"
                      className="absolute right-4 p-2.5 rounded-full bg-zinc-900/80 hover:bg-emerald-500 text-white border border-zinc-800/50 transition-all shadow-md transform -translate-y-1/2 top-1/2 opacity-0 group-hover/slider:opacity-100 cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* معرض الصور المصغرة */}
              {previewItem.gallery && previewItem.gallery.length > 0 && (
                <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1 justify-center max-w-full scrollbar-thin scrollbar-thumb-zinc-800">
                  {previewItem.gallery.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImgIndex(idx)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        currentImgIndex === idx
                          ? "border-emerald-500 scale-105 shadow-md ring-2 ring-emerald-500/20"
                          : "border-transparent opacity-50 hover:opacity-100 hover:border-zinc-700"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`thumbnail-${idx}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* الجزء الأيمن: لوحة تفاصيل العمل الداكنة الفاخرة */}
            <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[40vh] md:max-h-full border-t md:border-t-0 md:border-s border-zinc-800 bg-zinc-900/60">
              <div className="text-start">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-2">
                  {previewItem.category}
                </span>

                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mb-4 leading-snug">
                  {previewItem.title}
                </h2>

                <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-normal mb-6 border-b border-zinc-800/60 pb-6">
                  {previewItem.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6 border-b border-zinc-800/60 pb-6">
                  <div>
                    <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-bold uppercase tracking-wider mb-1">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{ar ? "العميل" : "Client"}</span>
                    </div>
                    <p className="text-sm font-bold text-zinc-200">
                      {previewItem.client || "—"}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-bold uppercase tracking-wider mb-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{ar ? "السنة" : "Year"}</span>
                    </div>
                    <p className="text-sm font-bold text-zinc-200">
                      {previewItem.year || "—"}
                    </p>
                  </div>
                </div>

                {previewItem.scope && previewItem.scope.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-bold uppercase tracking-wider mb-3">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      <span>
                        {ar ? "نطاق العمل" : "SCOPE OF WORK"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {previewItem.scope.map(
                        (tag: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 text-xs font-medium rounded-full bg-zinc-950 text-zinc-300 border border-zinc-800/80 hover:border-emerald-500/30 transition-colors"
                          >
                            {tag}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioManager;