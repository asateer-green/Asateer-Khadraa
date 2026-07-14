import React from "react";
import { Link } from "react-router-dom";
import { useLanguageContext } from "../../../../app/providers/LanguageProvider";
import { ROUTES } from "../../../../app/config/routes";

// استيراد الأيقونات من Lucide-React لتعطي اللمسة الهندسية الفاخرة للوكالة
import { Award, ShieldCheck, Layers, ArrowLeft, ArrowRight } from "lucide-react";

// 1. تعريف واجهة البيانات (Interface) لسهولة الربط مع لوحة التحكم لاحقاً
interface FeatureItem {
  id: string;
  number: string;
  titleKey: string; // مفتاح عنوان الكرت في ملف الترجمة
  descKey: string;  // مفتاح وصف الكرت في ملف الترجمة
  icon: React.ReactNode;
}

// 2. مصفوفة البيانات المرتبطة ديناميكياً بمفاتيح ملف الـ JSON
const mockFeatures: FeatureItem[] = [
  {
    id: "equipment",
    number: "01",
    titleKey: "features.items.equipment.title",
    descKey: "features.items.equipment.desc",
    icon: <Award className="w-5 h-5 text-(--color-brand)" />,
  },
  {
    id: "durability",
    number: "02",
    titleKey: "features.items.durability.title",
    descKey: "features.items.durability.desc",
    icon: <ShieldCheck className="w-5 h-5 text-(--color-brand)" />,
  },
  {
    id: "responsibility",
    number: "03",
    titleKey: "features.items.responsibility.title",
    descKey: "features.items.responsibility.desc",
    icon: <Layers className="w-5 h-5 text-(--color-brand)" />,
  },
];

export function Features() {
  const { t, language } = useLanguageContext();

  return (
    <section className="w-full py-24 bg-(--color-background) border-b border-(--color-border) transition-smooth">
      <div className="container-x max-w-7xl px-6 mx-auto">
        
        {/* ── أولاً: هيدر القسم (مستدعى بالكامل من ملف الترجمة) ── */}
        <div className="flex flex-col items-end text-end mb-16 w-full">
          <span className="text-xs font-semibold text-(--color-brand) mb-3 tracking-wider uppercase">
            {t("features.badge")}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-(--color-foreground) mb-4">
            {t("features.mainTitle")}
          </h2>
          <p className="text-sm text-(--color-muted-foreground) max-w-xl font-normal">
            {t("features.subtitle")}
          </p>
        </div>

        {/* ── ثانياً: شبكة الكروت الثلاثية (ترجمات الكروت ديناميكية) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20" dir={language === "ar" ? "rtl" : "ltr"}>
          {mockFeatures.map((feat) => (
            <div
              key={feat.id}
              className="group relative p-8 rounded-2xl border border-(--color-border) bg-(--color-surface) transition-smooth hover:-translate-y-1 hover:border-(--color-brand) hover:shadow-card flex flex-col items-start text-start"
            >
              {/* الرقم التسلسلي الخافت */}
              <span className="text-xs font-mono font-bold text-(--color-muted-foreground)/40 mb-6">
                {feat.number}
              </span>

              {/* الحاوية العائمة للأيقونة الملونة */}
              <div className="w-10 h-10 rounded-xl bg-(--color-brand)/10 flex items-center justify-center mb-6 transition-colors group-hover:bg-(--color-brand)/20">
                {feat.icon}
              </div>

              {/* نصوص الكروت المستدعاة بالدالة t */}
              <h3 className="text-lg font-bold text-(--color-foreground) mb-3 transition-colors group-hover:text-(--color-brand)">
                {t(feat.titleKey)}
              </h3>
              <p className="text-xs text-(--color-muted-foreground) leading-relaxed font-normal group-hover:text-(--color-foreground) transition-colors">
                {t(feat.descKey)}
              </p>
            </div>
          ))}
        </div>

        {/* ── ثالثاً: بانر الـ CTA المطور ليكون ناصع البياض وواضح الحواف والنصوص ── */}
        <div 
          className="relative w-full rounded-3xl p-10 md:p-14 overflow-hidden bg-linear-to-br from-white via-emerald-50/20 to-zinc-50 dark:from-zinc-900 dark:via-emerald-950/40 dark:to-zinc-950 border border-emerald-500/20 dark:border-emerald-500/10 shadow-sm dark:shadow-glow flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-start transition-all duration-300"
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          {/* تأثير التوهج الضبابي الأخضر الخفيف جداً */}
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/10 dark:bg-(--color-brand)/20 blur-3xl rounded-full pointer-events-none select-none" />

          {/* نصوص واضحة ومقروءة تماماً في الوضع الفاتح والغامق */}
          <div className="relative z-10 flex flex-col gap-3">
            <h3 className="text-2xl md:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
              {t("features.cta.title")}
            </h3>
            <p className="text-sm text-zinc-800 dark:text-zinc-300 max-w-xl font-medium dark:font-normal leading-relaxed">
              {t("features.cta.desc")}
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              to={ROUTES.CONTACT || "#"}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-(--color-brand) text-emerald-950 dark:text-zinc-950 font-bold text-sm shadow-sm hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200"
            >
              <span>{t("features.cta.button")}</span>
              {language === "ar" ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}