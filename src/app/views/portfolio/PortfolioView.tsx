// src/app/views/portfolio/PortfolioView.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Layers,
} from "lucide-react";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { ROUTES } from "../../config/routes";
import { usePortfolio } from "../../../hooks/api/usePortfolio";
import { useSignage } from "../../../hooks/api/useSignage"; // استيراد الـ Hook الخاص باللوحات

// استيراد صور معرض الأعمال الفاخرة من مجلد الـ assets
import pIdentity from "../../../assets/images/portfolio-identity.jpg";
import pLogos from "../../../assets/images/portfolio-logos.jpg";
import pManufacturing from "../../../assets/images/service-manufacturing.jpg";
import pBillboard from "../../../assets/images/portfolio-billboard.jpg";
import pPhoto from "../../../assets/images/portfolio-photo.jpg";
import pMotion from "../../../assets/images/portfolio-motion.jpg";
import pPrinting from "../../../assets/images/service-printing.jpg";

import boards1 from "../../../assets/images/letter-boards/letter-boards1.jpeg";
import boards2 from "../../../assets/images/letter-boards/letter-boards2.jpeg";
import boards3 from "../../../assets/images/letter-boards/letter-boards3.jpeg";
import boards4 from "../../../assets/images/letter-boards/letter-boards4.jpeg";
import boards5 from "../../../assets/images/letter-boards/letter-boards5.jpeg";
import boards6 from "../../../assets/images/letter-boards/letter-boards6.jpeg";

import Unipole1 from "../../../assets/images/Unipole/Unipole1.jpeg";
import Unipole2 from "../../../assets/images/Unipole/Unipole2.jpeg";
import Unipole3 from "../../../assets/images/Unipole/Unipole3.jpeg";
import Unipole4 from "../../../assets/images/Unipole/Unipole4.jpeg";
import Unipole5 from "../../../assets/images/Unipole/Unipole5.jpeg";

import Boothmain from "../../../assets/images/Booth/Boothmain.jpg";
import Booth1 from "../../../assets/images/Booth/Booth1.jpeg";
import Booth2 from "../../../assets/images/Booth/Booth2.jpeg";
import Booth3 from "../../../assets/images/Booth/Booth3.jpeg";
import Booth4 from "../../../assets/images/Booth/Booth4.jpeg";
import Booth5 from "../../../assets/images/Booth/Booth5.jpeg";
import Booth6 from "../../../assets/images/Booth/Booth6.jpeg";
import Booth7 from "../../../assets/images/Booth/Booth7.jpeg";
import Booth8 from "../../../assets/images/Booth/Booth8.jpeg";
import Booth9 from "../../../assets/images/Booth/Booth9.jpeg";

import { LogoDesignsSection } from "../Logos/LogoDesignsSection";

const mainImages = [
  pIdentity,
  pLogos,
  pManufacturing,
  pBillboard,
  Boothmain,
  pPhoto,
  pMotion,
  pPrinting,
  boards1,
  Unipole1,
];

