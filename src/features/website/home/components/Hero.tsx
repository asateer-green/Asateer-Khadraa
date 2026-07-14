import { Link } from "react-router-dom";
import { useLanguageContext } from "../../../../app/providers/LanguageProvider";
import { ROUTES } from "../../../../app/config/routes";
import heroImage from "../../../../assets/logos/favicon.ico";

export function Hero() {
  const { t, language } = useLanguageContext();

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center text-center border-b border-(--color-border) bg-(--color-background)">
      {/* 1. طبقة الجراديانت الأساسية المتناسقة مع الموقع */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--color-background) 100%, transparent) 0%, color-mix(in oklab, var(--color-primary) 8%, var(--color-background)) 50%, color-mix(in oklab, var(--color-background) 100%, transparent) 100%)",
        }}
      />

      {/* 2. شبكة Grid Pattern ناعمة لإضافة عمق تقني */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--color-foreground) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      {/* 3. Blob متوهج علوي يسار */}
      <div
        className="absolute -top-32 -left-32 w-125 h-125 rounded-full pointer-events-none z-0 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-primary) 25%, transparent) 0%, transparent 70%)",
        }}
      />

      {/* 4. Blob متوهج سفلي يمين */}
      <div
        className="absolute -bottom-32 -right-32 w-125 h-125 rounded-full pointer-events-none z-0 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-brand, var(--color-primary)) 20%, transparent) 0%, transparent 70%)",
        }}
      />

      {/* 5. التوهج المركزي الناعم */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--color-primary) 10%, transparent) 0%, transparent 70%)",
        }}
      />

      {/* 6. الصورة الديكورية كعلامة مائية */}
      <div className="absolute top-1/5 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none w-full max-w-2xl px-4 flex justify-center items-center">
        <img
          src={heroImage}
          alt="Decorative Center Watermark"
          className="w-screen h-auto object-cover pointer-events-none mix-blend-screen opacity-[0.20] lg:opacity-[0.08] filter grayscale brightness-110"
        />
      </div>

      {/* الحاوية الرئيسية */}
      <div className="container-x relative z-10 max-w-4xl px-6 py-20 flex flex-col items-center justify-center">
        {/* العنوان الرئيسي */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-(--color-foreground) leading-[1.15] mb-6 tracking-tight">
          {t("hero.titleNormal")}{" "}
          <span className={`text-gradient ${language === "ar" ? "font-arabic" : ""}`}>
            {t("hero.titleGradient")}
          </span>
        </h1>

        {/* الوصف الفرعي */}
        <p className="text-base md:text-lg lg:text-xl text-(--color-muted-foreground) max-w-3xl mx-auto mb-10 leading-relaxed">
          {t("hero.description")}
        </p>

        {/* أزرار الـ CTA */}
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <Link
            to={ROUTES.QUOTE_REQUEST}
            className="shadow-glow px-8 py-3.5 rounded-xl bg-(--color-primary) text-(--color-primary-foreground) font-bold text-sm tracking-wide transition-smooth hover:-translate-y-1"
          >
            {t("nav.quoteRequest")}
          </Link>

          <Link
            to={ROUTES.PORTFOLIO}
            className="px-8 py-3.5 rounded-xl bg-(--color-secondary) text-(--color-secondary-foreground) font-bold text-sm border border-(--color-border) transition-smooth hover:bg-(--color-surface-elevated)"
          >
            {t("hero.viewPortfolio")}
          </Link>
        </div>
      </div>
    </section>
  );
}
