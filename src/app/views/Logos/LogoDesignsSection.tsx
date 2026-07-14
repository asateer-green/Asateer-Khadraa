import { useLanguageContext } from "../../providers/LanguageProvider";
import { useLogoDesigns } from "../../../hooks/api/useLogoDesigns"; // استدعاء الهوك الذي أنشأناه بالخطوة 1
import { Palette } from "lucide-react";

import logo1 from "../../../assets/logos/logo1.png";
import logo2 from "../../../assets/logos/logo2.png";
import logo3 from "../../../assets/logos/logo3.png";
import logo4 from "../../../assets/logos/logo4.png";

// شعارات افتراضية لحماية التصميم لو كانت قاعدة البيانات فارغة تماماً في البداية
const fallbackDesigns = [
  { id: 1, title_ar: "شعار شركة عقارية", title_en: "Real Estate Logo", image_url: logo1 },
  { id: 2, title_ar: "شعار تطبيق تقني", title_en: "Tech App Logo", image_url: logo2 },
  { id: 3, title_ar: "شعار مطعم عصري", title_en: "Modern Restaurant Logo", image_url: logo3 },
  { id: 4, title_ar: "شعار متجر إلكتروني", title_en: "E-commerce Store Logo", image_url: logo4 },
];

export function LogoDesignsSection() {
  const { language } = useLanguageContext();
  const { data: dbDesigns, isLoading } = useLogoDesigns();

  // إذا نجح السيرفر في جلب بيانات نستخدمها، وإلا نعتمد على الكروت الاحتياطية الثابتة ليبقى الموقع فخماً
  const designsItems = dbDesigns && dbDesigns.length > 0 ? dbDesigns : fallbackDesigns;

  if (isLoading) return null; // إخفاء القسم تماماً حتى ينتهي التحميل

  return (
    <section className="w-full py-24 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/10">
      <div className="container-x max-w-7xl px-6 mx-auto">
        
        {/* مقدمة وعنوان القسم */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="flex h-12 w-12 place-items-center justify-center rounded-2xl bg-(--color-brand) shadow-[0_0_20px_rgba(0,229,147,0.25)] mb-4">
            <Palette className="h-5 w-5 text-emerald-950" />
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tight mb-4">
            {language === "ar" ? "إبداعاتنا في تصميم الشعارات" : "Our Logo Design Masterpieces"}
          </h2>
          <p className="max-w-2xl text-sm md:text-base text-(--color-muted-foreground) font-normal">
            {language === "ar" 
              ? "نبتكر هويات بصرية وشعارات فريدة تروي قصة علامتك التجارية وتترك انطباعاً ينبض بالتميز." 
              : "We craft unique visual identities and logos that tell your brand's story beautifully."}
          </p>
        </div>

        {/* شبكة عرض كروت الشعارات التفاعلية */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {designsItems.map((item: any, i: number) => (
            <div 
              key={item.id || i}
              className="group relative aspect-square overflow-hidden rounded-3xl border border-(--color-border) bg-(--color-surface) p-6 flex flex-col justify-between shadow-xs hover:shadow-xl hover:border-emerald-500/20 transition-all duration-500"
            >
              <div className="w-full h-full rounded-2xl bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center overflow-hidden relative">
                <img 
                  src={item.image_url} 
                  alt={language === "ar" ? item.title_ar : item.title_en}
                  loading="lazy"
                  className="max-h-[75%] max-w-[75%] object-contain transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackDesigns[i % fallbackDesigns.length].image_url;
                  }}
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-(--color-brand) transition-colors">
                  {language === "ar" ? item.title_ar : item.title_en}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default LogoDesignsSection;