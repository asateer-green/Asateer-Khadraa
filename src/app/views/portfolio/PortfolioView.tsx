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
  LayoutGrid,
} from "lucide-react";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { ROUTES } from "../../config/routes";
import { usePortfolio } from "../../../hooks/api/usePortfolio";
import { useSignage } from "../../../hooks/api/useSignage"; // استيراد الـ Hook الخاص باللوحات
import { useCategories } from "../../../hooks/api/useCategories"; // استيراد الـ Hook الخاص بالتصنيفات

// استيراد صور المعرض الفاخرة كاحتياطي وصور للتصنيفات الافتراضية
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
  boards2,
  boards3,
  boards4,
  boards5,
  Unipole1,
];

// دالة مساعدة لربط التصنيفات بصور افتراضية أنيقة من الـ assets في حال عدم وجود صورة مرفوعة من الـ Dashboard
const getCategoryFallbackImage = (nameAr: string) => {
  const name = nameAr.toLowerCase();
  if (name.includes("هوية") || name.includes("تجارية")) return pIdentity;
  if (name.includes("شعار") || name.includes("لوجو")) return pLogos;
  if (name.includes("لوحة") || name.includes("لوحات") || name.includes("يونيبول")) return pBillboard;
  if (name.includes("معارض") || name.includes("بوث")) return Boothmain;
  if (name.includes("تصوير")) return pPhoto;
  if (name.includes("موشن") || name.includes("فيديو")) return pMotion;
  if (name.includes("طباعة") || name.includes("مطبوعات")) return pPrinting;
  return pManufacturing; // تصنيع كخيار عام
};

