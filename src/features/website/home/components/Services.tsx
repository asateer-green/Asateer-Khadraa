import React from "react";
import { Link } from "react-router-dom";
import { useLanguageContext } from "../../../../app/providers/LanguageProvider";
import { ROUTES } from "../../../../app/config/routes";

import { Palette, Printer, Gift, Layers } from "lucide-react";

import mediaImg from "../../../../assets/images/service-printing.jpg";
import printImg from "../../../../assets/images/service-design.jpg";
import giftsImg from "../../../../assets/images/service-gifts.jpg";
import manufacturingImg from "../../../../assets/images/service-manufacturing.jpg";

interface ServiceItem {
  id: string;
  titleKey: string;
  descKey: string;
  image: string;
  icon: React.ReactNode;
}

const mockServices: ServiceItem[] = [
  {
    id: "media",
    titleKey: "services.items.media.title",
    descKey: "services.items.media.desc",
    image: mediaImg,
    icon: <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-950 dark:text-emerald-900" />,
  },
  {
    id: "manufacturing",
    titleKey: "services.items.manufacturing.title",
    descKey: "services.items.manufacturing.desc",
    image: manufacturingImg,
    icon: <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-950 dark:text-emerald-900" />,
  },
  {
    id: "printing",
    titleKey: "services.items.printing.title",
    descKey: "services.items.printing.desc",
    image: printImg,
    icon: <Printer className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-950 dark:text-emerald-900" />,
  },
  {
    id: "gifts",
    titleKey: "services.items.gifts.title",
    descKey: "services.items.gifts.desc",
    image: giftsImg,
    icon: <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-950 dark:text-emerald-900" />,
  },
];

export function Services() {
  const { t } = useLanguageContext();

  return (
    <section className="w-full py-16 md:py-24 bg-(--color-background) border-b border-(--color-border) transition-smooth">
      <div className="container-x max-w-7xl px-4 sm:px-6 mx-auto">
        <div className="flex flex-col items-center text-center mb-10 md:mb-16">
          <span className="text-xs font-semibold text-(--color-brand) mb-3 tracking-wider uppercase">
            {t("services.title")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-(--color-foreground) mb-3 sm:mb-4">
            {t("services.title")}
          </h2>
          <p className="text-xs sm:text-sm text-(--color-muted-foreground) max-w-xl font-normal">
            {t("services.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {mockServices.map((svc) => {
            const title = t(svc.titleKey);
            const description = t(svc.descKey);

            return (
              <div
                key={svc.id}
                className="group relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden border border-(--color-border) bg-zinc-950 transition-smooth hover:-translate-y-1.5 hover:border-(--color-brand) shadow-card"
              >
                <div className="absolute inset-0 z-0 overflow-hidden bg-(--color-bg-primary)/10 dark:bg-(--color-bg-primary)/25">
                  <img
                    src={svc.image}
                    alt={title}
                    className="w-full h-full object-cover opacity-85 mix-blend-multiply dark:mix-blend-overlay transition-transform duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-(--color-surface) via-(--color-surface)/50 to-transparent" />
                </div>

                {/* تصغير الأيقونة قليلاً على شاشات الموبايل */}
                <div className="absolute top-3 right-3 rtl:left-3 rtl:right-auto sm:top-5 sm:right-5 sm:rtl:left-5 sm:rtl:right-auto z-20 w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-(--color-brand) flex items-center justify-center shadow-glow">
                  {svc.icon}
                </div>

                {/* ضبط الـ Padding والنصوص لتتناسب مع أبعاد 2 كرت بالسطر */}
                <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-5 md:p-6 flex flex-col items-start text-start">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-(--color-foreground) mb-1 sm:mb-2 group-hover:text-(--color-brand) transition-colors line-clamp-1">
                    {title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-(--color-muted-foreground) leading-snug sm:leading-relaxed font-normal line-clamp-2 sm:line-clamp-3 group-hover:text-(--color-foreground) transition-colors">
                    {description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center items-center mt-10 sm:mt-14">
          <Link
            to={ROUTES.SERVICES || "#"}
            className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-(--color-border) font-bold text-xs text-(--color-foreground) transition-smooth bg-(--color-surface) hover:bg-(--color-surface-elevated) hover:border-(--color-brand)"
          >
            <span>{t("services.bottomCta")}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5">
              ←
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
