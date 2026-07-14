// src/app/views/services/ServicesView.tsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Camera, Printer, Boxes, Gift, Check } from "lucide-react";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { ROUTES } from "../../config/routes";
import { useServices } from "../../../hooks/api/useServices"; // جلب خدمات الـ API من قاعدة البيانات
import { LogoDesignsSection } from "../Logos/LogoDesignsSection"; // استدعاء قسم الشعارات الديناميكي

import serviceDesign from "../../../assets/images/service-design.jpg";
import servicePrinting from "../../../assets/images/service-printing.jpg";
import serviceManufacturing from "../../../assets/images/service-manufacturing.jpg";
import serviceGifts from "../../../assets/images/service-gifts.jpg";

const icons = [Camera, Printer, Boxes, Gift];
const images = [serviceDesign, servicePrinting, serviceManufacturing, serviceGifts];

export function ServicesView() {
  const { t, language } = useLanguageContext();
  
  // جلب البيانات وحالة التحميل من السيرفر/قاعدة البيانات
  const { data: dbServices, isLoading } = useServices();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ── مصفوفة احتياطية (Fallback) تضمن ظهور الكروت فوراً حتى لو حدثت مشكلة أو كانت قاعدة البيانات فارغة ──
  const localFallbackItems = [
    {
      title: language === "ar" ? "التصميم والميديا" : "Design & Media",
      desc: language === "ar" ? "تصميم الهوية البصرية المتكاملة، التصوير الفوتوغرافي الاحترافي، إنتاج الفيديو والموشن جرافيك، والمحتوى الإبداعي المميز." : "Integrated visual identity design, professional photography, video and motion graphics production.",
      bullets: language === "ar" ? ["الهوية البصرية", "التصوير الاحترافي", "الموشن جرافيك", "إنتاج الفيديو"] : ["Visual Identity", "Photography", "Motion Graphics", "Video Production"],
      image_url: serviceDesign
    },
    {
      title: language === "ar" ? "الطباعة" : "Printing",
      desc: language === "ar" ? "طباعة داخلية وخارجية بأحدث التقنيات ومعدات HP و Plamac و OKI، مع جودة عالية ودقة متناهية في جميع المواد." : "Indoor and outdoor printing using the latest technologies and equipment with high precision.",
      bullets: language === "ar" ? ["طباعة الأوفست", "اللوحات الإعلانية", "الطباعة الرقمية", "التغليف والعلب"] : ["Offset Printing", "Digital Printing", "Signage", "Packaging"],
      image_url: servicePrinting
    },
    {
      title: language === "ar" ? "التصنيع" : "Manufacturing",
      desc: language === "ar" ? "تصنيع اللوحات الإعلانية بجميع أنواعها، الاستاندات ووسائل العرض، تجهيز المعارض والبوثات بأعلى معايير الجودة." : "Manufacturing all kinds of signage, exhibition stands, and display solutions with high quality.",
      bullets: language === "ar" ? ["لوحات كلادينج", "حروف بارزة مضيئة", "ستاندات عرض", "تجهيز بوثات المعارض"] : ["Cladding Signage", "3D Luminous Letters", "Display Stands", "Exhibition Booths"],
      image_url: serviceManufacturing
    },
    {
      title: language === "ar" ? "الهدايا الدعائية" : "Promotional Gifts",
      desc: language === "ar" ? "توفير وتصنيع الهدايا الدعائية المبتكرة والمخصصة للشركات والمؤسسات لتعزيز حضور علاماتهم التجارية بشكل فاخر." : "Providing innovative and customized promotional corporate gifts to elevate your brand presence.",
      bullets: language === "ar" ? ["هدايا الشركات VIP", "أقلام ونوت بوك مخصصة", "مطبوعات المناسبات", "دروع تذكارية فاخرة"] : ["Corporate VIP Gifts", "Custom Pens & Notebooks", "Event Merch", "Trophies & Awards"],
      image_url: serviceGifts
    }
  ];

  // 1. فلترة وتجهيز البيانات المستلمة من الداتابيز وترتيبها
  const dynamicServices = dbServices
    ? dbServices
        .filter((s: any) => s.is_active)
        .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
        .map((s: any) => ({
          title: language === "ar" ? s.title_ar : s.title_en,
          desc: language === "ar" ? s.desc_ar : s.desc_en,
          bullets: s.bullets || [], // مصفوفة النقاط الفرعية إن وجدت
          image_url: s.image_url
        }))
    : [];

  // 2. إذا كانت قاعدة البيانات تحتوي على خدمات معروضة نستخدمها، وإلا نعود للـ Fallback الافتراضي
  const servicesItems = dynamicServices.length > 0 ? dynamicServices : localFallbackItems;

  // في حالة جاري تحميل البيانات من قاعدة البيانات يفضل إظهار مؤشر تحميل بسيط
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-(--color-background) flex items-center justify-center">
        <div className="text-zinc-500 font-medium">
          {language === "ar" ? "جاري تحميل الخدمات..." : "Loading services..."}
        </div>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-(--color-background) animate-in fade-in duration-500 overflow-hidden">

      {/* ── أولاً: البانر الترحيبي الهندسي الفاخر ── */}
      <section className="relative w-full py-20 md:py-28 border-b border-zinc-200 dark:border-zinc-800 bg-linear-to-b from-zinc-50 to-white dark:from-green-950 dark:to-(--color-background)">
        <div
          className="absolute inset-0 pointer-events-none select-none opacity-[0.35] dark:opacity-[0.15] bg-[linear-gradient(to_right,rgba(0,229,147,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,147,0.12)_1px,transparent_1px)] bg-size-[32px_32px]"
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-400/20 dark:bg-(--color-brand)/15 blur-[100px] rounded-full pointer-events-none select-none" />

        <div className="container-x max-w-7xl px-6 mx-auto relative z-10 flex flex-col items-center text-center">
          <nav className="flex items-center gap-2 mb-5 text-xs font-bold text-zinc-500 dark:text-zinc-900 uppercase tracking-wider" dir={language === "ar" ? "rtl" : "ltr"}>
            <Link to={ROUTES.HOME} className="hover:text-(--color-brand) transition-colors">
              {language === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="text-(--color-brand) font-extrabold">
              {language === "ar" ? "خدماتنا" : "Our Services"}
            </span>
          </nav>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white tracking-tight mb-5 max-w-3xl leading-tight">
            {language === "ar" ? "ما الذي يمكننا صنعه لعلامتك؟" : (t("services.title") || "Our Integrated Services")}
          </h1>

          <p className="max-w-2xl text-base md:text-lg text-zinc-600 dark:text-(--color-muted-foreground) font-medium dark:font-normal">
            {t("services.subtitle") || (language === "ar" ? "خدمات إنتاج متكاملة للتصميم والطباعة والتصنيع والهدايا الدعائية" : "Integrated production services for ambitious brands.")}
          </p>
        </div>
      </section>

      {/* ── ثانياً: كروت المقالات الديناميكية التناوبية الذكية ── */}
      <section className="container-x max-w-7xl px-6 mx-auto py-24 space-y-8" dir={language === "ar" ? "rtl" : "ltr"}>
        {servicesItems.map((item: any, i: number) => {
          const Icon = icons[i] || Boxes;
          const flip = i % 2 === 1;

          return (
            <article
              key={item.title || i}
              className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-3xl border border-(--color-border) bg-(--color-surface) transition-smooth hover:border-emerald-500/20 dark:hover:border-emerald-500/10 hover:shadow-card"
            >
              <div className={`relative min-h-70 lg:min-h-100 overflow-hidden ${flip ? "lg:order-2" : ""}`}>
                <img
                  src={item.image_url || images[i % images.length]}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-103"
                  onError={(e) => {
                    // حماية احتياطية في حال تعطل رابط الصورة الخارجي القادم من قاعدة البيانات
                    (e.target as HTMLImageElement).src = images[i % images.length];
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent lg:bg-linear-to-tr lg:from-(--color-background)/40 lg:via-transparent" />
              </div>

              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center items-start text-start">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-(--color-brand) shadow-[0_0_15px_rgba(0,229,147,0.3)]">
                    <Icon className="h-5 w-5 text-emerald-950 dark:text-zinc-950" />
                  </span>
                  <span className="text-xs font-mono font-bold text-(--color-muted-foreground)">0{i + 1}</span>
                </div>

                <h2 className="mt-5 text-2xl md:text-3xl font-black text-(--color-foreground) tracking-tight">
                  {item.title}
                </h2>
                <p className="mt-3.5 text-sm text-(--color-muted-foreground) leading-relaxed font-normal">
                  {item.desc}
                </p>

                {Array.isArray(item.bullets) && item.bullets.length > 0 && (
                  <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    {item.bullets.map((b: string) => (
                      <li key={b} className="flex items-start gap-2.5 text-xs font-medium text-(--color-foreground)/90">
                        <Check className="h-4 w-4 mt-0.5 text-(--color-brand) shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          );
        })}
      </section>

      < LogoDesignsSection /> {/* استدعاء قسم الشعارات الديناميكي */}

      {/* ── ثالثاً: بانر الـ CTA السفلي الفاخر المشرق ── */}
      <section className="container-x max-w-7xl px-6 mx-auto pb-24">
        <div
          className="relative w-full rounded-3xl p-10 md:p-14 overflow-hidden bg-linear-to-br from-white via-emerald-50/20 to-zinc-50 dark:from-green-900 dark:via-emerald-950/40 dark:to-green-900 border border-emerald-500/20 dark:border-emerald-500/10 shadow-sm dark:shadow-glow flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-start transition-all duration-300"
        >
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/10 dark:bg-(--color-brand)/20 blur-3xl rounded-full pointer-events-none select-none" />

          <div className="relative z-10 flex flex-col gap-3 items-center md:items-start">
            <h2 className="text-2xl md:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
              {language === "ar" ? "لنصنع شيئاً أسطورياً معاً" : (t("contact.title") || "Let's Build Something Legendary")}
            </h2>
            <p className="text-sm text-(--color-muted-foreground) max-w-xl font-medium dark:font-normal leading-relaxed">
              {language === "ar" ? "تواصل معنا اليوم لتحويل أفكارك المبدعة إلى منتجات وهوية بصرية مطبوعة بأعلى جودة." : (t("contact.description") || "Contact us today to turn your creative concepts into high-quality reality.")}
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              to={ROUTES.QUOTE_REQUEST || "#"}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-(--color-brand) text-emerald-950 dark:text-zinc-950 font-bold text-sm shadow-md hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200"
            >
              <span>{t(language === "ar" ? "طلب تسعيرة" : "Get a Quote")}</span>
              {language === "ar" ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

export default ServicesView;