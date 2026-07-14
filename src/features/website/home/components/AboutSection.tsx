import { Link } from "react-router-dom";
import { useLanguageContext } from "../../../../app/providers/LanguageProvider";
import { ROUTES } from "../../../../app/config/routes";
import { Award, Building2, FileCheck, ShieldCheck } from "lucide-react"; // استيراد أيقونات متطابقة وقريبة جداً لشكل الصورة

export function AboutSection() {
  const { t, language } = useLanguageContext();

  const features = [
    {
      id: 1,
      icon: Award,
      text_ar: "الخبرة المتخصصة في تصميم وتصنيع وتركيب اللوحات الإعلانية بمختلف أنواعها وأحجامها.",
      text_en: "Specialized expertise in designing, manufacturing, and installing advertising signage of all types and sizes."
    },
    {
      id: 2,
      icon: Building2,
      text_ar: "نجتهد لتنفيذ مشروع ناجح في مختلف مناطق المملكة العربية السعودية للقطاعين الحكومي والخاص.",
      text_en: "We strive to execute successful projects across various regions of Saudi Arabia for both public and private sectors."
    },
    {
      id: 3,
      icon: FileCheck,
      text_ar: "التزام كامل بكود البناء السعودي SBC والمواصفات القياسية SASO واشتراطات الدفاع المدني والمعايير الدولية.",
      text_en: "Full compliance with the Saudi Building Code (SBC), SASO standards, civil defense regulations, and international metrics."
    },
    {
      id: 4,
      icon: ShieldCheck,
      text_ar: "فريق هندسي متخصص يقدم خدمات التصميم والدراسات الإنشائية والتركيب والصيانة الدورية الشاملة.",
      text_en: "A specialized engineering team providing design, structural studies, installation, and comprehensive routine maintenance."
    }
  ];

  return (
    <section className="w-full py-24 bg-(--color-background) border-b border-(--color-border) transition-smooth" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="container-x max-w-7xl px-6 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* ── النصف الأول: نبذة عن المؤسسة (الكود الحالي الخاص بكِ) ── */}
        <div className="flex flex-col items-start text-start">
          {/* 1. السيرفر الصغير العلوي (Badge/Tag) */}
          <span className="text-sm font-semibold text-(--color-brand) mb-4 tracking-wide uppercase">
            {t("about.badge")}
          </span>

          {/* 2. العنوان الرئيسي الكبير والمميز */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-(--color-foreground) mb-6 leading-tight max-w-xl">
            {t("about.title")}
          </h2>

          {/* 3. النص الوصفي التفصيلي بمحاذاة مريحة للعين */}
          <p className="text-base md:text-lg text-(--color-muted-foreground) max-w-xl mb-8 leading-relaxed font-normal">
            {t("about.description")}
          </p>

          {/* 4. زر الانتقال إلى الخدمات مع السهم الديناميكي حسب اتجاه اللغة */}
          <Link
            to={ROUTES.SERVICES || "#"}
            className="group inline-flex items-center gap-2 font-bold text-sm text-(--color-brand) transition-smooth hover:text-(--color-brand-glow)"
          >
            <span>{t("about.cta")}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 inline-block">
              {language === "ar" ? "←" : "→"}
            </span>
          </Link>
        </div>

        {/* ── النصف الثاني: الجزء المحدد بالأحمر (المميزات والأيقونات الذهبية) ── */}
        <div className="space-y-8 bg-zinc-900/10 dark:bg-zinc-900/40 p-8 rounded-3xl border border-zinc-200/40 dark:border-zinc-800/60 shadow-xs">
          {features.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.id} className="flex items-start gap-4 group">
                
                {/* حاوية الأيقونة بتصميم فخم ومقارب للصورة المعروضة */}
                <div className="shrink-0 w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 flex items-center justify-center text-amber-500 transition-colors group-hover:bg-amber-500/20">
                  <IconComponent className="w-6 h-6 stroke-[1.5]" />
                </div>

                {/* نص المميزة المتناسق والمريح للقراءة */}
                <div className="space-y-1 pt-1">
                  <p className="text-sm md:text-base font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">
                    {language === "ar" ? item.text_ar : item.text_en}
                  </p>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default AboutSection;