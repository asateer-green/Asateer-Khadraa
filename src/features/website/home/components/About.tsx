import { Link } from "react-router-dom";
import { useLanguageContext } from "../../../../app/providers/LanguageProvider";
import { ROUTES } from "../../../../app/config/routes";
import { Award, Building2, ShieldCheck } from "lucide-react";
import heroImage from "../../../../assets/logos/logoweb.png";

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
      icon: ShieldCheck,
      text_ar: "فريق هندسي متخصص يقدم خدمات التصميم والدراسات الإنشائية والتركيب والصيانة الدورية الشاملة.",
      text_en: "A specialized engineering team providing design, structural studies, installation, and comprehensive routine maintenance."
    }
  ];

  return (
    <section 
      className="relative w-full py-24 bg-(--color-background) border-b border-(--color-border) transition-smooth overflow-hidden" 
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* 1. طبقة الجراديانت الخلفية */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, color-mix(in oklab, var(--color-primary) 20%, transparent) 0%, transparent 65%), linear-gradient(180deg, color-mix(in oklab, var(--color-background) 100%, transparent) 0%, color-mix(in oklab, var(--color-primary) 8%, var(--color-background)) 100%)",
        }}
      />

      {/* 2. شبكة Grid Pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--color-foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 85%)",
        }}
      />

      {/* 3. إضاءات خلفية متوهجة (Ambient Glows) */}
      <div
        className="absolute -top-20 -left-20 w-md h-112 rounded-full pointer-events-none z-0 blur-3xl opacity-80"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-primary) 35%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-20 -right-20 w-md h-112 rounded-full pointer-events-none z-0 blur-3xl opacity-70"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-brand, var(--color-primary)) 30%, transparent) 0%, transparent 70%)",
        }}
      />

      {/* 4. الصورة الديكورية الخلفية */}
      <div className="absolute top-1/5 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none w-full max-w-3xl flex justify-center items-center px-4">
        <img
          src={heroImage}
          alt="Decorative Background"
          className="w-full h-auto max-h-[65vh] object-contain pointer-events-none opacity-[0.22] dark:opacity-[0.14] transition-opacity"
        />
      </div>

      {/* 5. المحتوى الرئيسي لسكشن من نحن */}
      <div className="container-x relative z-10 max-w-7xl px-6 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* ── النصف الأول: نبذة عن المؤسسة ── */}
        <div className="flex flex-col items-start text-start">
          <span className="text-sm font-semibold text-(--color-brand) mb-4 tracking-wide uppercase">
            {t("about.badge")}
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-(--color-foreground) mb-6 leading-tight max-w-xl">
            {t("about.title")}
          </h2>

          <p className="text-base md:text-lg text-(--color-muted-foreground) max-w-xl mb-8 leading-relaxed font-normal">
            {t("about.description")}
          </p>

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

        {/* ── النصف الثاني: كل ميزة داخل حاوية (Card) منفصلة ── */}
        <div className="space-y-4">
          {features.map((item) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={item.id} 
                className="flex items-start gap-4 p-6 rounded-2xl bg-zinc-900/10 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/40 dark:border-zinc-800/60 shadow-xs hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-0.5 group"
              >
                {/* حاوية الأيقونة */}
                <div className="shrink-0 w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 flex items-center justify-center text-amber-500 transition-colors group-hover:bg-amber-500/20">
                  <IconComponent className="w-6 h-6 stroke-[1.5]" />
                </div>

                {/* نص المميزة */}
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