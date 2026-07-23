import { Link } from "react-router-dom";
import { useLanguageContext } from "../../../../app/providers/LanguageProvider";
import { ROUTES } from "../../../../app/config/routes";
import heroImage from "../../../../assets/logos/logoweb.png";

export function Hero() {
  const { t, language } = useLanguageContext();
  const isAr = language === "ar";

  return (
    <section className="relative min-h-[92vh] w-full overflow-hidden flex items-center justify-center text-center border-b border-(--color-border) bg-(--color-background) py-16 md:py-24">
      {/* 1. طبقة الجراديانت الخلفية - تم زيادة وضوح الإضاءة */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, color-mix(in oklab, var(--color-primary) 20%, transparent) 0%, transparent 65%), linear-gradient(180deg, color-mix(in oklab, var(--color-background) 100%, transparent) 0%, color-mix(in oklab, var(--color-primary) 8%, var(--color-background)) 100%)",
        }}
      />

      {/* 2. شبكة Grid Pattern - تم رفع الـ Opacity لـ 0.08 لتكون أوقع وأوضح */}
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

      {/* 3. إضاءات خلفية متوهجة (Ambient Glows) - تم زيادة الشفافية والانتشار */}
      <div
        className="absolute -top-20 -left-20 w-1md h-112 rounded-full pointer-events-none z-0 blur-3xl opacity-80"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-primary) 35%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-20 -right-20 w-1md h-112 rounded-full pointer-events-none z-0 blur-3xl opacity-70"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-brand, var(--color-primary)) 30%, transparent) 0%, transparent 70%)",
        }}
      />

      {/* 4. الصورة الديكورية الخلفية - تم رفع الـ Opacity وإلغاء الـ grayscale لتكون أوضح بألوانها الأصليّة */}
      <div className="absolute top-1/5 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none w-full max-w-3xl flex justify-center items-center px-4">
        <img
          src={heroImage}
          alt="Decorative Background"
          className="w-full h-auto max-h-[65vh] object-contain pointer-events-none opacity-[0.22] dark:opacity-[0.14] transition-opacity"
        />
      </div>

      {/* 5. الحاوية الرئيسية للمحتوى */}
      <div className="container-x relative z-10 max-w-4xl px-4 md:px-6 flex flex-col items-center justify-center">
        
        {/* شارة علوية */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-(--color-border) bg-(--color-surface-elevated)/70 backdrop-blur-md mb-8 text-xs md:text-sm font-medium text-(--color-muted-foreground) shadow-sm hover:border-(--color-primary)/40 transition-colors cursor-default">
          <span className="inline-block w-2 h-2 rounded-full bg-(--color-primary) animate-pulse" />
          <span>{isAr ? "مؤسسة أساطير خضراء للطباعة والإعلان" : "Asateer Green Print & Advertising"}</span>
        </div>

        {/* العنوان الرئيسي */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-(--color-foreground) leading-[1.2] mb-6 tracking-tight flex flex-col items-center gap-3">
          <span className="opacity-95">{t("hero.titleNormal")}</span>
          <span
            className={`text-gradient pb-1 ${
              isAr ? "font-arabic" : ""
            }`}
          >
            {t("hero.titleGradient")}
          </span>
        </h1>

        {/* الوصف الفرعي */}
        <p className="text-base sm:text-lg md:text-xl text-(--color-muted-foreground) max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          {t("hero.description")}
        </p>

        {/* أزرار الدعوة للإجراء (CTA Buttons) */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
          <Link
            to={ROUTES.QUOTE_REQUEST}
            className="w-full sm:w-auto shadow-lg hover:shadow-xl px-8 py-4 rounded-xl bg-(--color-primary) text-(--color-primary-foreground) font-bold text-sm sm:text-base tracking-wide transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
          >
            <span>{t("nav.quoteRequest")}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                isAr ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          <Link
            to={ROUTES.PORTFOLIO}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-(--color-surface-elevated)/80 hover:bg-(--color-surface-elevated) text-(--color-foreground) font-semibold text-sm sm:text-base border border-(--color-border) backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center"
          >
            {t("hero.viewPortfolio")}
          </Link>
        </div>

        {/* نقاط إثبات الثقة (Trust Indicators) */}
        <div className="mt-5 pt-8 border-t border-(--color-border)/50 w-full max-w-lg flex items-center justify-center gap-8 text-xs md:text-sm text-(--color-muted-foreground)">
          <div className="flex items-center gap-2">
            <span className="text-(--color-primary) font-bold">✓</span>
            <span>{isAr ? "جودة طباعة عالية" : "High Quality Print"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-(--color-primary) font-bold">✓</span>
            <span>{isAr ? "تنفيذ وسرعة تسليم" : "Fast Delivery"}</span>
          </div>
        </div>

      </div>
    </section>
  );
}