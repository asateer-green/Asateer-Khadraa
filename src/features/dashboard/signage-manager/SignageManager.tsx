// src/features/dashboard/signage-manager/SignageManager.tsx
import { useState, type FormEvent } from "react";
import { Plus, Pencil, Trash2, MapPin, Image as ImageIcon } from "lucide-react";
import {
  useSignage,
  useCreateSignage,
  useUpdateSignage,
  useDeleteSignage,
} from "../../../hooks/api/useSignage";
import { useLanguage } from "../../../hooks/ui/useLanguage";
import { Modal } from "../../../components/ui/Modal";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { Field, TextInput } from "../../../components/ui/FormField";
import { Switch } from "../../../components/ui/Switch";
import { SafeImage, EmptyState, ListSkeleton } from "../../../components/ui/SafeImage";
import type { SignageItem } from "../../../types/api.types";

const EMPTY_FORM = { title_ar: "", title_en: "", location: "", image_url: "", is_active: true };
type SignageForm = typeof EMPTY_FORM;

// ── Add / Edit modal ─────────────────────────────────────────────────────
function SignageFormModal({
  initial,
  ar,
  onClose,
  onSave,
  isSaving,
}: {
  initial: SignageItem | null;
  ar: boolean;
  onClose: () => void;
  onSave: (data: SignageForm) => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<SignageForm>(
    initial
      ? {
          title_ar: initial.title_ar,
          title_en: initial.title_en,
          location: initial.location ?? "",
          image_url: initial.image_url ?? "",
          is_active: initial.is_active,
        }
      : EMPTY_FORM,
  );
  const set = <K extends keyof SignageForm>(key: K, value: SignageForm[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title_ar.trim() || !form.title_en.trim()) return;
    onSave(form);
  };

  return (
    <Modal
      title={initial ? (ar ? "تعديل اللوحة" : "Edit Signage") : (ar ? "إضافة لوحة" : "Add Signage")}
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
            form="signage-form"
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 rounded-xl text-sm font-medium bg-(--primary) text-(--primary-foreground) hover:opacity-90 disabled:opacity-50"
          >
            {isSaving ? "..." : initial ? (ar ? "حفظ" : "Save") : (ar ? "إضافة" : "Add")}
          </button>
        </>
      }
    >
      <form id="signage-form" onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label={ar ? "الاسم بالعربي" : "Name (AR)"} required>
            <TextInput value={form.title_ar} onChange={e => set("title_ar", e.target.value)} required dir="rtl" placeholder="اسم اللوحة" title="Arabic name" />
          </Field>
          <Field label={ar ? "الاسم بالإنجليزي" : "Name (EN)"} required>
            <TextInput value={form.title_en} onChange={e => set("title_en", e.target.value)} required dir="ltr" placeholder="Signage name" title="English name" />
          </Field>
        </div>

        <Field label={ar ? "الموقع / المكان" : "Location"}>
          <TextInput
            value={form.location}
            onChange={e => set("location", e.target.value)}
            placeholder={ar ? "مثال: الرياض، حي العليا" : "e.g. Riyadh, Al-Olaya"}
            title="Location"
          />
        </Field>

        <Field label={ar ? "رابط الصورة" : "Image URL"}>
          <TextInput value={form.image_url} onChange={e => set("image_url", e.target.value)} type="url" placeholder="https://..." title="Image URL" />
          {form.image_url && (
            <SafeImage src={form.image_url} alt="preview" className="mt-2 h-36 w-full object-cover rounded-xl border border-(--border)" />
          )}
        </Field>

        <Switch
          checked={form.is_active}
          onChange={v => set("is_active", v)}
          label={ar ? "نشطة" : "Active"}
        />
      </form>
    </Modal>
  );
}

// ── Main page ────────────────────────────────────────────────────────────
const SignageManager = () => {
  const { language } = useLanguage();
  const ar = language === "ar";

  const { data: items = [], isLoading } = useSignage();
  const { mutate: create, isPending: isCreating } = useCreateSignage();
  const { mutate: update, isPending: isUpdating } = useUpdateSignage();
  const { mutate: remove, isPending: isDeleting } = useDeleteSignage();

  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<SignageItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SignageItem | null>(null);

  const isSaving = isCreating || isUpdating;

  const handleSave = (data: SignageForm) => {
    if (editItem) {
      update({ id: editItem.id, ...data }, { onSuccess: () => setEditItem(null) });
    } else {
      create(data, { onSuccess: () => setShowAdd(false) });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-(--foreground)">{ar ? "إدارة اللوحات" : "Signage Manager"}</h1>
          <p className="text-sm text-(--muted-foreground) mt-0.5">{ar ? `${items.length} لوحة` : `${items.length} items`}</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-(--primary) text-(--primary-foreground) hover:opacity-90 transition-opacity"
        >
          <Plus size={15} strokeWidth={2.5} />
          {ar ? "إضافة لوحة" : "Add Signage"}
        </button>
      </div>

      <div className="rounded-2xl bg-(--card) border border-(--border) overflow-hidden">
        {isLoading ? (
          <ListSkeleton count={3} rowClassName="h-16" />
        ) : items.length === 0 ? (
          <EmptyState
            message={ar ? "لا توجد لوحات بعد" : "No signage yet"}
            actionLabel={ar ? "أضف أول لوحة" : "Add your first signage"}
            onAction={() => setShowAdd(true)}
          />
        ) : (
          <div className="divide-y divide-(--border)">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-3 sm:py-4 hover:bg-(--muted)/30 transition-colors group">
                {item.image_url ? (
                  <SafeImage src={item.image_url} alt={item.title_ar} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-(--border) shrink-0" />
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-(--muted) flex items-center justify-center shrink-0">
                    <ImageIcon size={20} className="text-(--muted-foreground)" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-(--foreground) truncate text-sm sm:text-base">{ar ? item.title_ar : item.title_en}</p>
                  {item.location && (
                    <p className="text-xs text-(--muted-foreground) truncate flex items-center gap-1">
                      <MapPin size={11} className="shrink-0" /> {item.location}
                    </p>
                  )}
                  <span
                    className={`sm:hidden inline-flex mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      item.is_active
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-(--muted) text-(--muted-foreground)"
                    }`}
                  >
                    {item.is_active ? (ar ? "نشطة" : "Active") : (ar ? "مخفية" : "Hidden")}
                  </span>
                </div>

                <span
                  className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                    item.is_active
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-(--muted) text-(--muted-foreground)"
                  }`}
                >
                  {item.is_active ? (ar ? "نشطة" : "Active") : (ar ? "مخفية" : "Hidden")}
                </span>

                <div className="flex gap-1 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditItem(item)} aria-label={ar ? "تعديل" : "Edit"} className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:bg-(--muted) hover:text-(--foreground) transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteTarget(item)} aria-label={ar ? "حذف" : "Delete"} className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(showAdd || editItem) && (
        <SignageFormModal
          initial={editItem}
          ar={ar}
          onClose={() => { setShowAdd(false); setEditItem(null); }}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={ar ? "هل تريد حذف هذه اللوحة؟" : "Delete this signage item?"}
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

export default SignageManager;