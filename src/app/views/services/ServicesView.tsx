// src/app/views/services/ServicesView.tsx
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ArrowLeft, Camera, Printer, Boxes, Gift, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { ROUTES } from "../../config/routes";
import { useServices } from "../../../hooks/api/useServices";
import { LogoDesignsSection } from "../Logos/LogoDesignsSection";

import serviceDesign from "../../../assets/images/service-design.jpg";
import servicePrinting from "../../../assets/images/service-printing.jpg";
import serviceManufacturing from "../../../assets/images/service-manufacturing.jpg";
import serviceGifts from "../../../assets/images/service-gifts.jpg";
import servicePackaging from "../../../assets/images/service-packaging.png";
import heroImage from "../../../assets/logos/logoweb.png";

const icons = [Camera, Printer, Boxes, Gift];
const images = [serviceDesign, servicePrinting, serviceManufacturing, serviceGifts, servicePackaging];

// ── خريطة ربط الـ Slugs أو المعرفات بمسارات الصفحات المستقلة ──
const SERVICE_PAGE_ROUTES: Record<string, string> = {
  "design-media": ROUTES.MEDIA_SERVICE,
  "digital-printing": ROUTES.PRINTING_SERVICE,
  "signage-cladding": ROUTES.SIGNAGE_SERVICE,
  "promotional-gifts": ROUTES.GIFTS_SERVICE,
  "packaging": ROUTES.PACKAGING_SERVICE,
};

