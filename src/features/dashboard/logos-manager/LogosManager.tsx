// src/features/dashboard/logos-manager/LogosManager.tsx
import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react"; // أضفنا Edit2
import { useLogos, useCreateLogo, useDeleteLogo, useUpdateLogo } from "../../../hooks/api/useLogos"; // افترضنا وجود useUpdateLogo
import { useLanguage } from "../../../hooks/ui/useLanguage";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { SafeImage, EmptyState, GridSkeleton } from "../../../components/ui/SafeImage";
import { LogoFormModal } from "./LogoFormModal"; // استيراد المودال الجديد المنفصل
import type { Logo } from "../../../types/api.types";

const LogosManager = () => {
  const { language } = useLanguage();
  const ar = language === "ar";

  const { data: logos = [], isLoading } = useLogos();
  const { mutate: createLogo, isPending: isCreating } = useCreateLogo();
  const { mutate: updateLogo, isPending: isUpdating } = useUpdateLogo(); // هوك التعديل
  const { mutate: deleteLogo, isPending: isDeleting } = useDeleteLogo();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Logo | null>(null); // حالة الشعار المراد تعديله
  const [deleteTarget, setDeleteTarget] = useState<Logo | null>(null);
  const [error, setError] = useState("");

  const handleSave = (form: any) => {
    setError("");
    
    const payload = {
      title_ar: form.titleAr,
      title_en: form.titleEn,
      sort_order: form.sortOrder,
      imageFile: form.uploadMode === "file" ? form.imageFile : null,
      imageUrl: form.uploadMode === "url" ? form.externalUrl : undefined,
    };

    if (editTarget) {
      // حالة التعديل
      updateLogo(
        { id: editTarget.id, ...payload },
        {
          onSuccess: () => { setEditTarget(null); setShowForm(false); },
          onError: (e: unknown) => setError(e instanceof Error ? e.message : String(e)),
        }
      );
    } else {
      // حالة الإضافة
      createLogo(
        payload,
        {
          onSuccess: () => setShowForm(false),
          onError: (e: unknown) => setError(e instanceof Error ? e.message : String(e)),
        }
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-(--foreground)">{ar ? "معرض الشعارات" : "Logos Manager"}</h1>
          <p className="text-sm text-(--muted-foreground) mt-0.5">{ar ? `${logos.length} شعار` : `${logos.length} logos`}</p>
        </div>
        <button
          onClick={() => { setError(""); setEditTarget(null); setShowForm(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-(--primary) text-(--primary-foreground) hover:opacity-90 transition-opacity"
        >
          <Plus size={15} strokeWidth={2.5} />
          {ar ? "إضافة شعار" : "Add Logo"}
        </button>
      </div>

      <div className="rounded-2xl bg-(--card) border border-(--border) overflow-hidden">
        <div className="px-5 py-4 border-b border-(--border)">
          <h2 className="text-sm font-semibold text-(--foreground)">{ar ? "الشعارات الحالية" : "Current Logos"}</h2>
        </div>

        {isLoading ? (
          <div className="p-5"><GridSkeleton count={4} /></div>
        ) : logos.length === 0 ? (
          <EmptyState message={ar ? "لا توجد شعارات بعد" : "No logos yet"} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-5">
            {logos.map(logo => (
              <div key={logo.id} className="group relative aspect-square rounded-2xl border border-(--border) bg-(--muted)/20 p-3 flex flex-col items-center justify-center hover:border-(--primary)/40 transition-colors">
                <SafeImage src={logo.image_url} alt={logo.title_ar} className="max-h-full max-w-full object-contain" />
                <span className="text-xs text-(--muted-foreground) mt-2 truncate w-full text-center">
                  {ar ? logo.title_ar : logo.title_en}
                </span>
                
                {/* أزرار التحكم (تعديل وحذف) */}
                <div className="absolute top-2 inset-e-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
                  {/* زر التعديل */}
                  <button
                    onClick={() => { setError(""); setEditTarget(logo); setShowForm(true); }}
                    aria-label={ar ? "تعديل" : "Edit"}
                    className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"
                  >
                    <Edit2 size={13} />
                  </button>
                  
                  {/* زر الحذف */}
                  <button
                    onClick={() => setDeleteTarget(logo)}
                    aria-label={ar ? "حذف" : "Delete"}
                    className="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* مودال الإضافة والتعديل المشترك */}
      {showForm && (
        <LogoFormModal
          ar={ar}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
          onSave={handleSave}
          isSaving={isCreating || isUpdating}
          error={error}
          editData={editTarget}
        />
      )}

      {/* حوار تأكيد الحذف الجاهز */}
      {deleteTarget && (
        <ConfirmDialog
          title={ar ? "هل تريد حذف هذا الشعار؟" : "Delete this logo?"}
          confirmLabel={ar ? "حذف" : "Delete"}
          cancelLabel={ar ? "إلغاء" : "Cancel"}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => deleteLogo(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default LogosManager;