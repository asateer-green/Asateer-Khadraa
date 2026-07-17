// src/features/dashboard/portfolio-manager/PortfolioModal.tsx
import { useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useCategories } from "../../../hooks/api/useCategories";
import { Modal } from "../../../components/ui/Modal";
import { Field, TextInput, TextArea } from "../../../components/ui/FormField";
import { Switch } from "../../../components/ui/Switch";
import { SafeImage } from "../../../components/ui/SafeImage";
import { toList, toCsv, type PortfolioItemExtended } from "./portfolioTransforms";

export const EMPTY_PORTFOLIO_FORM = {
  title_ar: "",
  title_en: "",
  category_id: "",
  image_url: "",
  description_ar: "",
  description_en: "",
  client: "",
  year: "",
  scope_ar: "",
  scope_en: "",
  is_featured: false,
  gallery: "",
};

export type PortfolioForm = typeof EMPTY_PORTFOLIO_FORM;

export function PortfolioModal({
  initial,
  ar,
  onClose,
  onSave,
  isSaving,
}: {
  initial?: PortfolioItemExtended;
  ar: boolean;
  onClose: () => void;
  onSave: (data: PortfolioForm) => void;
  isSaving: boolean;
}) {
  const { data: categories = [] } = useCategories();

  const [form, setForm] = useState<PortfolioForm>(
    initial
      ? {
          title_ar: initial.title_ar,
          title_en: initial.title_en,
          category_id: initial.category_id ?? "",
          image_url: initial.image_url ?? "",
          description_ar: initial.description_ar ?? "",
          description_en: initial.description_en ?? "",
          client: initial.client ?? "",
          year: initial.year ?? "",
          scope_ar: toCsv(toList(initial.scope_ar)),
          scope_en: toCsv(toList(initial.scope_en)),
          is_featured: initial.is_featured,
          gallery: toCsv(toList(initial.gallery)),
        }
      : EMPTY_PORTFOLIO_FORM,
  );

  const set = <K extends keyof PortfolioForm>(key: K, value: PortfolioForm[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const [galleryUrls, setGalleryUrls] = useState<string[]>(() => {
    const list = toList(initial?.gallery);
    return list.length > 0 ? list : [""];
  });

  const addGalleryField = () => setGalleryUrls(urls => [...urls, ""]);
  const removeGalleryField = (index: number) =>
    setGalleryUrls(urls => {
      const next = urls.filter((_, i) => i !== index);
      return next.length > 0 ? next : [""];
    });
  const changeGalleryUrl = (index: number, value: string) =>
    setGalleryUrls(urls => urls.map((u, i) => (i === index ? value : u)));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title_ar.trim() || !form.title_en.trim()) return;
    onSave({ ...form, gallery: toCsv(galleryUrls) });
  };

  const isEdit = !!initial;

  return (
    <Modal
      title={isEdit ? (ar ? "تعديل العمل" : "Edit Item") : (ar ? "إضافة عمل جديد" : "Add Portfolio Item")}
      closeLabel={ar ? "إغلاق" : "Close"}
      onClose={onClose}
      footer={
        <>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-(--muted-foreground) hover:bg-(--muted) transition-colors">
            {ar ? "إلغاء" : "Cancel"}
          </button>
          <button form="portfolio-form" type="submit" disabled={isSaving} className="px-5 py-2 rounded-xl text-sm font-medium bg-(--primary) text-(--primary-foreground) hover:opacity-90 disabled:opacity-50">
            {isSaving ? "..." : isEdit ? (ar ? "حفظ التعديلات" : "Save Changes") : (ar ? "إضافة العمل" : "Add Item")}
          </button>
        </>
      }
    >
      <form id="portfolio-form" onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label={ar ? "العنوان بالعربي" : "Title (Arabic)"} required>
            <TextInput value={form.title_ar} onChange={e => set("title_ar", e.target.value)} required dir="rtl" placeholder="اسم العمل" title={ar ? "العنوان بالعربي" : "Arabic title"} />
          </Field>
          <Field label={ar ? "العنوان بالإنجليزي" : "Title (English)"} required>
            <TextInput value={form.title_en} onChange={e => set("title_en", e.target.value)} required dir="ltr" placeholder="Project name" title={ar ? "العنوان بالإنجليزي" : "English title"} />
          </Field>
        </div>

        <Field label={ar ? "رابط الصورة الرئيسية" : "Main Image URL"}>
          <TextInput value={form.image_url} onChange={e => set("image_url", e.target.value)} type="url" placeholder="https://..." title={ar ? "رابط الصورة الرئيسية" : "Main Image URL"} />
          {form.image_url && (
            <SafeImage src={form.image_url} alt="preview" className="mt-2 h-40 w-full object-cover rounded-xl border border-(--border)" />
          )}
        </Field>

        {/* Gallery */}
        <div className="space-y-2 border-t border-(--border) pt-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-(--foreground)">
              {ar ? "صور المعرض الإضافية" : "Additional Gallery Images"}
            </label>
            <button
              type="button"
              onClick={addGalleryField}
              className="flex items-center gap-1 text-xs font-semibold text-emerald-500 hover:text-emerald-400 transition-colors px-2 py-1 rounded-lg hover:bg-emerald-500/10"
            >
              <Plus size={14} />
              {ar ? "إضافة رابط صورة" : "Add Image URL"}
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {galleryUrls.map((url, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <TextInput
                  value={url}
                  onChange={e => changeGalleryUrl(idx, e.target.value)}
                  type="url"
                  placeholder={ar ? `رابط صورة إضافية #${idx + 1}` : `Extra Image URL #${idx + 1}`}
                  title={ar ? `رابط صورة إضافية #${idx + 1}` : `Extra Image URL #${idx + 1}`}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => removeGalleryField(idx)}
                  disabled={galleryUrls.length === 1 && url === ""}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-30 transition-all shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-(--muted-foreground)">
            {ar ? "* ستظهر هذه الصور المصغرة أسفل المعاينة لتمكين المستخدمين من التنقل بينها." : "* These thumbnails will appear at the bottom of the preview modal."}
          </p>
        </div>

        {/* Category — select حقيقي بدل نص حر، مبني على نفس useCategories المستخدم في CategoriesManager */}
        <Field label={ar ? "التصنيف" : "Category"}>
          <select
            value={form.category_id}
            onChange={e => set("category_id", e.target.value)}
            title={ar ? "التصنيف" : "Category"}
            className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
          >
            <option value="">{ar ? "بدون تصنيف" : "No category"}</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {ar ? cat.name_ar : cat.name_en}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label={ar ? "الوصف بالعربي" : "Description (Arabic)"}>
            <TextArea value={form.description_ar} onChange={e => set("description_ar", e.target.value)} dir="rtl" rows={3} placeholder={ar ? "تفاصيل المشروع..." : "Project details in Arabic..."} title={ar ? "الوصف بالعربي" : "Arabic description"} />
          </Field>
          <Field label={ar ? "الوصف بالإنجليزي" : "Description (English)"}>
            <TextArea value={form.description_en} onChange={e => set("description_en", e.target.value)} dir="ltr" rows={3} placeholder="Project details in English..." title={ar ? "الوصف بالإنجليزي" : "English description"} />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label={ar ? "العميل" : "Client"}>
            <TextInput value={form.client} onChange={e => set("client", e.target.value)} placeholder={ar ? "اسم العميل" : "Client name"} title={ar ? "العميل" : "Client"} />
          </Field>
          <Field label={ar ? "السنة" : "Year"}>
            <TextInput value={form.year} onChange={e => set("year", e.target.value)} inputMode="numeric" placeholder="2026" title={ar ? "السنة" : "Year"} />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label={ar ? "نطاق العمل بالعربي" : "Scope (Arabic)"} hint={ar ? "افصل بين الوسوم بفاصلة" : "Comma separated"}>
            <TextInput value={form.scope_ar} onChange={e => set("scope_ar", e.target.value)} dir="rtl" placeholder="تصميم هوية, إنتاج متكامل" title={ar ? "نطاق العمل بالعربي" : "Scope tags"} />
          </Field>
          <Field label={ar ? "نطاق العمل بالإنجليزي" : "Scope (English)"} hint={ar ? "افصل بين الوسوم بفاصلة" : "Comma separated"}>
            <TextInput value={form.scope_en} onChange={e => set("scope_en", e.target.value)} dir="ltr" placeholder="Identity Craft, Production" title={ar ? "نطاق العمل بالإنجليزي" : "Scope tags"} />
          </Field>
        </div>

        <Switch
          checked={form.is_featured}
          onChange={v => set("is_featured", v)}
          label={ar ? "عمل مميز" : "Featured Item"}
          description={ar ? "يظهر في الصفحة الرئيسية" : "Shown on homepage"}
        />
      </form>
    </Modal>
  );
}