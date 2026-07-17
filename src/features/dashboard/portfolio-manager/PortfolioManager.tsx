// src/features/dashboard/portfolio-manager/PortfolioManager.tsx
import { useState } from "react";
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
import {
  usePortfolio,
  useCreatePortfolio,
  useUpdatePortfolio,
  useDeletePortfolio,
} from "../../../hooks/api/usePortfolio";
import { useLanguage } from "../../../hooks/ui/useLanguage";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { GridSkeleton } from "../../../components/ui/SafeImage";
import type { PortfolioItem } from "../../../types/api.types";

import { PortfolioModal, type PortfolioForm } from "./PortfolioModal";
import { PortfolioPreviewModal, type PortfolioPreview } from "./PortfolioPreviewModal";
import { toList, type PortfolioItemExtended } from "./portfolioTransforms";

// ── Save payload builder ──────────────────────────────────────────────────
function buildSavePayload(data: PortfolioForm, currentImageUrl?: string) {
  return {
    title_ar: data.title_ar,
    title_en: data.title_en,
    category_id: data.category_id || undefined,
    description_ar: data.description_ar,
    description_en: data.description_en,
    client: data.client,
    year: data.year,
    is_featured: data.is_featured,
    scope_ar: toList(data.scope_ar),
    scope_en: toList(data.scope_en),
    imageFile: data.uploadMode === "file" ? data.imageFile : null,
    image_url: data.uploadMode === "url" ? data.image_url : (currentImageUrl || undefined),
    galleryItems: data.galleryItems,
  };
}

// ── Preview data builder ──────────────────────────────────────────────────
function buildPreview(item: PortfolioItemExtended, ar: boolean): PortfolioPreview {
  const description = ar ? item.description_ar : item.description_en;
  const scope = toList(ar ? item.scope_ar : item.scope_en);

  let gallery = toList(item.gallery ?? item.images);
  if (item.image_url) {
    gallery = [item.image_url, ...gallery.filter(url => url !== item.image_url)];
  }

  return {
    title: ar ? item.title_ar : item.title_en,
    category: item.category_id || (ar ? "معرض الأعمال" : "Portfolio Showcase"),
    description: description?.trim()
      ? description
      : ar
        ? "لم يتم إضافة تفاصيل عن المشروع بعد."
        : "No project details have been added yet.",
    client: item.client || "—",
    year: item.year || "—",
    scope,
    gallery,
  };
}

// ── Main page ──────────────────────────────────────────────────────────────
const PortfolioManager = () => {
  const { language } = useLanguage();
  const ar = language === "ar";

  const { data: items = [], isLoading, isError } = usePortfolio();
  const { mutate: createItem, isPending: isCreating } = useCreatePortfolio();
  const { mutate: updateItem, isPending: isUpdating } = useUpdatePortfolio();
  const { mutate: deleteItem, isPending: isDeleting } = useDeletePortfolio();

  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<PortfolioItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioItem | null>(null);
  const [previewItem, setPreviewItem] = useState<PortfolioPreview | null>(null);
  const [filter, setFilter] = useState<"all" | "featured">("all");

  const isSaving = isCreating || isUpdating;
  const filtered = filter === "featured" ? items.filter(i => i.is_featured) : items;

  const handleSave = (data: PortfolioForm) => {
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
          <h1 className="text-xl font-bold text-(--foreground)">{ar ? "إدارة الأعمال" : "Portfolio Manager"}</h1>
          <p className="text-sm text-(--muted-foreground) mt-0.5">{ar ? `${items.length} عمل` : `${items.length} items`}</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-(--primary) text-(--primary-foreground) hover:opacity-90 transition-opacity"
        >
          <Plus size={15} strokeWidth={2.5} />
          {ar ? "إضافة عمل" : "Add Item"}
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-(--muted)/50 rounded-xl w-fit">
        {[{ key: "all" as const, ar: "الكل", en: "All" }, { key: "featured" as const, ar: "المميزة", en: "Featured" }].map(tab => (
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
        <p className="text-center text-sm text-(--muted-foreground) py-12">{ar ? "تعذّر تحميل الأعمال" : "Could not load portfolio"}</p>
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
              onClick={() => setPreviewItem(buildPreview(item as PortfolioItemExtended, ar))}
              className="group relative rounded-2xl overflow-hidden border border-(--border) bg-(--card) aspect-square cursor-pointer transition-all duration-300 hover:border-emerald-500/30"
            >
              {item.image_url ? (
                <img src={item.image_url} alt={ar ? item.title_ar : item.title_en} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-(--muted)">
                  <ImageIcon size={32} className="text-(--muted-foreground)" />
                </div>
              )}

              {item.is_featured && (
                <div className="absolute top-2 inset-s-2 px-2 py-0.5 rounded-full bg-amber-400 text-amber-900 text-xs font-bold z-10">★</div>
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
                <p className="text-white text-xs sm:text-sm font-medium truncate">{ar ? item.title_ar : item.title_en}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {(showAdd || editItem) && (
        <PortfolioModal
          initial={editItem as PortfolioItemExtended ?? undefined}
          ar={ar}
          onClose={() => { setShowAdd(false); setEditItem(null); }}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={ar ? "حذف العمل" : "Delete Item"}
          description={ar ? `هل تريد حذف "${deleteTarget.title_ar}"؟` : `Delete "${deleteTarget.title_en}"?`}
          confirmLabel={ar ? "حذف" : "Delete"}
          cancelLabel={ar ? "إلغاء" : "Cancel"}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteItem(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })}
          isLoading={isDeleting}
        />
      )}

      {previewItem && <PortfolioPreviewModal item={previewItem} ar={ar} onClose={() => setPreviewItem(null)} />}
    </div>
  );
};

export default PortfolioManager;