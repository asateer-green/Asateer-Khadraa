// src/features/dashboard/categories-manager/CategoriesManager.tsx
import { useState, useEffect, type FormEvent } from "react";
import { Plus, Pencil, Trash2, ImageIcon, Upload } from "lucide-react"; // أضفنا أيقونة Upload
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../../../hooks/api/useCategories";
import { useLanguage } from "../../../hooks/ui/useLanguage";
import { Modal } from "../../../components/ui/Modal";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { Field, TextInput } from "../../../components/ui/FormField";
import { SafeImage, EmptyState, ListSkeleton } from "../../../components/ui/SafeImage";
import type { Category } from "../../../types/api.types";

const EMPTY_FORM = { 
  name_ar: "", 
  name_en: "", 
  uploadMode: "file" as "url" | "file", 
  imageFile: null as File | null, 
  image_url: "" 
};
type CategoryForm = typeof EMPTY_FORM;

// ── Add / Edit modal ─────────────────────────────────────────────────────
function CategoryFormModal({
  initial,
  ar,
  onClose,
  onSave,
  isSaving,
}: {
  initial: Category | null;
  ar: boolean;
  onClose: () => void;
  onSave: (data: CategoryForm) => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM);

  useEffect(() => {
    if (initial) {
      setForm({
        name_ar: initial.name_ar,
        name_en: initial.name_en,
        uploadMode: "file", // الوضع الافتراضي عند التعديل هو اختيار ملف
        imageFile: null,
        image_url: initial.image_url ?? "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initial]);

  const set = <K extends keyof CategoryForm>(key: K, value: CategoryForm[K]) => 
    setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name_ar.trim() || !form.name_en.trim()) return;
    if (form.uploadMode === "file" && !form.imageFile && !initial) return;
    if (form.uploadMode === "url" && !form.image_url.trim()) return;
    onSave(form);
  };

  return (
    <Modal
      title={initial ? (ar ? "تعديل التصنيف" : "Edit Category") : (ar ? "تصنيف جديد" : "New Category")}
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
            form="category-form"
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 rounded-xl text-sm font-medium bg-(--primary) text-(--primary-foreground) hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isSaving ? "..." : initial ? (ar ? "حفظ" : "Save") : (ar ? "إضافة" : "Add")}
          </button>
        </>
      }
    >
      <form id="category-form" onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label={ar ? "الاسم بالعربي" : "Name (Arabic)"} required>
            <TextInput
              value={form.name_ar}
              onChange={e => set("name_ar", e.target.value)}
              required
              dir="rtl"
              placeholder="مثال: طباعة"
              title={ar ? "الاسم بالعربي" : "Arabic name"}
            />
          </Field>
          <Field label={ar ? "الاسم بالإنجليزي" : "Name (English)"} required>
            <TextInput
              value={form.name_en}
              onChange={e => set("name_en", e.target.value)}
              required
              dir="ltr"
              placeholder="e.g. Printing"
              title={ar ? "الاسم بالإنجليزي" : "English name"}
            />
          </Field>
        </div>

        {/* أزرار التبديل بين الرفع والرابط الخارجي */}
        <Field label={ar ? "مصدر الصورة" : "Image Source"}>
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

        {/* حقل الإدخال المتغير بحسب اختيار المستخدم */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-(--foreground)">
            {form.uploadMode === "url" ? (ar ? "رابط الصورة" : "Image URL") : (ar ? "ملف الصورة" : "Image File")}
          </label>
          
          {form.uploadMode === "url" ? (
            <TextInput
              value={form.image_url}
              onChange={e => set("image_url", e.target.value)}
              type="url"
              placeholder="https://..."
              title={ar ? "رابط الصورة" : "Image URL"}
            />
          ) : (
            <div className="relative border-2 border-dashed border-(--border) hover:border-(--primary)/50 rounded-xl px-4 py-3 flex items-center gap-2 cursor-pointer transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={e => set("imageFile", e.target.files?.[0] ?? null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Choose image"
              />
              <Upload size={15} className="text-(--muted-foreground) shrink-0" />
              <span className="text-sm text-(--muted-foreground) truncate">
                {form.imageFile ? form.imageFile.name : (ar ? "اختر صورة للملف" : "Choose image file")}
              </span>
            </div>
          )}
        </div>

        {/* المعاينة الحية للصورة */}
        {form.uploadMode === "url" && form.image_url && (
          <SafeImage
            src={form.image_url}
            alt="preview"
            className="mt-2 h-24 w-full object-cover rounded-xl border border-(--border)"
          />
        )}
        {form.uploadMode === "file" && form.image_url && !form.imageFile && (
          <div className="space-y-1">
            <span className="text-xs text-(--muted-foreground)">{ar ? "الصورة الحالية:" : "Current Image:"}</span>
            <SafeImage
              src={form.image_url}
              alt="current"
              className="h-24 w-full object-cover rounded-xl border border-(--border)"
            />
          </div>
        )}
      </form>
    </Modal>
  );
}

// ── Main page ────────────────────────────────────────────────────────────
const CategoriesManager = () => {
  const { language } = useLanguage();
  const ar = language === "ar";

  const { data: categories = [], isLoading } = useCategories();
  const { mutate: create, isPending: isCreating } = useCreateCategory();
  const { mutate: update, isPending: isUpdating } = useUpdateCategory();
  const { mutate: remove, isPending: isDeleting } = useDeleteCategory();

  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const isSaving = isCreating || isUpdating;

  const handleSave = (form: CategoryForm) => {
    const payload = {
      name_ar: form.name_ar,
      name_en: form.name_en,
      imageFile: form.uploadMode === "file" ? form.imageFile : null,
      image_url: form.uploadMode === "url" ? form.image_url : (!form.imageFile && editItem ? editItem.image_url : undefined),
    };

    if (editItem) {
      update({ id: editItem.id, ...payload }, { onSuccess: () => setEditItem(null) });
    } else {
      create(payload, { onSuccess: () => setShowAdd(false) });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-(--foreground)">
            {ar ? "إدارة التصنيفات" : "Categories Manager"}
          </h1>
          <p className="text-sm text-(--muted-foreground) mt-0.5">
            {ar ? `${categories.length} تصنيف` : `${categories.length} categories`}
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-(--primary) text-(--primary-foreground) hover:opacity-90 transition-opacity"
        >
          <Plus size={15} strokeWidth={2.5} />
          {ar ? "إضافة تصنيف" : "Add Category"}
        </button>
      </div>

      {/* List */}
      <div className="rounded-2xl bg-(--card) border border-(--border) overflow-hidden">
        {isLoading ? (
          <ListSkeleton count={4} />
        ) : categories.length === 0 ? (
          <EmptyState message={ar ? "لا توجد تصنيفات بعد" : "No categories yet"} />
        ) : (
          <div className="divide-y divide-(--border)">
            {categories.map(cat => (
              <div
                key={cat.id}
                className="flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-3.5 hover:bg-(--muted)/30 transition-colors group"
              >
                {cat.image_url ? (
                  <SafeImage
                    src={cat.image_url}
                    alt={cat.name_ar}
                    className="w-8 h-8 rounded-lg object-cover border border-(--border) shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-(--primary)/10 flex items-center justify-center shrink-0">
                    <ImageIcon size={14} className="text-(--primary)" />
                  </div>
                )}

                <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-3">
                  <span className="font-medium text-(--foreground) truncate">{cat.name_ar}</span>
                  <span className="hidden sm:inline text-(--muted-foreground) text-sm">·</span>
                  <span className="text-xs sm:text-sm text-(--muted-foreground) truncate">{cat.name_en}</span>
                </div>

                <div className="flex gap-1 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setEditItem(cat)}
                    aria-label={ar ? "تعديل" : "Edit"}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:bg-(--muted) hover:text-(--foreground) transition-colors"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(cat)}
                    aria-label={ar ? "حذف" : "Delete"}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(showAdd || editItem) && (
        <CategoryFormModal
          initial={editItem}
          ar={ar}
          onClose={() => {
            setShowAdd(false);
            setEditItem(null);
          }}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={ar ? "هل تريد حذف هذا التصنيف؟" : "Delete this category?"}
          description={ar ? "الأعمال المرتبطة به لن تُحذف" : "Portfolio items linked to it won't be deleted"}
          confirmLabel={ar ? "حذف" : "Delete"}
          cancelLabel={ar ? "إلغاء" : "Cancel"}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => remove(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default CategoriesManager;