export function PortfolioView() {
  const { language } = useLanguageContext();
  const ar = language === "ar";

  // استدعاء البيانات من قاعدة البيانات (Supabase API)
  const { data: dbProjects, isLoading: isPortfolioLoading } = usePortfolio();
  const { data: dbSignage, isLoading: isSignageLoading } = useSignage();
  const { data: dbCategories, isLoading: isCategoriesLoading } = useCategories();

  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState<number>(0);
  
  // حالة حفظ التصنيف النشط للفلترة (قيمة البداية null تعني الكل)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

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

  // ── قائمة الأعمال الاحتياطية الثابتة (عند عدم وجود اتصال بقاعدة البيانات) ──
  const localFallbackItems = [
    {
      title: ar ? "هوية شركة سدير" : "Sudair Brand Identity",
      category: ar ? "الهويات البصرية" : "Brand Identity",
      categoryIdRaw: "fallback-identity",
      description:
        ar
          ? "نظام هوية بصرية متكامل يغطي القوائم، التغليف، والمطبوعات الداخلية للمطعم بأسلوب عصري وواثق."
          : "A complete visual system covering menus, packaging and in-restaurant collateral with a confident, contemporary tone.",
      client: ar ? "مجموعة سدير الفاخرة" : "Sudair Fine Dining",
      year: "2025",
      scope:
        ar
          ? ["إستراتيجية الهوية", "تصميم القوائم", "التغليف", "التوجيه المكاني"]
          : ["Brand strategy", "Menu design", "Packaging", "Wayfinding"],
      gallery: [pIdentity, pLogos, pManufacturing],
    },
    {
      title: ar ? "شعار تميز الإبداع" : "Tamayoz Logo Craft",
      category: ar ? "الشعارات" : "Logos",
      categoryIdRaw: "fallback-logos",
      description:
        ar
          ? "تصميم شعار فريد يعبر عن الابتكار والتميز في بيئة العمل الرقمية الحديثة."
          : "Unique logo design reflecting innovation and excellence in modern digital workspaces.",
      client: ar ? "شركة تميز" : "Tamayoz Co.",
      year: "2024",
      scope:
        ar
          ? ["تصميم الشعار", "الأدلة الإرشادية"]
          : ["Logo Design", "Brand Guidelines"],
      gallery: [pLogos, pIdentity],
    },
    {
      title:
        ar
          ? "لوحات فندق هيلتون الداخلي"
          : "Hilton Indoor Signage",
      category:
        ar ? "التصنيع واللوحات" : "Signage & Manufacturing",
      categoryIdRaw: "fallback-signage",
      description:
        ar
          ? "تصنيع وتركيب اللوحات الإرشادية والداخلية المضيئة بجودة وتفاصيل هندسية فاخرة تتماشى مع معايير الفندق."
          : "Manufacturing and installation of indoor illuminated signs with premium engineering detail standard to hotel compliance.",
      client: ar ? "فندق هيلتون" : "Hilton Hotel",
      year: "2026",
      scope:
        ar
          ? ["اللوحات الإرشادية", "التصنيع الهيكلي"]
          : ["Wayfinding Signage", "Structural Fabrication"],
      gallery: [pManufacturing, pBillboard],
    },
    {
      title:
        ar ? "يونيبول طريق الملك فهد" : "King Fahd Road Unipole",
      category: ar ? "لوحات إعلانية" : "Billboards",
      categoryIdRaw: "fallback-signage",
      description:
        ar
          ? "تطوير وتنفيذ لوحة يونيبول عملاقة على أحد أهم الطرق الحيوية لضمان أعلى نسبة مشاهدة وانطباع."
          : "Development and execution of a massive unipole billboard on a vital highway for maximum reach and high-impact impression.",
      client:
        ar ? "وكالة الأبعاد الإعلانية" : "Dimensions Agency",
      year: "2025",
      scope:
        ar
          ? ["تصميم الإعلانات خارجي", "تنسيق المواقع"]
          : ["Outdoor Ad Design", "Site Coordination"],
      gallery: [Unipole1, Unipole2, Unipole3, Unipole4, Unipole5],
    },
    {
      title:
        ar
          ? "بوث وزارة الاستثمار - سيتي سكيب"
          : "MISA Exhibition Booth",
      category: ar ? "تجهيز المعارض" : "Exhibition Booths",
      categoryIdRaw: "fallback-booths",
      description:
        ar
          ? "تصميم وتجهيز جناح متكامل لوزارة الاستثمار في معرض سيتي سكيب العالمي بهيكل مستدام وحلول تقنية مدمجة."
          : "Design and build of an integrated pavilion for MISA at Cityscape Global, utilizing sustainable structure and smart tech options.",
      client: ar ? "وزارة الاستثمار" : "Ministry of Investment",
      year: "2024",
      scope:
        ar
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
  ];

  // قائمة التصنيفات الفعلية القادمة من "إدارة التصنيفات" في قاعدة البيانات
  const categoriesList = dbCategories || [];

  // هيكلة المشاريع القادمة من قاعدة البيانات ديناميكياً
  const dynamicProjects = dbProjects
    ? dbProjects.map((p: any) => {
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

        if (p.image_url) {
          galleryArray = [
            p.image_url,
            ...galleryArray.filter((url) => url !== p.image_url),
          ];
        }

        // إيجاد التصنيف المربوط بالعمل
        const matchedCategory = categoriesList.find((c) => c.id === p.category_id);
        const categoryName = matchedCategory 
          ? (ar ? matchedCategory.name_ar : matchedCategory.name_en)
          : (ar ? "عام" : "General");

        return {
          title: ar ? p.title_ar : p.title_en,
          category: categoryName,
          categoryIdRaw: p.category_id, // ربطه بمعرّف التصنيف للفلترة
          description: ar ? p.description_ar : p.description_en,
          client: p.client || "—",
          year: p.year || "—",
          scope:
            ar
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
          gallery: galleryArray,
          image_url: p.image_url,
        };
      })
    : [];

  // هيكلة اللوحات القادمة من قسم "إدارة اللوحات" ديناميكياً ودمجها مع التصنيفات المناسبة
  const dynamicSignages = dbSignage
    ? dbSignage
        .filter((s: any) => s.is_active !== false)
        .map((s: any) => {
          // محاولة ربط اللوحة بتصنيف "لوحات" أو "Signage" من التصنيفات الفعلية
          const matchedSignageCat = categoriesList.find(
            (c) => c.name_ar.includes("لوحات") || c.name_en.toLowerCase().includes("signage")
          );

          return {
            title: ar ? s.title_ar : s.title_en,
            category: ar ? "التصنيع واللوحات" : "Signage & Manufacturing",
            categoryIdRaw: matchedSignageCat ? matchedSignageCat.id : "signage-fallback-id",
            description:
              ar
                ? `لوحة مخصصة تم تصنيعها وتركيبها بدقة في موقع: ${s.location || "غير محدد"}.`
                : `Custom signage manufactured and installed at: ${s.location || "N/A"}.`,
            client: ar ? "طلب خاص" : "Custom Order",
            year: "2026",
            scope:
              ar
                ? ["تصنيع هيكلي", "تركيب خارجي"]
                : ["Structural Fabrication", "Field Installation"],
            gallery: [s.image_url],
            image_url: s.image_url,
          };
        })
    : [];

  // دمج كافة الأعمال (المشاريع واللوحات) في مصفوفة واحدة
  const allDynamicItems = [...dynamicProjects, ...dynamicSignages];
  const rawItems = allDynamicItems.length > 0 ? allDynamicItems : localFallbackItems;

  // تصفية العناصر بناءً على التصنيف المختار من الفلتر البصري
  const filteredPortfolioItems = selectedCategoryId
    ? rawItems.filter((item) => item.categoryIdRaw === selectedCategoryId)
    : rawItems;

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

  if (isPortfolioLoading || isSignageLoading || isCategoriesLoading) {
    return (
      <div className="w-full min-h-screen bg-(--color-background) flex items-center justify-center">
        <div className="text-zinc-500 font-medium animate-pulse">
          {ar ? "جاري تحميل التصنيفات ومعرض الأعمال..." : "Loading categories and portfolio..."}
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
          <nav className="flex items-center gap-2 mb-5 text-xs font-bold text-zinc-500 dark:text-zinc-900 uppercase tracking-wider" dir={ar ? "rtl" : "ltr"}>
            <Link to={ROUTES.HOME} className="hover:text-(--color-brand) transition-colors">
              {ar ? "الرئيسية" : "Home"}
            </Link>
            <span className="text-zinc-300 dark:text-zinc-300">/</span>
            <span className="text-(--color-brand) font-extrabold">
              {ar ? "أعمالنا" : "Our Portfolio"}
            </span>
          </nav>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white tracking-tight mb-5 max-w-3xl leading-tight">
            {ar ? "أعمال مختارة صُنعت بشغف" : "Crafting Iconic Brand Experiences"}
          </h1>

          <p className="max-w-2xl text-base md:text-lg text-zinc-600 dark:text-(--color-muted-foreground) font-medium dark:font-normal">
            {ar
              ? "نظرة على بعض المشاريع واللوحات المميزة التي قمنا بإنتاجها وتجهيزها لشركاء نجاحنا."
              : "Selected projects across visual identity, fine printing, and outdoor signage."}
          </p>
        </div>
      </section>

      {/* ── شريط التصفية البصري الذكي المربوط بـ "إدارة التصنيفات" ── */}
      {categoriesList.length > 0 && (
        <section className="w-full border-b border-zinc-100 dark:border-zinc-900 py-8 bg-zinc-50/50 dark:bg-zinc-950/20">
          <div className="container-x max-w-7xl px-6 mx-auto flex flex-col items-center gap-4">
            <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-center">
              {ar ? "تصفح الأعمال حسب القسم" : "Browse by category"}
            </p>
            
            <div className="flex items-center gap-5 md:gap-7 overflow-x-auto py-2 w-full justify-start md:justify-center no-scrollbar px-4" dir={ar ? "rtl" : "ltr"}>
              
              {/* زر تصفية الكل */}
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={`flex flex-col items-center gap-2.5 shrink-0 transition-all duration-300 focus:outline-none group ${
                  selectedCategoryId === null ? "scale-105 font-bold text-emerald-500" : "opacity-75 hover:opacity-100"
                }`}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${
                  selectedCategoryId === null 
                    ? "border-emerald-500 bg-emerald-500/10 shadow-lg ring-4 ring-emerald-500/10" 
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400"
                }`}>
                  <LayoutGrid className={`w-5 h-5 ${selectedCategoryId === null ? "text-emerald-500" : "text-zinc-400"}`} />
                </div>
                <span className="text-xs tracking-tight">{ar ? "عرض الكل" : "All"}</span>
              </button>

              {/* أزرار الأقسام الديناميكية المأخوذة من "إدارة التصنيفات" */}
              {categoriesList.map((cat) => {
                const isActive = selectedCategoryId === cat.id;
                // استخدام الصورة المرفوعة بالتصنيف، أو جلب الصورة الافتراضية المناسبة لاسم التصنيف
                const catImg = cat.image_url || getCategoryFallbackImage(cat.name_ar);

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`flex flex-col items-center gap-2.5 shrink-0 transition-all duration-300 focus:outline-none group ${
                      isActive ? "scale-105 font-bold text-emerald-500" : "opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-all ${
                      isActive 
                        ? "border-emerald-500 shadow-lg ring-4 ring-emerald-500/10" 
                        : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400"
                    }`}>
                      <img 
                        src={catImg} 
                        alt={ar ? cat.name_ar : cat.name_en} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = pManufacturing;
                        }}
                      />
                    </div>
                    <span className="text-xs tracking-tight">
                      {ar ? cat.name_ar : cat.name_en}
                    </span>
                  </button>
                );
              })}

            </div>
          </div>
        </section>
      )}

      {/* ── ثانياً: شبكة المعرض الذكية تتبع الفلتر ── */}
      <section className="container-x max-w-7xl px-6 mx-auto py-16" dir={ar ? "rtl" : "ltr"}>
        {filteredPortfolioItems.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/5 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500 text-sm">
              {ar ? "لا توجد أعمال مضافة تحت هذا القسم بعد." : "No projects added under this section yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolioItems.map((item: any, i: number) => {
              const isWide = i === 0 || i === 5;
              const projectImage = item.image_url || mainImages[i % mainImages.length];

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
                  <div className={`relative w-full ${isWide ? "aspect-16/10 md:aspect-video" : "aspect-4/5"}`}>
                    <img
                      src={projectImage}
                      alt={item.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = mainImages[i % mainImages.length];
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
        )}
      </section>

      {/* ── ثالثاً: الـ Modal التفصيلي المطور للعمل المختار ── */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-zinc-950/85 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 grid grid-cols-1 md:grid-cols-12 max-h-[90vh] md:max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
            dir={ar ? "rtl" : "ltr"}
          >
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              title={ar ? "إغلاق" : "Close"}
              className={`absolute top-4 z-30 p-2 rounded-full bg-zinc-950/50 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer ${
                ar ? "left-4" : "right-4"
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* الجانب الأيمن أو الأيسر لصور المعرض والـ Thumbnails */}
            <div className="md:col-span-7 bg-zinc-950 flex flex-col justify-between relative p-4 group/slider">
              <div className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-900">
                <img
                  src={
                    (selectedProject.gallery && selectedProject.gallery[currentImgIndex]) ||
                    selectedProject.image_url
                  }
                  alt={selectedProject.title}
                  className="max-w-full max-h-full object-contain transition-all duration-500"
                />

                {selectedProject.gallery?.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImg}
                      className="absolute left-4 p-2.5 rounded-full bg-zinc-900/80 hover:bg-emerald-500 text-white border border-zinc-800/50 transition-all shadow-md transform -translate-y-1/2 top-1/2 opacity-0 group-hover/slider:opacity-100 cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImg}
                      className="absolute right-4 p-2.5 rounded-full bg-zinc-900/80 hover:bg-emerald-500 text-white border border-zinc-800/50 transition-all shadow-md transform -translate-y-1/2 top-1/2 opacity-0 group-hover/slider:opacity-100 cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {selectedProject.gallery && selectedProject.gallery.length > 1 && (
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
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* الجزء الجانبي للبيانات التفصيلية للمشروع */}
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
                    (ar
                      ? "لم يتم إضافة تفاصيل إضافية عن المشروع بعد."
                      : "No additional details provided for this project.")}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6 border-b border-zinc-800/60 pb-6">
                  <div>
                    <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-bold uppercase tracking-wider mb-1">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{ar ? "العميل" : "Client"}</span>
                    </div>
                    <p className="text-sm font-bold text-zinc-200">
                      {selectedProject.client || "—"}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] font-bold uppercase tracking-wider mb-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{ar ? "السنة" : "Year"}</span>
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
                      <span>{ar ? "نطاق العمل" : "SCOPE OF WORK"}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.scope.map((tag: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 text-xs font-medium rounded-full bg-zinc-950 text-zinc-300 border border-zinc-800/80 hover:border-emerald-500/30 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
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

      {/* ── خامساً: بانر الـ CTA الفاخر ── */}
      <section className="container-x max-w-7xl px-6 mx-auto pb-24">
        <div className="relative w-full rounded-3xl p-10 md:p-14 overflow-hidden bg-linear-to-br from-white via-emerald-50/20 to-zinc-50 dark:from-green-900 dark:via-emerald-950/40 dark:to-green-900 border border-emerald-500/20 dark:border-emerald-500/10 shadow-sm dark:shadow-glow flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-start transition-all duration-300">
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-500/10 dark:bg-(--color-brand)/20 blur-3xl rounded-full pointer-events-none select-none" />

          <div className="relative z-10 flex flex-col gap-3 items-center md:items-start">
            <h2 className="text-2xl md:text-4xl font-black text-zinc-950 dark:text-white tracking-tight">
              {ar ? "هل لديك مشروع طموح؟" : "Ready to launch your project?"}
            </h2>
            <p className="text-sm text-(--color-muted-foreground) max-w-xl font-medium dark:font-normal leading-relaxed">
              {ar
                ? "يسعدنا تحويل رؤيتك وتطلعات شركتك إلى واقع ملموس وهوية بصرية مطبوعة تُبهر عملاءك."
                : "Let's craft your next business chapter together with unmatched excellence."}
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link
              to={ROUTES.CONTACT || "#"}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-(--color-brand) text-emerald-950 dark:text-zinc-950 font-bold text-sm shadow-md hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200"
            >
              <span>{ar ? "تواصل معنا" : "Contact Us"}</span>
              {ar ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default PortfolioView;