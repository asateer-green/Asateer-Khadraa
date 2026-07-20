// src/features/dashboard/signage-manager/SignageManager.tsx
import { useState } from "react";
import { Plus, Pencil, Trash2, ImageIcon, MapPin } from "lucide-react";
import {
  useSignage,
  useCreateSignage,
  useUpdateSignage,
  useDeleteSignage,
} from "../../../hooks/api/useSignage";
import { useLanguage } from "../../../hooks/ui/useLanguage";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { GridSkeleton } from "../../../components/ui/SafeImage";
import type { SignageItem } from "../../../types/api.types";

import { SignageModal, type SignageForm } from "./SignageModal";
import { SignagePreviewModal, type SignagePreview } from "./SignagePreviewModal";
import { toList, type SignageItemExtended } from "./signageTransforms";

// ── Save payload builder ──────────────────────────────────────────────────
// نفس منطق buildSavePayload في PortfolioManager.tsx بالحرف، عشان الحفظ يتصرف
// بنفس الطريقة تماماً ويوصل للعرض على الموقع بنفس الآلية.
function buildSavePayload(data: SignageForm, currentImageUrl?: string) {
  return {
    title_ar: data.title_ar,
    title_en: data.title_en,
    location: data.location,
    description_ar: data.description_ar,
    description_en: data.description_en,
    client: data.client,
    year: data.year,
    is_active: data.is_active,
    scope_ar: toList(data.scope_ar),
    scope_en: toList(data.scope_en),
    imageFile: data.uploadMode === "file" ? data.imageFile : null,
    image_url: data.uploadMode === "url" ? data.image_url : (currentImageUrl || undefined),
    galleryItems: data.galleryItems,
  };
}

// ── Preview data builder ──────────────────────────────────────────────────
function buildPreview(item: SignageItemExtended, ar: boolean): SignagePreview {
  const description = ar ? item.description_ar : item.description_en;
  const scope = toList(ar ? item.scope_ar : item.scope_en);

  let gallery = toList(item.gallery ?? item.images);
  if (item.image_url) {
    gallery = [item.image_url, ...gallery.filter(url => url !== item.image_url)];
  }

  return {
    title: ar ? item.title_ar : item.title_en,
    tag: item.location || (ar ? "لوحة إعلانية" : "Signage"),
    description: description?.trim()
      ? description
      : ar
        ? "لم يتم إضافة تفاصيل عن اللوحة بعد."
        : "No signage details have been added yet.",
    client: item.client || "—",
    year: item.year || "—",
    scope,
    gallery,
  };
}

// ── Main page ──────────────────────────────────────────────────────────────
const SignageManager = () => {
  const { language } = useLanguage();
  const ar = language === "ar";

  const { data: items = [], isLoading, isError } = useSignage();
  const { mutate: createItem, isPending: isCreating } = useCreateSignage();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateSignage();
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteSignage();

  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<SignageItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SignageItem | null>(null);
  const [previewItem, setPreviewItem] = useState<SignagePreview | null>(null);
  const [filter, setFilter] = useState<"all" | "active">("all");

  const isSaving = isCreating || isUpdating;
  const filtered = filter === "active" ? items.filter(i => i.is_active) : items;

  const handleSave = (data: SignageForm) => {
    const payload = buildSavePayload(data, editItem?.image_url);
    if (editItem) {
      updateItem({ id: editItem.id, ...payload }, { onSuccess: () => setEditItem(null) });
    } else {
      createItem(payload, { onSuccess: () => setShowAdd(false) });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
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

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-(--muted)/50 rounded-xl w-fit">
        {[{ key: "all" as const, ar: "الكل", en: "All" }, { key: "active" as const, ar: "النشطة", en: "Active" }].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key ? "bg-(--card) text-(--foreground) shadow-sm" : "text-(--muted-foreground) hover:text-(--foreground)"
            }`}
          >
            {tab[language as "ar" | "en"]}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <GridSkeleton count={8} />
      ) : isError ? (
        <p className="text-center text-sm text-(--muted-foreground) py-12">{ar ? "تعذّر تحميل اللوحات" : "Could not load signage"}</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <p className="text-(--muted-foreground)">{ar ? "لا توجد لوحات بعد" : "No signage yet"}</p>
          <button onClick={() => setShowAdd(true)} className="text-sm text-(--primary) hover:underline">
            {ar ? "أضف أول لوحة" : "Add your first signage"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(item => (
            <div
              key={item.id}
              onClick={() => setPreviewItem(buildPreview(item as SignageItemExtended, ar))}
              className="group relative rounded-2xl overflow-hidden border border-(--border) bg-(--card) aspect-square cursor-pointer transition-all duration-300 hover:border-emerald-500/30"
            >
              {item.image_url ? (
                <img src={item.image_url} alt={ar ? item.title_ar : item.title_en} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-(--muted)">
                  <ImageIcon size={32} className="text-(--muted-foreground)" />
                </div>
              )}

              {item.is_active && (
                <div className="absolute top-2 inset-s-2 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30 z-10" title={ar ? "نشطة" : "Active"} />
              )}

              <div className="absolute inset-0 bg-black/40 sm:bg-black/60 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 sm:p-3 z-20">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={e => { e.stopPropagation(); setEditItem(item); }}
                    aria-label={ar ? "تعديل" : "Edit"}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setDeleteTarget(item); }}
                    aria-label={ar ? "حذف" : "Delete"}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div>
                  <p className="text-white text-xs sm:text-sm font-medium truncate">{ar ? item.title_ar : item.title_en}</p>
                  {item.location && (
                    <p className="text-white/70 text-[10px] sm:text-xs truncate flex items-center gap-1">
                      <MapPin size={10} className="shrink-0" /> {item.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showAdd || editItem) && (
        <SignageModal
          initial={editItem as SignageItemExtended ?? undefined}
          ar={ar}
          onClose={() => { setShowAdd(false); setEditItem(null); }}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={ar ? "حذف اللوحة" : "Delete Signage"}
          description={ar ? `هل تريد حذف "${deleteTarget.title_ar}"؟` : `Delete "${deleteTarget.title_en}"?`}
          confirmLabel={ar ? "حذف" : "Delete"}
          cancelLabel={ar ? "إلغاء" : "Cancel"}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteItem(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })}
          isLoading={isDeleting}
        />
      )}

      {previewItem && <SignagePreviewModal item={previewItem} ar={ar} onClose={() => setPreviewItem(null)} />}
    </div>
  );
};

export default SignageManager;