// src/features/dashboard/logos-manager/LogosManager.tsx
import { useState, useEffect } from "react";
import { useLanguage } from "../../../hooks/ui/useLanguage";
import { supabase } from "../../../services/supabase/client";

// ── Types ──────────────────────────────────────────────────────────────────
interface Logo {
  id:         number;
  title_ar:   string;
  title_en:   string;
  image_url:  string;
  sort_order: number;
  is_active:  boolean;
}

// ── Main ───────────────────────────────────────────────────────────────────
const LogosManager = () => {
  const { language } = useLanguage();
  const ar = language === "ar";

  const [logos,      setLogos]      = useState<Logo[]>([]);
  const [fetching,   setFetching]   = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [deleteId,   setDeleteId]   = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form
  const [uploadMode,   setUploadMode]   = useState<"file" | "url">("url");
  const [titleAr,      setTitleAr]      = useState("");
  const [titleEn,      setTitleEn]      = useState("");
  const [sortOrder,    setSortOrder]    = useState(0);
  const [imageFile,    setImageFile]    = useState<File | null>(null);
  const [externalUrl,  setExternalUrl]  = useState("");
  const [showForm,     setShowForm]     = useState(false);
  const [error,        setError]        = useState("");
  const [success,      setSuccess]      = useState("");

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchLogos = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("logo_designs")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error && data) setLogos(data);
    setFetching(false);
  };

  useEffect(() => { fetchLogos(); }, []);

  // ── Reset form ───────────────────────────────────────────────────────────
  const resetForm = () => {
    setTitleAr(""); setTitleEn(""); setSortOrder(0);
    setImageFile(null); setExternalUrl("");
    setError(""); setShowForm(false);
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!titleAr.trim() || !titleEn.trim()) {
      setError(ar ? "أدخل اسم الشعار بالعربي والإنجليزي" : "Enter logo name in Arabic and English");
      return;
    }
    if (uploadMode === "file" && !imageFile) {
      setError(ar ? "اختر ملف الصورة" : "Choose an image file");
      return;
    }
    if (uploadMode === "url" && !externalUrl.trim()) {
      setError(ar ? "أدخل رابط الصورة" : "Enter image URL");
      return;
    }

    setSaving(true);
    let imageUrl = "";

    try {
      if (uploadMode === "file" && imageFile) {
        const ext      = imageFile.name.split(".").pop();
        const filePath = `designed-logos/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("logos").upload(filePath, imageFile);
        if (uploadErr) throw new Error(uploadErr.message);
        imageUrl = supabase.storage.from("logos").getPublicUrl(filePath).data.publicUrl;
      } else {
        imageUrl = externalUrl.trim();
      }

      const { error: insertErr } = await supabase.from("logo_designs").insert([{
        title_ar: titleAr.trim(),
        title_en: titleEn.trim(),
        image_url: imageUrl,
        sort_order: Number(sortOrder),
        is_active: true,
      }]);

      if (insertErr) throw new Error(insertErr.message);

      setSuccess(ar ? "تم إضافة الشعار بنجاح ✓" : "Logo added successfully ✓");
      setTimeout(() => setSuccess(""), 3000);
      resetForm();
      fetchLogos();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const { error } = await supabase.from("logo_designs").delete().eq("id", deleteId);
    if (!error) { setDeleteId(null); fetchLogos(); }
    setIsDeleting(false);
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-(--foreground)">
            {ar ? "معرض الشعارات" : "Logos Manager"}
          </h1>
          <p className="text-sm text-(--muted-foreground) mt-0.5">
            {ar ? `${logos.length} شعار` : `${logos.length} logos`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-(--primary) text-(--primary-foreground) hover:opacity-90 transition-opacity"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {showForm
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>
            }
          </svg>
          {showForm ? (ar ? "إلغاء" : "Cancel") : (ar ? "إضافة شعار" : "Add Logo")}
        </button>
      </div>

      {/* Success */}
      {success && (
        <div className="px-4 py-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-sm text-green-700 dark:text-green-400">
          {success}
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <div className="rounded-2xl bg-(--card) border border-(--primary)/30 p-5">
          <h2 className="text-sm font-semibold text-(--foreground) mb-4">
            {ar ? "إضافة شعار جديد" : "Add New Logo"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Titles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-(--foreground)">{ar ? "الاسم بالعربي" : "Name (Arabic)"} *</label>
                <input
                  value={titleAr} onChange={e => setTitleAr(e.target.value)}
                  dir="rtl" title="Arabic name" placeholder="مثال: شعار شركة عقارية"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-(--foreground)">{ar ? "الاسم بالإنجليزي" : "Name (English)"} *</label>
                <input
                  value={titleEn} onChange={e => setTitleEn(e.target.value)}
                  dir="ltr" title="English name" placeholder="Real Estate Logo"
                  className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
                />
              </div>
            </div>

            {/* Upload mode toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-(--foreground)">{ar ? "طريقة إضافة الصورة" : "Image Source"}</label>
              <div className="flex gap-1 p-1 bg-(--muted)/50 rounded-xl w-fit">
                {(["url", "file"] as const).map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setUploadMode(mode)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      uploadMode === mode
                        ? "bg-(--card) text-(--foreground) shadow-sm"
                        : "text-(--muted-foreground) hover:text-(--foreground)"
                    }`}
                  >
                    {mode === "url"
                      ? (ar ? "رابط خارجي" : "External URL")
                      : (ar ? "رفع من الجهاز" : "Upload File")
                    }
                  </button>
                ))}
              </div>
            </div>

            {/* Image input */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-(--foreground)">{ar ? "الترتيب" : "Order"}</label>
                <input
                  type="number" min={0} value={sortOrder}
                  onChange={e => setSortOrder(Number(e.target.value))}
                  title={ar ? "ترتيب العرض" : "Sort order"}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-sm font-medium text-(--foreground)">
                  {uploadMode === "url" ? (ar ? "رابط الصورة" : "Image URL") : (ar ? "ملف الصورة" : "Image File")}
                </label>
                {uploadMode === "url" ? (
                  <input
                    type="url" value={externalUrl}
                    onChange={e => setExternalUrl(e.target.value)}
                    dir="ltr" title="Image URL" placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
                  />
                ) : (
                  <div className="relative border-2 border-dashed border-(--border) hover:border-(--primary)/50 rounded-xl px-4 py-2.5 flex items-center gap-2 cursor-pointer transition-colors">
                    <input
                      type="file" accept="image/*"
                      onChange={e => setImageFile(e.target.files?.[0] ?? null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      title="Choose image"
                    />
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-(--muted-foreground) shrink-0">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span className="text-sm text-(--muted-foreground) truncate">
                      {imageFile ? imageFile.name : (ar ? "اختر صورة" : "Choose image")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Preview */}
            {(uploadMode === "url" && externalUrl) && (
              <img src={externalUrl} alt="preview" className="h-24 rounded-xl object-contain border border-(--border) bg-(--muted)/30 p-2"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            )}

            {/* Error */}
            {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}

            {/* Actions */}
            <div className="flex gap-2 justify-end pt-1">
              <button type="button" onClick={resetForm} className="px-4 py-2 rounded-xl text-sm text-(--muted-foreground) hover:bg-(--muted) transition-colors">
                {ar ? "إلغاء" : "Cancel"}
              </button>
              <button type="submit" disabled={saving}
                className="px-5 py-2 rounded-xl text-sm font-medium bg-(--primary) text-(--primary-foreground) hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2">
                {saving && (
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                )}
                {saving ? (ar ? "جاري الحفظ..." : "Saving...") : (ar ? "حفظ ونشر" : "Save & Publish")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid */}
      <div className="rounded-2xl bg-(--card) border border-(--border) overflow-hidden">
        <div className="px-5 py-4 border-b border-(--border)">
          <h2 className="text-sm font-semibold text-(--foreground)">{ar ? "الشعارات الحالية" : "Current Logos"}</h2>
        </div>

        {fetching ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-(--muted) animate-pulse" />
            ))}
          </div>
        ) : logos.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-(--muted-foreground)">{ar ? "لا توجد شعارات بعد" : "No logos yet"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-5">
            {logos.map(logo => (
              <div key={logo.id} className="group relative aspect-square rounded-2xl border border-(--border) bg-(--muted)/20 p-3 flex flex-col items-center justify-center hover:border-(--primary)/40 transition-colors">
                <img
                  src={logo.image_url} alt={logo.title_ar}
                  className="max-h-full max-w-full object-contain"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <span className="text-xs text-(--muted-foreground) mt-2 truncate w-full text-center">
                  {ar ? logo.title_ar : logo.title_en}
                </span>
                <button
                  onClick={() => setDeleteId(logo.id)}
                  aria-label={ar ? "حذف" : "Delete"}
                  className="absolute top-2 inset-e-2 w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && setDeleteId(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-(--card) border border-(--border) p-6 space-y-4 shadow-xl">
            <p className="text-center font-semibold text-(--foreground)">{ar ? "هل تريد حذف هذا الشعار؟" : "Delete this logo?"}</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 rounded-xl text-sm text-(--muted-foreground) hover:bg-(--muted) transition-colors">{ar ? "إلغاء" : "Cancel"}</button>
              <button onClick={handleDelete} disabled={isDeleting} className="flex-1 py-2 rounded-xl text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50">
                {isDeleting ? "..." : ar ? "حذف" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogosManager;