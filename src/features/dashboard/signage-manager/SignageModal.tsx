// src/features/dashboard/signage-manager/SignageModal.tsx
import { useState, useEffect, type FormEvent } from "react";
import { Plus, Trash2, Upload, Link } from "lucide-react";
import { Modal } from "../../../components/ui/Modal";
import { Field, TextInput, TextArea } from "../../../components/ui/FormField";
import { Switch } from "../../../components/ui/Switch";
import { SafeImage } from "../../../components/ui/SafeImage";
import { toList, toCsv, type SignageItemExtended } from "./signageTransforms";

export interface GalleryItemState {
  mode: "url" | "file";
  url: string;
  file: File | null;
}

export const EMPTY_SIGNAGE_FORM = {
  title_ar: "",
  title_en: "",
  location: "",
  uploadMode: "file" as "url" | "file",
  imageFile: null as File | null,
  image_url: "",
  description_ar: "",
  description_en: "",
  client: "",
  year: "",
  scope_ar: "",
  scope_en: "",
  is_active: true,
};

export type SignageForm = typeof EMPTY_SIGNAGE_FORM & { galleryItems: GalleryItemState[] };

export function SignageModal({
  initial,
  ar,
  onClose,
  onSave,
  isSaving,
}: {
  initial?: SignageItemExtended;
  ar: boolean;
  onClose: () => void;
  onSave: (data: SignageForm) => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<typeof EMPTY_SIGNAGE_FORM>(EMPTY_SIGNAGE_FORM);
  const [galleryItems, setGalleryItems] = useState<GalleryItemState[]>([{ mode: "file", url: "", file: null }]);

  useEffect(() => {
    if (initial) {
      setForm({
        title_ar: initial.title_ar,
        title_en: initial.title_en,
        location: initial.location ?? "",
        uploadMode: "file",
        imageFile: null,
        image_url: initial.image_url ?? "",
        description_ar: initial.description_ar ?? "",
        description_en: initial.description_en ?? "",
        client: initial.client ?? "",
        year: initial.year ?? "",
        scope_ar: toCsv(toList(initial.scope_ar)),
        scope_en: toCsv(toList(initial.scope_en)),
        is_active: initial.is_active,
      });

      const list = toList(initial.gallery);
      if (list.length > 0) {
        setGalleryItems(list.map(url => ({ mode: "url", url, file: null })));
      } else {
        setGalleryItems([{ mode: "file", url: "", file: null }]);
      }
    } else {
      setForm(EMPTY_SIGNAGE_FORM);
      setGalleryItems([{ mode: "file", url: "", file: null }]);
    }
  }, [initial]);

  const set = <K extends keyof typeof EMPTY_SIGNAGE_FORM>(key: K, value: typeof EMPTY_SIGNAGE_FORM[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const addGalleryField = () => setGalleryItems(prev => [...prev, { mode: "file", url: "", file: null }]);

  const removeGalleryField = (index: number) =>
    setGalleryItems(prev => {
      const next = prev.filter((_, i) => i !== index);
      return next.length > 0 ? next : [{ mode: "file", url: "", file: null }];
    });

  const updateGalleryItem = (index: number, fields: Partial<GalleryItemState>) => {
    setGalleryItems(prev => prev.map((item, i) => (i === index ? { ...item, ...fields } : item)));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title_ar.trim() || !form.title_en.trim()) return;
    onSave({ ...form, galleryItems });
  };

  const isEdit = !!initial;

  return (
    <Modal
      title={isEdit ? (ar ? "تعديل اللوحة" : "Edit Signage") : (ar ? "إضافة لوحة جديدة" : "Add Signage")}
      closeLabel={ar ? "إغلاق" : "Close"}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-(--muted-foreground) hover:bg-(--muted) transition-colors">
            {ar ? "إلغاء" : "Cancel"}
          </button>
          <button form="signage-form" type="submit" disabled={isSaving} className="px-5 py-2 rounded-xl text-sm font-medium bg-(--primary) text-(--primary-foreground) hover:opacity-90 disabled:opacity-50">
            {isSaving ? "..." : isEdit ? (ar ? "حفظ التعديلات" : "Save Changes") : (ar ? "إضافة اللوحة" : "Add Signage")}
          </button>
        </>
      }
    >
      <form id="signage-form" onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label={ar ? "الاسم بالعربي" : "Name (Arabic)"} required>
            <TextInput value={form.title_ar} onChange={e => set("title_ar", e.target.value)} required dir="rtl" placeholder="اسم اللوحة" title="title_ar" />
          </Field>
          <Field label={ar ? "الاسم بالإنجليزي" : "Name (English)"} required>
            <TextInput value={form.title_en} onChange={e => set("title_en", e.target.value)} required dir="ltr" placeholder="Signage name" title="title_en" />
          </Field>
        </div>

        {/* مصدر الصورة الرئيسية */}
        <Field label={ar ? "مصدر الصورة الرئيسية" : "Main Image Source"}>
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

        <div className="space-y-1.5">
          {form.uploadMode === "url" ? (
            <TextInput value={form.image_url} onChange={e => set("image_url", e.target.value)} type="url" placeholder="https://..." title="image_url" />
          ) : (
            <div className="relative border-2 border-dashed border-(--border) hover:border-(--primary)/50 rounded-xl px-4 py-3 flex items-center gap-2 cursor-pointer transition-colors">
              <input type="file" accept="image/*" onChange={e => set("imageFile", e.target.files?.[0] ?? null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="main_file" />
              <Upload size={15} className="text-(--muted-foreground) shrink-0" />
              <span className="text-sm text-(--muted-foreground) truncate">
                {form.imageFile ? form.imageFile.name : (ar ? "اختر صورة اللوحة" : "Choose image file")}
              </span>
            </div>
          )}
        </div>

        {form.uploadMode === "url" && form.image_url && (
          <SafeImage src={form.image_url} alt="preview" className="mt-2 h-40 w-full object-cover rounded-xl border border-(--border)" />
        )}
        {form.uploadMode === "file" && form.image_url && !form.imageFile && (
          <div className="space-y-1">
            <span className="text-xs text-(--muted-foreground)">{ar ? "الصورة الحالية:" : "Current Image:"}</span>
            <SafeImage src={form.image_url} alt="current" className="h-40 w-full object-cover rounded-xl border border-(--border)" />
          </div>
        )}

        {/* الموقع */}
        <Field label={ar ? "الموقع / المكان" : "Location"}>
          <TextInput
            value={form.location}
            onChange={e => set("location", e.target.value)}
            placeholder={ar ? "مثال: الرياض، حي العليا" : "e.g. Riyadh, Al-Olaya"}
            title="location"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label={ar ? "الوصف بالعربي" : "Description (Arabic)"}>
            <TextArea value={form.description_ar} onChange={e => set("description_ar", e.target.value)} dir="rtl" rows={3} placeholder="..." title="desc_ar" />
          </Field>
          <Field label={ar ? "الوصف بالإنجليزي" : "Description (English)"}>
            <TextArea value={form.description_en} onChange={e => set("description_en", e.target.value)} dir="ltr" rows={3} placeholder="..." title="desc_en" />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label={ar ? "العميل" : "Client"}>
            <TextInput value={form.client} onChange={e => set("client", e.target.value)} placeholder="..." title="client" />
          </Field>
          <Field label={ar ? "السنة" : "Year"}>
            <TextInput value={form.year} onChange={e => set("year", e.target.value)} inputMode="numeric" placeholder="2026" title="year" />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label={ar ? "نطاق العمل بالعربي" : "Scope (Arabic)"} hint={ar ? "افصل بفاصلة" : "Comma separated"}>
            <TextInput value={form.scope_ar} onChange={e => set("scope_ar", e.target.value)} dir="rtl" placeholder="..." title="scope_ar" />
          </Field>
          <Field label={ar ? "نطاق العمل بالإنجليزي" : "Scope (English)"} hint={ar ? "افصل بفاصلة" : "Comma separated"}>
            <TextInput value={form.scope_en} onChange={e => set("scope_en", e.target.value)} dir="ltr" placeholder="..." title="scope_en" />
          </Field>
        </div>

        <Switch checked={form.is_active} onChange={v => set("is_active", v)} label={ar ? "نشطة" : "Active"} description={ar ? "تظهر على الموقع" : "Shown on the website"} />

        {/* الـ Gallery المطور المشترك (رفع + روابط) — نفس مكوّن إدارة الأعمال بالحرف */}
        <div className="space-y-2 border-t border-(--border) pt-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-(--foreground)">
              {ar ? "صور اللوحة الإضافية" : "Additional Signage Images"}
            </label>
            <button type="button" onClick={addGalleryField} className="flex items-center gap-1 text-xs font-semibold text-emerald-500 hover:text-emerald-400 px-2 py-1 rounded-lg hover:bg-emerald-500/10 transition-colors">
              <Plus size={14} /> {ar ? "إضافة صورة" : "Add Image"}
            </button>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {galleryItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-(--muted)/20 p-2 rounded-xl border border-(--border)/40">
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => updateGalleryItem(idx, { mode: "file", url: "" })}
                    className={`p-1.5 rounded-lg transition-colors ${item.mode === "file" ? "bg-(--primary) text-(--primary-foreground)" : "text-(--muted-foreground) hover:bg-(--muted)"}`}
                    title="Upload File"
                  >
                    <Upload size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => updateGalleryItem(idx, { mode: "url", file: null })}
                    className={`p-1.5 rounded-lg transition-colors ${item.mode === "url" ? "bg-(--primary) text-(--primary-foreground)" : "text-(--muted-foreground) hover:bg-(--muted)"}`}
                    title="External URL"
                  >
                    <Link size={14} />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  {item.mode === "url" ? (
                    <TextInput value={item.url} onChange={e => updateGalleryItem(idx, { url: e.target.value })} type="url" placeholder="https://..." title={`url-${idx}`} className="w-full" />
                  ) : (
                    <div className="relative border border-dashed border-(--border) hover:border-(--primary)/50 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer h-9.5 bg-(--card)">
                      <input type="file" accept="image/*" onChange={e => updateGalleryItem(idx, { file: e.target.files?.[0] ?? null })} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title={`file-${idx}`} />
                      <span className="text-xs text-(--muted-foreground) truncate">
                        {item.file ? item.file.name : (ar ? "اختر صورة..." : "Choose image...")}
                      </span>
                    </div>
                  )}
                </div>

                <button type="button" onClick={() => removeGalleryField(idx)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all shrink-0 mt-0.5">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
}