export function ServicesView() {
  const { t, language } = useLanguageContext();
  const { hash } = useLocation();
  const { data: dbServices, isLoading } = useServices();

  const isRtl = language === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  // معالجة الانتقال السلس للقسم المخصص عند فتح الرابط بـ Hash
  useEffect(() => {
    if (!isLoading) {
      if (hash) {
        const targetId = hash.replace("#", "");
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          setTimeout(() => {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [hash, isLoading]);

  // ── 1. الأقسام الأربعة الأساسية ──
  const localFallbackItems = [
    {
      slug: "design-media",
      title: isRtl ? "التصميم والميديا" : "Design & Media",
      desc: isRtl 
        ? "تصميم الهوية البصرية المتكاملة، التصوير الفوتوغرافي الاحترافي، إنتاج الفيديو والموشن جرافيك، والمحتوى الإبداعي المميز." 
        : "Integrated visual identity design, professional photography, video and motion graphics production.",
      bullets: isRtl 
        ? ["الهوية البصرية الشاملة", "التصوير الفوتوغرافي", "الموشن جرافيك والأنيميشن", "إنتاج واستوديو الفيديو"] 
        : ["Visual Identity", "Professional Photography", "Motion Graphics", "Video Production"],
      image_url: serviceDesign
    },
    {
      slug: "digital-printing",
      title: isRtl ? "الطباعة الرقمية والأوفست" : "Digital & Offset Printing",
      desc: isRtl 
        ? "طباعة داخلية وخارجية بأحدث التقنيات ومعدات HP و Plamac و OKI، مع جودة عالية ودقة متناهية في جميع المطبوعات الورقية والإعلانية." 
        : "Indoor and outdoor printing using the latest technologies and equipment with ultra-high precision.",
      bullets: isRtl 
        ? ["طباعة الأوفست والكميات", "الطباعة الرقمية السريعة", "مطبوعات الشركة والكتالوجات", "التغليف والعلب الفاخرة"] 
        : ["Offset Printing", "Fast Digital Printing", "Corporate Publications", "Packaging & Boxes"],
      image_url: servicePrinting
    },
    {
      slug: "signage-cladding",
      title: isRtl ? "اللوحات الإعلانية والكلادينج" : "Signage & Cladding",
      desc: isRtl 
        ? "تصنيع وتركيب اللوحات الإعلانية بجميع أنواعها، واجهات الكلادينج، الحروف البارزة المضيئة، وتجهيز بوثات المعارض بأعلى معايير الجودة." 
        : "Manufacturing all kinds of outdoor signage, cladding facades, illuminated 3D letters, and exhibition booths.",
      bullets: isRtl 
        ? ["واجهات كلادينج معتمدة", "حروف بارزة 3D مضيئة", "ستاندات وشاشات العرض", "تجهيز بوثات المعارض"] 
        : ["Cladding Facades", "3D Luminous Letters", "Display Stands", "Exhibition Booths"],
      image_url: serviceManufacturing
    },
    {
      slug: "promotional-gifts",
      title: isRtl ? "الهدايا الدعائية" : "Promotional Gifts",
      desc: isRtl 
        ? "توفير وتصنيع الهدايا الدعائية المبتكرة والمخصصة للشركات والمؤسسات لتعزيز حضور علاماتهم التجارية بشكل فاخر ومبتكر." 
        : "Providing innovative and customized promotional corporate gifts to elevate your brand presence.",
      bullets: isRtl 
        ? ["هدايا كبار الشخصيات VIP", "أقلام ونوت بوك مخصصة", "مطبوعات الفعاليات والمناسبات", "دروع وتكريمات فاخرة"] 
        : ["Corporate VIP Gifts", "Custom Pens & Notebooks", "Event Merch", "Trophies & Awards"],
      image_url: serviceGifts
    },
    {
      slug: "packaging",
      title: isRtl ? "التصنيع والتركيب" : "Packaging & Cladding",
      desc: isRtl 
        ? "تصنيع وتركيب العلب والتغليف بجميع انواعها، وتجهيز بوثات المعارض بأعلى معايير الجودة." 
        : "Manufacturing and packaging all kinds of boxes and packaging, and exhibition booths.",
      bullets: isRtl 
        ? ["واجهات كلادينج معتمدة", "حروف بارزة 3D مضيئة", "ستاندات وشاشات العرض", "تجهيز بوثات المعارض"]
        : ["Approved cladding facades", "Luminous 3D letters", "Stands and display screens", "Setting up exhibition booths"],
      image_url: servicePackaging
    }
  ];

  // ── 2. دمج ومطابقة البيانات القادمة من قاعدة البيانات ──
  const dynamicServices = dbServices
    ? dbServices
        .filter((s: any) => s.is_active)
        .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
        .map((s: any, idx: number) => ({
          slug: s.slug || localFallbackItems[idx]?.slug || `service-${s.id || idx + 1}`,
          title: isRtl ? s.title_ar : s.title_en,
          desc: isRtl ? s.desc_ar : s.desc_en,
          bullets: s.bullets || [],
          image_url: s.image_url
        }))
    : [];

  // ندمج بيانات الداتابيز مع القائمة المحلية بدل استبدالها بالكامل:
  // أي خدمة أساسية ناقصة من الداتابيز (لسه ما اتضافتش أو is_active=false)
  // تفضل تظهر بالمحتوى الافتراضي بدل ما تختفي من الصفحة تمامًا.
  const dbSlugs = new Set(dynamicServices.map((s) => s.slug));
  const missingFallbackItems = localFallbackItems.filter(
    (item) => !dbSlugs.has(item.slug)
  );
  const servicesItems = [...dynamicServices, ...missingFallbackItems];

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-(--color-background) flex items-center justify-center">
        <div className="text-zinc-500 font-medium animate-pulse">
          {isRtl ? "جاري تحميل الخدمات..." : "Loading services..."}
        </div>
      </div>
    );
  }

  return (
    <main className="relative w-full min-h-screen bg-(--color-background) animate-in fade-in duration-500 overflow-hidden">

      {/* ── أولاً: طبقات الخلفية الموحدة ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, color-mix(in oklab, var(--color-primary) 20%, transparent) 0%, transparent 65%), linear-gradient(180deg, color-mix(in oklab, var(--color-background) 100%, transparent) 0%, color-mix(in oklab, var(--color-primary) 8%, var(--color-background)) 100%)",
        }}
      />

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

      {/* ── ثانياً: البانر الترحيبي ── */}
      <section className="relative z-10 w-full py-20 md:py-28 border-b-2 border-(--color-border) bg-(--color-border)/10 dark:border-(--color-brand)/30 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none select-none w-full max-w-2xl flex justify-center items-center px-4">
          <img
            src={heroImage}
            alt="Decorative Background"
            className="w-full h-auto max-h-[50vh] object-contain opacity-[0.25] dark:opacity-[0.16]"
          />
        </div>

        <div className="container-x max-w-7xl px-6 mx-auto relative z-10 flex flex-col items-center text-center">
          <nav className="flex items-center gap-2 mb-5 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider" dir={isRtl ? "rtl" : "ltr"}>
            <Link to={ROUTES.HOME} className="hover:text-(--color-brand) transition-colors">
              {isRtl ? "الرئيسية" : "Home"}
            </Link>
            <span className="text-zinc-400 dark:text-zinc-600">/</span>
            <span className="text-(--color-brand) font-extrabold">
              {isRtl ? "خدماتنا" : "Our Services"}
            </span>
          </nav>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-(--color-foreground) tracking-tight mb-5 max-w-3xl leading-tight">
            {isRtl ? "ما الذي يمكننا صنعه لعلامتك؟" : (t("services.title") || "Our Integrated Services")}
          </h1>

          <p className="max-w-2xl text-base md:text-lg text-(--color-muted-foreground) font-normal leading-relaxed">
            {t("services.subtitle") || (isRtl ? "خدمات إنتاج متكاملة للتصميم والطباعة والتصنيع للهويات التجارية" : "Integrated production services for ambitious brands.")}
          </p>
        </div>
      </section>

      {/* ── ثالثاً: الأقسام الأربعة الديناميكية وتوجيهها لصفحاتها المباشرة ── */}
      <section className="relative z-10 container-x max-w-7xl px-6 mx-auto py-24 space-y-12" dir={isRtl ? "rtl" : "ltr"}>
        {servicesItems.map((item: any, i: number) => {
          const Icon = icons[i] || Boxes;
          const flip = i % 2 === 1;

          // تحديد مسار الصفحة المباشر للخدمة
          const targetPageRoute = SERVICE_PAGE_ROUTES[item.slug] || `${ROUTES.SERVICES}#${item.slug}`;

          return (
            <article
              key={item.slug || i}
              id={item.slug}
              className="scroll-mt-28 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden rounded-3xl border border-(--color-border) bg-(--color-surface)/80 backdrop-blur-md transition-smooth hover:border-emerald-500/30 dark:hover:border-emerald-500/20 hover:shadow-card group"
            >
              {/* صورة الخدمة قابلة للنقر وتوجه للصفحة */}
              <Link to={targetPageRoute} className={`relative min-h-70 lg:min-h-100 overflow-hidden block ${flip ? "lg:order-2" : ""}`}>
                <img
                  src={item.image_url || images[i % images.length]}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = images[i % images.length];
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent lg:bg-linear-to-tr lg:from-(--color-background)/40 lg:via-transparent" />
              </Link>

              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center items-start text-start">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-(--color-brand) shadow-[0_0_15px_rgba(0,229,147,0.3)]">
                    <Icon className="h-5 w-5 text-emerald-950 dark:text-zinc-950" />
                  </span>
                  <span className="text-xs font-mono font-bold text-(--color-muted-foreground)">0{i + 1}</span>
                </div>

                <h2 className="mt-5 text-2xl md:text-3xl font-black text-(--color-foreground) tracking-tight">
                  <Link to={targetPageRoute} className="hover:text-(--color-brand) transition-colors">
                    {item.title}
                  </Link>
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

                {/* زر الانتقال المباشر لصفحة التفاصيل */}
                <div className="mt-8 pt-6 w-full border-t border-(--color-border)/50 flex items-center justify-between">
                  <Link
                    to={targetPageRoute}
                    className="inline-flex items-center gap-2 text-sm font-extrabold text-(--color-brand) hover:underline group/btn"
                  >
                    <span>{isRtl ? "تفاصيل الخدمة" : "View Details"}</span>
                    <ChevronIcon className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* قسم الشعارات المدمج */}
      <div id="logos-preview" className="relative z-10 scroll-mt-28">
        <LogoDesignsSection />
      </div>

      {/* ── رابعاً: بانر الـ CTA ── */}
      <section className="relative z-10 container-x max-w-7xl px-6 mx-auto pb-24">
        <div className="relative w-full rounded-3xl p-10 md:p-14 overflow-hidden bg-(--color-surface)/90 backdrop-blur-md border border-emerald-500/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-start">
          <div className="relative z-10 flex flex-col gap-3 items-center md:items-start">
            <h2 className="text-2xl md:text-4xl font-black text-(--color-foreground) tracking-tight">
              {isRtl ? "لنصنع شيئاً أسطورياً معاً" : "Let's Build Something Legendary"}
            </h2>
            <p className="text-sm text-(--color-muted-foreground) max-w-xl font-normal leading-relaxed">
              {isRtl ? "تواصل معنا اليوم لتحويل أفكارك المبدعة إلى منتجات وهوية بصرية مطبوعة بأعلى جودة." : "Contact us today to turn your creative concepts into high-quality reality."}
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              to={ROUTES.QUOTE_REQUEST || "#"}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-(--color-brand) text-emerald-950 font-bold text-sm shadow-md hover:scale-[1.03] transition-transform duration-200"
            >
              <span>{isRtl ? "طلب تسعيرة" : "Get a Quote"}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}

export default ServicesView;