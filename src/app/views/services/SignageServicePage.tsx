import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { ROUTES } from "../../config/routes";

export const SignageServicePage: React.FC = () => {
  const { t, language } = useLanguageContext();

  const isRtl = language === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // جلب العناصر الفرعية الخاصة بقسم التصنيع والإنتاج/اللوحات
  const bullets: string[] = [
    t("services.items.manufacturing.bullets.0"),
    t("services.items.manufacturing.bullets.1"),
    t("services.items.manufacturing.bullets.2"),
    t("services.items.manufacturing.bullets.3"),
  ];

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-(--color-background) text-(--color-foreground) py-16 px-4 sm:px-6 lg:px-8 transition-smooth"
    >
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Breadcrumb */}
        <nav className="flex items-center justify-center gap-2 text-xs font-bold text-(--color-muted-foreground) uppercase tracking-wider">
          <Link to={ROUTES.HOME} className="hover:text-(--color-brand) transition-colors">
            {isRtl ? "الرئيسية" : "Home"}
          </Link>
          <span className="text-(--color-border)">/</span>
          <Link to={ROUTES.SERVICES} className="hover:text-(--color-brand) transition-colors">
            {isRtl ? "خدماتنا" : "Services"}
          </Link>
          <span className="text-(--color-border)">/</span>
          <span className="text-(--color-brand) font-extrabold">
            {t("services.items.manufacturing.title")}
          </span>
        </nav>

        {/* Header Section */}
        <div className="text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-(--color-brand)/10 text-(--color-brand) dark:bg-(--color-brand)/15">
            {t("nav.services")}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-linear-to-r from-(--color-brand) to-(--color-brand-glow) bg-clip-text text-transparent">
            {t("services.items.manufacturing.title")}
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-(--color-muted-foreground) leading-relaxed">
            {t("services.items.manufacturing.desc")}
          </p>
        </div>

        {/* Bullets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bullets.map((bullet, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-(--color-card) border border-(--color-border) shadow-card hover:shadow-glow transition-smooth flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-(--color-brand)/10 text-(--color-brand) flex items-center justify-center font-bold text-lg shrink-0">
                ✓
              </div>
              <span className="font-medium text-(--color-foreground)/90">
                {bullet}
              </span>
            </div>
          ))}
        </div>

        {/* Durability & Quality Banner */}
        <div className="p-8 rounded-3xl bg-(--color-surface)/90 backdrop-blur-md border border-(--color-brand)/20 shadow-glow space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-(--color-foreground)">
              {t("features.items.durability.title")}
            </h2>
            <p className="text-(--color-muted-foreground) leading-relaxed">
              {t("features.items.durability.desc")}
            </p>
          </div>

          <div className="pt-4 border-t border-(--color-border) flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-(--color-muted-foreground)">
              {t("features.subtitle")}
            </span>
            <Link
              to={ROUTES.QUOTE_REQUEST || "/quote-request"}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-(--color-brand) text-emerald-950 dark:text-zinc-950 font-bold text-sm text-center shadow-md hover:scale-[1.03] transition-transform duration-200"
            >
              <span>{t("nav.quoteRequest")}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignageServicePage;