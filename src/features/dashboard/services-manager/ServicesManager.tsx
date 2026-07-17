// src/features/dashboard/services-manager/ServicesManager.tsx
import { useState } from "react";
import {
  useServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from "../../../hooks/api/useServices";
import { useLanguage } from "../../../hooks/ui/useLanguage";
import type { Service } from "../../../types/api.types";

// ── Empty form state ───────────────────────────────────────────────────────
const EMPTY_FORM = {
  title_ar:   "",
  title_en:   "",
  desc_ar:    "",
  desc_en:    "",
  uploadMode: "file" as "url" | "file",
  imageFile:  null as File | null,
  image_url:  "",
  is_active:  true,
  sort_order: 0,
};
type ServiceForm = typeof EMPTY_FORM;

// ── Service Form Modal ─────────────────────────────────────────────────────
function ServiceModal({
  initial,
  language,
  onClose,
  onSave,
  isSaving,
}: {
  initial?: Service;
  language: string;
  onClose: () => void;
  onSave: (data: ServiceForm) => void;
  isSaving: boolean;
}) {
  const ar = language === "ar";
  const [form, setForm] = useState<ServiceForm>(
    initial
      ? {
          title_ar:  initial.title_ar,
          title_en:  initial.title_en,
          desc_ar:   initial.desc_ar  ?? "",
          desc_en:   initial.desc_en  ?? "",
          uploadMode: "file",
          imageFile: null,
          image_url: initial.image_url ?? "",
          is_active: initial.is_active,
          sort_order: initial.sort_order,
        }
      : EMPTY_FORM
  );

  const set = <K extends keyof ServiceForm>(key: K, value: ServiceForm[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title_ar.trim() || !form.title_en.trim()) return;
    onSave(form);
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
            {isEdit ? (ar ? "تعديل الخدمة" : "Edit Service") : (ar ? "إضافة خدمة" : "Add Service")}
          </h2>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:bg-(--muted) transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="p-6 space-y-4">

            {/* Titles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-(--foreground)">
                  {ar ? "الاسم بالعربي" : "Name (Arabic)"} *
                </label>
                <input
                  value={form.title_ar}
                  onChange={e => set("title_ar", e.target.value)}
                  required
                  dir="rtl"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-(--foreground)">
                  {ar ? "الاسم بالإنجليزي" : "Name (English)"} *
                </label>
                <input
                  value={form.title_en}
                  onChange={e => set("title_en", e.target.value)}
                  required
                  dir="ltr"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-(--foreground)">
                {ar ? "الوصف بالعربي" : "Description (Arabic)"}
              </label>
              <textarea
                value={form.desc_ar}
                onChange={e => set("desc_ar", e.target.value)}
                rows={3}
                dir="rtl"
                className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) focus:outline-none focus:ring-2 focus:ring-(--ring) resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-(--foreground)">
                {ar ? "الوصف بالإنجليزي" : "Description (English)"}
              </label>
              <textarea
                value={form.desc_en}
                onChange={e => set("desc_en", e.target.value)}
                rows={3}
                dir="ltr"
                className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) focus:outline-none focus:ring-2 focus:ring-(--ring) resize-none"
              />
            </div>

            {/* Image Selector (مصدر صورة الخدمة) */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-(--foreground)">
                {ar ? "مصدر صورة الخدمة" : "Service Image Source"}
              </label>
              <div className="flex gap-1 p-1 bg-(--muted)/50 rounded-xl w-fit">
                {(["url", "file"] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => set("uploadMode", mode)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      form.uploadMode === mode ? "bg-(--card) text-(--foreground) shadow-sm" : "text-(--muted-foreground) hover:text-(--foreground)"
                    }`}
                  >
                    {mode === "url" ? (ar ? "رابط خارجي" : "External URL") : (ar ? "رفع من الجهاز" : "Upload File")}
                  </button>
                ))}
              </div>
            </div>

            {/* Input area based on choice */}
            <div className="space-y-1.5">
              {form.uploadMode === "url" ? (
                <input
                  value={form.image_url}
                  onChange={e => set("image_url", e.target.value)}
                  type="url"
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
                />
              ) : (
                <div className="relative border-2 border-dashed border-(--border) hover:border-(--primary)/50 rounded-xl px-4 py-3 flex items-center gap-2 cursor-pointer transition-colors">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => set("imageFile", e.target.files?.[0] ?? null)} 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    title="service_file" 
                  />
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-(--muted-foreground) shrink-0">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span className="text-sm text-(--muted-foreground) truncate">
                    {form.imageFile ? form.imageFile.name : (ar ? "اختر صورة للخدمة" : "Choose image file")}
                  </span>
                </div>
              )}
            </div>

            {/* Image Preview */}
            {form.uploadMode === "url" && form.image_url && (
              <img
                src={form.image_url}
                alt="preview"
                className="mt-2 h-24 w-full object-cover rounded-xl border border-(--border)"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}
            {form.uploadMode === "file" && form.image_url && !form.imageFile && (
              <div className="space-y-1">
                <span className="text-xs text-(--muted-foreground)">{ar ? "الصورة الحالية:" : "Current Image:"}</span>
                <img
                  src={form.image_url}
                  alt="current"
                  className="h-24 w-full object-cover rounded-xl border border-(--border)"
                />
              </div>
            )}

            {/* Sort order + Active */}
            <div className="flex items-center gap-4">
              <div className="space-y-1.5 flex-1">
                <label className="text-sm font-medium text-(--foreground)">
                  {ar ? "ترتيب العرض" : "Sort Order"}
                </label>
                <input
                  type="number"
                  min={0}
                  title={ar ? "ترتيب العرض" : "Sort Order"}
                  value={form.sort_order}
                  onChange={e => set("sort_order", Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.is_active ? "true" : "false"}
                  aria-label={ar ? "تفعيل الخدمة" : "Toggle active"}
                  onClick={() => set("is_active", !form.is_active)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${form.is_active ? "bg-(--primary)" : "bg-(--muted)"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.is_active ? "inset-s-5" : "inset-s-1"}`} />
                </button>
                <span className="text-sm text-(--foreground)">
                  {form.is_active ? (ar ? "نشط" : "Active") : (ar ? "مخفي" : "Hidden")}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex gap-3 justify-end border-t border-(--border) pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-(--muted-foreground) hover:bg-(--muted) transition-colors"
            >
              {ar ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-sm font-medium bg-(--primary) text-(--primary-foreground) hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isSaving ? "..." : isEdit ? (ar ? "حفظ التعديلات" : "Save Changes") : (ar ? "إضافة الخدمة" : "Add Service")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete confirm ─────────────────────────────────────────────────────────
function DeleteConfirm({
  service, language, onClose, onConfirm, isDeleting,
}: {
  service: Service; language: string; onClose: () => void;
  onConfirm: () => void; isDeleting: boolean;
}) {
  const ar = language === "ar";
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl bg-(--card) border border-(--border) shadow-xl p-6 space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center mx-auto">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-(--foreground)">{ar ? "حذف الخدمة" : "Delete Service"}</h3>
          <p className="text-sm text-(--muted-foreground) mt-1">
            {ar ? `هل تريد حذف "${service.title_ar}"؟ لا يمكن التراجع.` : `Delete "${service.title_en}"? This cannot be undone.`}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl text-sm text-(--muted-foreground) hover:bg-(--muted) transition-colors">
            {ar ? "إلغاء" : "Cancel"}
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2 rounded-xl text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
          >
            {isDeleting ? "..." : ar ? "حذف" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
const ServicesManager = () => {
  const { language } = useLanguage();
  const ar = language === "ar";

  const { data: services = [], isLoading, isError } = useServices();
  const { mutate: createService, isPending: isCreating } = useCreateService();
  const { mutate: updateService, isPending: isUpdating } = useUpdateService();
  const { mutate: deleteService, isPending: isDeleting } = useDeleteService();

  const [showAdd,    setShowAdd]    = useState(false);
  const [editItem,   setEditItem]   = useState<Service | null>(null);
  const [deleteItem, setDeleteItem] = useState<Service | null>(null);

  const handleSave = (data: ServiceForm) => {
    const payload = {
      title_ar: data.title_ar,
      title_en: data.title_en,
      desc_ar: data.desc_ar,
      desc_en: data.desc_en,
      is_active: data.is_active,
      sort_order: data.sort_order,
      imageFile: data.uploadMode === "file" ? data.imageFile : null,
      image_url: data.uploadMode === "url" ? data.image_url : (editItem ? editItem.image_url : undefined),
    };

    if (editItem) {
      updateService(
        { id: editItem.id, ...payload },
        { onSuccess: () => setEditItem(null) }
      );
    } else {
      createService(payload, { onSuccess: () => setShowAdd(false) });
    }
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    deleteService(deleteItem.id, { onSuccess: () => setDeleteItem(null) });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-(--foreground)">
            {ar ? "إدارة الخدمات" : "Services Manager"}
          </h1>
          <p className="text-sm text-(--muted-foreground) mt-0.5">
            {ar ? `${services.length} خدمة` : `${services.length} services`}
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-(--primary) text-(--primary-foreground) hover:opacity-90 transition-opacity"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {ar ? "إضافة خدمة" : "Add Service"}
        </button>
      </div>

      {/* List */}
      <div className="rounded-2xl bg-(--card) border border-(--border) overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-(--muted) animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <p className="p-12 text-center text-sm text-(--muted-foreground)">
            {ar ? "تعذّر تحميل الخدمات" : "Could not load services"}
          </p>
        ) : services.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-(--muted-foreground) text-sm">
              {ar ? "لا توجد خدمات بعد" : "No services yet"}
            </p>
            <button
              onClick={() => setShowAdd(true)}
              className="text-sm text-(--primary) hover:underline"
            >
              {ar ? "أضف أول خدمة" : "Add your first service"}
            </button>
          </div>
        ) : (
          <div className="divide-y divide-(--border)">
            {services.map((service, idx) => (
              <div key={service.id} className="flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 hover:bg-(--muted)/30 transition-colors group">
                {/* Order badge */}
                <span className="hidden sm:flex w-7 h-7 rounded-lg bg-(--muted) items-center justify-center text-xs font-bold text-(--muted-foreground) shrink-0">
                  {idx + 1}
                </span>

                {/* Image */}
                {service.image_url ? (
                  <img
                    src={service.image_url}
                    alt={service.title_ar}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-(--border) shrink-0"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-(--muted) flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-(--muted-foreground)">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-(--foreground) truncate text-sm sm:text-base">
                    {ar ? service.title_ar : service.title_en}
                  </p>
                  <p className="text-xs text-(--muted-foreground) truncate">
                    {ar ? service.title_en : service.title_ar}
                  </p>
                  {/* Status shows here on mobile, under the name */}
                  <span className={`sm:hidden inline-flex mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    service.is_active
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-(--muted) text-(--muted-foreground)"
                  }`}>
                    {service.is_active ? (ar ? "نشط" : "Active") : (ar ? "مخفي" : "Hidden")}
                  </span>
                </div>

                {/* Status (desktop) */}
                <span className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                  service.is_active
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-(--muted) text-(--muted-foreground)"
                }`}>
                  {service.is_active ? (ar ? "نشط" : "Active") : (ar ? "مخفي" : "Hidden")}
                </span>

                {/* Actions: always visible on mobile, hover-reveal on desktop */}
                <div className="flex items-center gap-1 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditItem(service)}
                    aria-label={ar ? "تعديل" : "Edit"}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:bg-(--muted) hover:text-(--foreground) transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteItem(service)}
                    aria-label={ar ? "حذف" : "Delete"}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      {/* Modals */}
      {(showAdd || editItem) && (
        <ServiceModal
          initial={editItem ?? undefined}
          language={language}
          onClose={() => { setShowAdd(false); setEditItem(null); }}
          onSave={handleSave}
          isSaving={isCreating || isUpdating}
        />
      )}
      {deleteItem && (
        <DeleteConfirm
          service={deleteItem}
          language={language}
          onClose={() => setDeleteItem(null)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default ServicesManager;