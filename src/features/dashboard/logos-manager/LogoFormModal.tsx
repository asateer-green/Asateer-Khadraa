// src/features/dashboard/logos-manager/LogoFormModal.tsx
import { useState, useEffect, type FormEvent } from "react";
import { Upload } from "lucide-react";
import { Modal } from "../../../components/ui/Modal";
import { Field, TextInput } from "../../../components/ui/FormField";
import { SafeImage } from "../../../components/ui/SafeImage";
import type { Logo } from "../../../types/api.types";

const EMPTY_FORM = { 
  titleAr: "", 
  titleEn: "", 
  sortOrder: 0, 
  uploadMode: "url" as "url" | "file", 
  imageFile: null as File | null, 
  externalUrl: "" 
};

type LogoForm = typeof EMPTY_FORM;

interface LogoFormModalProps {
  ar: boolean;
  onClose: () => void;
  onSave: (data: LogoForm) => void;
  isSaving: boolean;
  error: string;
  editData?: Logo | null; // إضافة خيار استقبال بيانات التعديل
}

export function LogoFormModal({
  ar,
  onClose,
  onSave,
  isSaving,
  error,
  editData,
}: LogoFormModalProps) {
  const [form, setForm] = useState<LogoForm>(EMPTY_FORM);

  // عمل تعبئة تلقائية للبيانات (Prefill) في حال كان المودال للتعديل
  useEffect(() => {
    if (editData) {
      setForm({
        titleAr: editData.title_ar || "",
        titleEn: editData.title_en || "",
        sortOrder: editData.sort_order || 0,
        uploadMode: "url", // افتراضياً الرابط الخارجي للصورة الحالية
        imageFile: null,
        externalUrl: editData.image_url || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editData]);

  const set = <K extends keyof LogoForm>(key: K, value: LogoForm[K]) => 
    setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.titleAr.trim() || !form.titleEn.trim()) return;
    if (form.uploadMode === "file" && !form.imageFile && !editData) return; // ملف الصورة إجباري فقط عند الإضافة الجديدة
    if (form.uploadMode === "url" && !form.externalUrl.trim()) return;
    onSave(form);
  };

  const isEdit = !!editData;

  return (
    <Modal
      title={isEdit ? (ar ? "تعديل الشعار" : "Edit Logo") : (ar ? "إضافة شعار جديد" : "Add New Logo")}
      closeLabel={ar ? "إغلاق" : "Close"}
      onClose={onClose}
      footer={
        <>
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 rounded-xl text-sm text-(--muted-foreground) hover:bg-(--muted) transition-colors"
          >
            {ar ? "إلغاء" : "Cancel"}
          </button>
          <button 
            form="logo-form" 
            type="submit" 
            disabled={isSaving} 
            className="px-5 py-2 rounded-xl text-sm font-medium bg-(--primary) text-(--primary-foreground) hover:opacity-90 disabled:opacity-50"
          >
            {isSaving ? (ar ? "جاري الحفظ..." : "Saving...") : (ar ? "حفظ ونشر" : "Save & Publish")}
          </button>
        </>
      }
    >
      <form id="logo-form" onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label={ar ? "الاسم بالعربي" : "Name (Arabic)"} required>
            <TextInput value={form.titleAr} onChange={e => set("titleAr", e.target.value)} dir="rtl" title="Arabic name" placeholder="شعار عقاري" />
          </Field>
          <Field label={ar ? "الاسم بالإنجليزي" : "Name (English)"} required>
            <TextInput value={form.titleEn} onChange={e => set("titleEn", e.target.value)} dir="ltr" title="English name" placeholder="Real Estate Logo" />
          </Field>
        </div>

        <Field label={ar ? "طريقة إضافة الصورة" : "Image Source"}>
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
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Field label={ar ? "الترتيب" : "Order"}>
            <TextInput type="number" min={0} value={form.sortOrder} onChange={e => set("sortOrder", Number(e.target.value))} title={ar ? "ترتيب العرض" : "Sort order"} />
          </Field>
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-sm font-medium text-(--foreground)">
              {form.uploadMode === "url" ? (ar ? "رابط الصورة" : "Image URL") : (ar ? "ملف الصورة" : "Image File")}
            </label>
            {form.uploadMode === "url" ? (
              <TextInput type="url" value={form.externalUrl} onChange={e => set("externalUrl", e.target.value)} dir="ltr" title="Image URL" placeholder="https://..." />
            ) : (
              <div className="relative border-2 border-dashed border-(--border) hover:border-(--primary)/50 rounded-xl px-4 py-2.5 flex items-center gap-2 cursor-pointer transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => set("imageFile", e.target.files?.[0] ?? null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Choose image"
                />
                <Upload size={15} className="text-(--muted-foreground) shrink-0" />
                <span className="text-sm text-(--muted-foreground) truncate">
                  {form.imageFile ? form.imageFile.name : (ar ? "اختر صورة جديدة" : "Choose new image")}
                </span>
              </div>
            )}
          </div>
        </div>

        {form.uploadMode === "url" && form.externalUrl && (
          <SafeImage src={form.externalUrl} alt="preview" className="h-24 rounded-xl object-contain border border-(--border) bg-(--muted)/30 p-2" />
        )}

        {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
      </form>
    </Modal>
  );
}