export function PortfolioView() {
  const { t, language } = useLanguageContext();

  // استدعاء بيانات المشاريع واللوحات الإعلانية من قاعدة البيانات
  const { data: dbProjects, isLoading: isPortfolioLoading } = usePortfolio();
  const { data: dbSignage, isLoading: isSignageLoading } = useSignage(); // جلب اللوحات

  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState<number>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProject]);

  // ── قائمة الأعمال الاحتياطية الثابتة ──
  const localFallbackItems = [
    {
      title: language === "ar" ? "هوية شركة سدير" : "Sudair Brand Identity",
      category: language === "ar" ? "الهويات البصرية" : "Brand Identity",
      description:
        language === "ar"
          ? "نظام هوية بصرية متكامل يغطي القوائم، التغليف، والمطبوعات الداخلية للمطعم بأسلوب عصري وواثق."
          : "A complete visual system covering menus, packaging and in-restaurant collateral with a confident, contemporary tone.",
      client: language === "ar" ? "مجموعة سدير الفاخرة" : "Sudair Fine Dining",
      year: "2025",
      scope:
        language === "ar"
          ? ["إستراتيجية الهوية", "تصميم القوائم", "التغليف", "التوجيه المكاني"]
          : ["Brand strategy", "Menu design", "Packaging", "Wayfinding"],
      gallery: [pIdentity, pLogos, pManufacturing],
    },
    {
      title: language === "ar" ? "شعار تميز الإبداع" : "Tamayoz Logo Craft",
      category: language === "ar" ? "الشعارات" : "Logos",
      description:
        language === "ar"
          ? "تصميم شعار فريد يعبر عن الابتكار والتميز في بيئة العمل الرقمية الحديثة."
          : "Unique logo design reflecting innovation and excellence in modern digital workspaces.",
      client: language === "ar" ? "شركة تميز" : "Tamayoz Co.",
      year: "2024",
      scope:
        language === "ar"
          ? ["تصميم الشعار", "الأدلة الإرشادية"]
          : ["Logo Design", "Brand Guidelines"],
      gallery: [pLogos, pIdentity],
    },
    {
      title:
        language === "ar"
          ? "لوحات فندق هيلتون الداخلي"
          : "Hilton Indoor Signage",
      category:
        language === "ar" ? "التصنيع واللوحات" : "Signage & Manufacturing",
      description:
        language === "ar"
          ? "تصنيع وتركيب اللوحات الإرشادية والداخلية المضيئة بجودة وتفاصيل هندسية فاخرة تتماشى مع معايير الفندق."
          : "Manufacturing and installation of indoor illuminated signs with premium engineering detail standard to hotel compliance.",
      client: language === "ar" ? "فندق هيلتون" : "Hilton Hotel",
      year: "2026",
      scope:
        language === "ar"
          ? ["اللوحات الإرشادية", "التصنيع الهيكلي"]
          : ["Wayfinding Signage", "Structural Fabrication"],
      gallery: [pManufacturing, pBillboard],
    },
    {
      title:
        language === "ar" ? "يونيبول طريق الملك فهد" : "King Fahd Road Unipole",
      category: language === "ar" ? "لوحات إعلانية" : "Billboards",
      description:
        language === "ar"
          ? "تطوير وتنفيذ لوحة يونيبول عملاقة على أحد أهم الطرق الحيوية لضمان أعلى نسبة مشاهدة وانطباع."
          : "Development and execution of a massive unipole billboard on a vital highway for maximum reach and high-impact impression.",
      client:
        language === "ar" ? "وكالة الأبعاد الإعلانية" : "Dimensions Agency",
      year: "2025",
      scope:
        language === "ar"
          ? ["تصميم الإعلانات خارجي", "تنسيق المواقع"]
          : ["Outdoor Ad Design", "Site Coordination"],
      gallery: [Unipole1, Unipole2, Unipole3, Unipole4, Unipole5],
    },
    {
      title:
        language === "ar"
          ? "بوث وزارة الاستثمار - سيتي سكيب"
          : "MISA Exhibition Booth",
      category: language === "ar" ? "تجهيز المعارض" : "Exhibition Booths",
      description:
        language === "ar"
          ? "تصميم وتجهيز جناح متكامل لوزارة الاستثمار في معرض سيتي سكيب العالمي بهيكل مستدام وحلول تقنية مدمجة."
          : "Design and build of an integrated pavilion for MISA at Cityscape Global, utilizing sustainable structure and smart tech options.",
      client: language === "ar" ? "وزارة الاستثمار" : "Ministry of Investment",
      year: "2024",
      scope:
        language === "ar"
          ? ["التصميم المعماري للجناح", "الإشراف والتنفيذ"]
          : ["Booth Architecture", "Execution & Styling"],
      gallery: [
        Booth1,
        Booth2,
        Booth3,
        Booth4,
        Booth5,
        Booth6,
        Booth7,
        Booth8,
        Booth9,
      ],
    },
    {
      title:
        language === "ar"
          ? "جلسة تصوير منتجات المراعي"
          : "Almarai Product Photoshoot",
      category: language === "ar" ? "التوير الاحترافي" : "Photography",
      description:
        language === "ar"
          ? "إنتاج وإخراج جلسة تصوير تجارية لمنتجات شركة المراعي الجديدة لاستخدامها في الحملات الرقمية والمطبوعة."
          : "Production and direction of a commercial product photoshoot for Almarai's new range, optimized for digital and print campaigns.",
      client: language === "ar" ? "شركة المراعي" : "Almarai Company",
      year: "2026",
      scope:
        language === "ar"
          ? ["التصوير التجاري", "تنسيق الأطعمة", "المعالجة الرقمية"]
          : ["Commercial Art", "Food Styling", "Retouching"],
      gallery: [pPhoto, pMotion],
    },
    {
      title:
        language === "ar"
          ? "فيديو موشن جرافيك لمنصة بلدي"
          : "Balady Platform Motion Video",
      category: language === "ar" ? "الموشن جرافيك" : "Motion Graphics",
      description:
        language === "ar"
          ? "فيديو موشن جرافيك توعوي يشرح التحديثات والخدمات الرقمية الجديدة لمنصة بلدي بشكل مبسط وجذاب."
          : "An explainer motion graphics video detailing the new digital workflow and features of Balady platform in a smooth approach.",
      client: language === "ar" ? "الأمانة العامة" : "Balady Municipality",
      year: "2025",
      scope:
        language === "ar"
          ? ["كتابة السيناريو", "الرسم والتحريك", "الأداء الصوتي"]
          : ["Scriptwriting", "Storyboarding & Motion", "Voiceover"],
      gallery: [pMotion, pPhoto],
    },
    {
      title:
        language === "ar"
          ? "مطبوعات وعلب عطور الماجد"
          : "Almajed Oud Premium Packaging",
      category: language === "ar" ? "الطباعة الفاخرة" : "Premium Printing",
      description:
        language === "ar"
          ? "تصميم وتنفيذ علب عطور الماجد الفاخرة مع استخدام تقنيات الحفر والورق الحراري الذهبي والمخمل لإعطاء طابع ملكي."
          : "Design and execution of premium perfume packaging for Almajed Oud with hot foil stamping and textured velvet layers.",
      client: language === "ar" ? "الماجد للعود" : "Almajed Oud",
      year: "2026",
      scope:
        language === "ar"
          ? ["تصميم العبوات والتغليف", "اختيار المواد الفاخرة"]
          : ["Structural Box Design", "Material Sourcing"],
      gallery: [pPrinting, pIdentity],
    },
    {
      title:
        language === "ar" ? "لوحات الحروف البارزة " : "Prominent Letter Boards",
      category: language === "ar" ? "اللوحات الإعلانية" : "Advertising Boards",
      description:
        language === "ar"
          ? "لوحات حروف بارزة مصممة خصيصاً لتعزيز الحضور والانطباع عند الزوار."
          : "Prominent letter boards designed to create a strong presence and impression on visitors.",
      client: language === "ar" ? "شركة التسويق" : "Marketing Company",
      year: "2024",
      scope:
        language === "ar"
          ? ["تصميم اللوحات", "التنفيذ"]
          : ["Board Design", "Execution"],
      gallery: [boards1, boards2, boards3, boards4, boards5, boards6],
    },
  ];

  // 3. هيكلة المشاريع القادمة من قاعدة البيانات ديناميكياً
  const dynamicProjects = dbProjects
    ? dbProjects.map((p: any) => {
        // تحويل نص الـ gallery المخزن في قاعدة البيانات كروابط مفصولة بفواصل إلى مصفوفة نصوص
        let galleryArray: string[] = [];
        if (p.gallery) {
          if (Array.isArray(p.gallery)) {
            galleryArray = p.gallery.filter(Boolean);
          } else if (typeof p.gallery === "string") {
            galleryArray = p.gallery
              .split(",")
              .map((url: string) => url.trim())
              .filter(Boolean);
          }
        }

        // ✅ الحل السحري: نضع الصورة الرئيسية (image_url) دائماً كأول عنصر في المصفوفة
        // مع تجنب تكرارها إذا كانت مضافة مسبقاً في المعرض الإضافي
        if (p.image_url) {
          galleryArray = [
            p.image_url,
            ...galleryArray.filter((url) => url !== p.image_url),
          ];
        }

        return {
          title: language === "ar" ? p.title_ar : p.title_en,
          category: language === "ar" ? p.category_id : p.category_id,
          description: language === "ar" ? p.description_ar : p.description_en,
          client: p.client || "—",
          year: p.year || "—",
          scope:
            language === "ar"
              ? p.scope_ar
                ? Array.isArray(p.scope_ar)
                  ? p.scope_ar
                  : p.scope_ar.split(",").map((s: string) => s.trim())
                : []
              : p.scope_en
                ? Array.isArray(p.scope_en)
                  ? p.scope_en
                  : p.scope_en.split(",").map((s: string) => s.trim())
                : [],
          gallery: galleryArray, // مصفوفة مرتبة تبدأ بالصورة الرئيسية
          image_url: p.image_url,
        };
      })
    : [];

  // 4. هيكلة اللوحات القادمة من قسم إدارة اللوحات ديناميكياً لتندمج مع المعرض
  const dynamicSignages = dbSignage
    ? dbSignage
        .filter((s: any) => s.is_active !== false) // عرض اللوحات النشطة فقط[cite: 8]
        .map((s: any) => ({
          title: language === "ar" ? s.title_ar : s.title_en, //[cite: 8]
          category:
            language === "ar" ? "التصنيع واللوحات" : "Signage & Manufacturing", // تصنيفها المباشر
          description:
            language === "ar"
              ? `لوحة مخصصة تم تصنيعها وتركيبها بدقة في موقع: ${s.location || "غير محدد"}.`
              : `Custom signage manufactured and installed at: ${s.location || "N/A"}.`,
          client: language === "ar" ? "طلب خاص" : "Custom Order",
          year: "2026",
          scope:
            language === "ar"
              ? ["تصنيع هيكلي", "تركيب خارجي"]
              : ["Structural Fabrication", "Field Installation"],
          gallery: [s.image_url], //[cite: 8]
          image_url: s.image_url, //[cite: 8]
        }))
    : [];

  // دمج المشاريع المضافة مع اللوحات الإعلانية الجديدة في مصفوفة واحدة ديناميكية
  const allDynamicItems = [...dynamicProjects, ...dynamicSignages];

  // إذا كانت المصفوفة المدمجة فارغة نعود للمصفوفة الاحتياطية الثابتة
  const portfolioItems =
    allDynamicItems.length > 0 ? allDynamicItems : localFallbackItems;

  const handlePrevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProject || !selectedProject.gallery) return;
    setCurrentImgIndex((prev) =>
      prev === 0 ? selectedProject.gallery.length - 1 : prev - 1,
    );
  };

  const handleNextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProject || !selectedProject.gallery) return;
    setCurrentImgIndex((prev) =>
      prev === selectedProject.gallery.length - 1 ? 0 : prev + 1,
    );
  };

  if (isPortfolioLoading || isSignageLoading) {
    return (
      <div className="w-full min-h-screen bg-(--color-background) flex items-center justify-center">
        <div className="text-zinc-500 font-medium">
          {language === "ar"
            ? "جاري تحميل معرض الأعمال..."
            : "Loading portfolio..."}
        </div>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-(--color-background) animate-in fade-in duration-500 overflow-hidden">
      {/* ── أولاً: البانر الترحيبي الهندسي الفاخر ── */}
      <section className="relative w-full py-20 md:py-28 border-b border-zinc-200 dark:border-zinc-800 bg-linear-to-b from-zinc-50 to-white dark:from-green-950 dark:to-(--color-background)">
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.35] dark:opacity-[0.15] bg-[linear-gradient(to_right,rgba(0,229,147,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,147,0.12)_1px,transparent_1px)] bg-size-[32px_32px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-400/20 dark:bg-(--color-brand)/15 blur-[100px] rounded-full pointer-events-none select-none" />

        <div className="container-x max-w-7xl px-6 mx-auto relative z-10 flex flex-col items-center text-center">
          <nav
            className="flex items-center gap-2 mb-5 text-xs font-bold text-zinc-500 dark:text-zinc-900 uppercase tracking-wider"
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            <Link
              to={ROUTES.HOME}
              className="hover:text-(--color-brand) transition-colors"
            >
              {language === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <span className="text-zinc-300 dark:text-zinc-300">/</span>
            <span className="text-(--color-brand) font-extrabold">
              {language === "ar" ? "أعمالنا" : "Our Portfolio"}
            </span>
          </nav>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white tracking-tight mb-5 max-w-3xl leading-tight">
            {language === "ar"
              ? "أعمال مختارة صُنعت بشغف"
              : t("portfolio.title") || "Crafting Iconic Brand Experiences"}
          </h1>

          <p className="max-w-2xl text-base md:text-lg text-zinc-600 dark:text-(--color-muted-foreground) font-medium dark:font-normal">
            {t("portfolio.subtitle") ||
              (language === "ar"
                ? "نظرة على بعض المشاريع واللوحات المميزة التي قمنا بإنتاجها وتجهيزها لشركاء نجاحنا."
                : "Selected projects across visual identity, fine printing, and outdoor signage.")}
          </p>
        </div>
      </section>

      {/* ── ثانياً: شبكة المعرض الذكية ── */}
      <section
        className="container-x max-w-7xl px-6 mx-auto py-24"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item: any, i: number) => {
            const isWide = i === 0 || i === 5;
            const projectImage =
              item.image_url || mainImages[i % mainImages.length];

            return (
              <figure
                key={item.title || i}
                onClick={() => {
                  setSelectedProject(item);
                  setCurrentImgIndex(0);
                }}
                className={`group relative overflow-hidden rounded-3xl border border-(--color-border) bg-(--color-surface) hover:border-emerald-500/20 shadow-sm transition-all duration-500 hover:-translate-y-1 cursor-pointer ${
                  isWide ? "sm:col-span-2 lg:col-span-2" : ""
                }`}
              >
                <div
                  className={`relative w-full ${isWide ? "aspect-16/10 md:aspect-video" : "aspect-4/5"}`}
                >
                  <img
                    src={projectImage}
                    alt={item.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        mainImages[i % mainImages.length];
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-zinc-950/20 to-transparent opacity-90 transition-opacity group-hover:opacity-95" />
                </div>

                <figcaption className="absolute inset-x-0 bottom-0 p-6 z-10 flex flex-col items-start text-start">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-(--color-brand) mb-1.5">
                    {item.category}
                  </p>
                  <p className="text-base md:text-lg font-black text-white tracking-tight drop-shadow-xs">
                    {item.title}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      {/* ── ثالثاً: الـ Modal المتكامل المماثل لتفاصيل العمل المختار ── */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-zinc-950/85 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 grid grid-cols-1 md:grid-cols-12 max-h-[90vh] md:max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              title={language === "ar" ? "إغلاق" : "Close"}
              aria-label={language === "ar" ? "إغلاق" : "Close"}
              className={`absolute top-4 z-30 p-2 rounded-full bg-zinc-950/50 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer ${
                language === "ar" ? "left-4" : "right-4"
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* الجزء الأيسر: Slider المعرض والـ Thumbnails */}
            <div className="md:col-span-7 bg-zinc-950 flex flex-col justify-between relative p-4 group/slider">
              {/* ✅ تعديل: تثبيت طول الحاوية لمنع اهتزاز الـ Modal */}
              <div className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-900">
                <img
                  src={
                    (selectedProject.gallery &&
                      selectedProject.gallery[currentImgIndex]) ||
                    selectedProject.image_url
                  }
                  alt={selectedProject.title}
                  // ✅ تعديل: جعل الصورة تتكيف دائماً داخل الصندوق الثابت بدون تغيير أبعاده
                  className="max-w-full max-h-full object-contain transition-all duration-500"
                />

                {selectedProject.gallery?.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImg}
                      title="Previous image"
                      className="absolute left-4 p-2.5 rounded-full bg-zinc-900/80 hover:bg-emerald-500 text-white border border-zinc-800/50 transition-all shadow-md transform -translate-y-1/2 top-1/2 opacity-0 group-hover/slider:opacity-100 cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImg}
                      title="Next image"
                      className="absolute right-4 p-2.5 rounded-full bg-zinc-900/80 hover:bg-emerald-500 text-white border border-zinc-800/50 transition-all shadow-md transform -translate-y-1/2 top-1/2 opacity-0 group-hover/slider:opacity-100 cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {selectedProject.gallery &&
                selectedProject.gallery.length > 1 && (
                  <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 justify-center">
                    {selectedProject.gallery.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImgIndex(idx)}
                        className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          currentImgIndex === idx
                            ? "border-emerald-500 scale-105 shadow-md"
                            : "border-transparent opacity-50 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img}
                          alt="thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
            </div>

            {/* الجزء الأيمن: لوحة البيانات التفصيلية الداكنة */}
            <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[40vh] md:max-h-full border-t md:border-t-0 md:border-s border-zinc-800 bg-zinc-900/60">
              <div className="text-start">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-2">
                  {selectedProject.category}
                </span>

                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mb-4 leading-snug">
                  {selectedProject.title}
                </h2>

                <p className="text-xs md:text-sm text-zinc-400 leading-relaxed font-normal mb-6 border-b border-zinc-800/60 pb-6">
                  {selectedProject.description ||
                    (language === "ar"
                      ? "لم يتم إضافة تفاصيل إضافية عن المشروع بعد."
                      : "No additional details provided for this project.")}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6 border-b border-zinc-800/60 pb-6">
                  <div>
                    <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-bold uppercase tracking-wider mb-1">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === "ar" ? "العميل" : "Client"}</span>
                    </div>
                    <p className="text-sm font-bold text-zinc-200">
                      {selectedProject.client || "—"}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-bold uppercase tracking-wider mb-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === "ar" ? "السنة" : "Year"}</span>
                    </div>
                    <p className="text-sm font-bold text-zinc-200">
                      {selectedProject.year || "—"}
                    </p>
                  </div>
                </div>

                {selectedProject.scope && selectedProject.scope.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-bold uppercase tracking-wider mb-3">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      <span>
                        {language === "ar" ? "نطاق العمل" : "SCOPE OF WORK"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.scope.map(
                        (tag: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 text-xs font-medium rounded-full bg-zinc-950 text-zinc-300 border border-zinc-800/80 hover:border-emerald-500/30 transition-colors"
                          >
                            {tag}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ── رابعاً: قسم معرض الشعارات ── */}
      <section>
        <LogoDesignsSection />
      </section>

      {/* ── رابعاً: بانر الـ CTA الفاخر ── */}
      <section className="container-x max-w-7xl px-6 mx-auto pb-24">
        <div className="relative w-full rounded-3xl p-10 md:p-14 overflow-hidden bg-linear-to-br from-white via-emerald-50/20 to-zinc-50 dark:from-green-900 dark:via-emerald-950/40 dark:to-green-900 border border-emerald-500/20 dark:border-emerald-500/10 shadow-sm dark:shadow-glow flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-start transition-all duration-300">
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/10 dark:bg-(--color-brand)/20 blur-3xl rounded-full pointer-events-none select-none" />

          <div className="relative z-10 flex flex-col gap-3 items-center md:items-start">
            <h2 className="text-2xl md:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
              {language === "ar"
                ? "هل لديك مشروع طموح؟"
                : t("contact.title") || "Ready to launch your project?"}
            </h2>
            <p className="text-sm text-(--color-muted-foreground) max-w-xl font-medium dark:font-normal leading-relaxed">
              {language === "ar"
                ? "يسعدنا تحويل رؤيتك وتطلعات شركتك إلى واقع ملموس وهوية بصرية مطبوعة تُبهر عملاءك."
                : t("contact.description") ||
                  "Let's craft your next business chapter together with unmatched excellence."}
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              to={ROUTES.CONTACT || "#"}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-(--color-brand) text-emerald-950 dark:text-zinc-950 font-bold text-sm shadow-md hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200"
            >
              <span>{language === "ar" ? "تواصل معنا" : "Contact Us"}</span>
              {language === "ar" ? (
                <ArrowLeft className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PortfolioView;
