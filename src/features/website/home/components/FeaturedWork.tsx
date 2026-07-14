import { useLanguageContext } from "../../../../app/providers/LanguageProvider";
import { usePortfolio } from "../../../../hooks/api/usePortfolio";

export function FeaturedWork() {
  const { data: dbProjects, isLoading } = usePortfolio();
  const { language } = useLanguageContext(); // لمعرفة اللغة الحالية ar أو en

  // تصفية المشاريع لعرض التي تم تفعيل زر "عمل مميز" لها فقط
  const featuredProjects = dbProjects
    ? dbProjects.filter(
        (p: any) => p.is_featured === true && p.is_active !== false,
      )
    : [];

  return (
    <section className="py-16 container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {language === "ar" ? "أعمالنا المميزة" : "Our Featured Work"}
      </h2>

      {isLoading ? (
        <div className="text-center text-zinc-500">جاري التحميل...</div>
      ) : featuredProjects.length === 0 ? (
        <div className="text-center text-zinc-500">
          لا توجد أعمال مميزة مفعّلة حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project: any) => (
            <div
              key={project.id}
              className="border rounded-2xl overflow-hidden bg-card shadow-sm"
            >
              <img
                src={project.image_url}
                alt={language === "ar" ? project.title_ar : project.title_en}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">
                  {language === "ar" ? project.title_ar : project.title_en}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
