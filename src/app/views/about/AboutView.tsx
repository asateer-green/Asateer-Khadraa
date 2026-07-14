// src/app/views/about/AboutView.tsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { ROUTES } from "../../config/routes";
import {
  Users,
  Printer,
  Cpu,
  CheckCircle2,
  Monitor,
  Sparkles,
  PenTool,
} from "lucide-react";
import aboutBg from "../../../assets/images/portfolio-billboard.jpg";
import led from "../../../assets/images/service-manufacturing.jpg";
import Digital from "../../../assets/images/portfolio-billboard.jpg";
import booths from "../../../assets/images/Booth/Booth1.jpeg";
import printing from "../../../assets/images/service-printing.jpg";

export function AboutView() {
  const { t, language } = useLanguageContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ── 1. الخدمات الرئيسية مستوحاة من البروفايل ──
  const coreServices = [
    {
      icon: PenTool,
      title: language === "ar" ? "التصميم والميديا" : "Design & Media",
      desc:
        language === "ar"
          ? "تصميم الهوية البصرية المتكاملة، التصوير الفوتوغرافي الاحترافي، إنتاج الفيديو والموشن جرافيك والمحتوى الإبداعي المميز."
          : "Integrated visual identity design, professional photography, video production, motion graphics, and creative content.",
    },
    {
      icon: Printer,
      title: language === "ar" ? "الطباعة الرقمية" : "Digital Printing",
      desc:
        language === "ar"
          ? "طباعة داخلية وخارجية بأحدث التقنيات ومعدات HP و Plamac و OKI، مع جودة عالية ودقة متناهية في جميع المواد."
          : "Indoor and outdoor printing using the latest HP, Plamac, and OKI equipment, delivering extreme precision on all materials.",
    },
    {
      icon: Cpu,
      title:
        language === "ar" ? "التصنيع والإنتاج" : "Manufacturing & Production",
      desc:
        language === "ar"
          ? "تصنيع اللوحات الإعلانية بجميع أنواعها، الاستاندات ووسائل العرض، وتجهيز المعارض والبوثات بأعلى معايير الجودة."
          : "Manufacturing all types of signage, display stands, exhibition setups, and booths tailored to the highest premium standards.",
    },
  ];

  // ── 2. القدرات التصنيعية المتقدمة المذكورة في البروفايل ──
  const capabilities = [
    {
      title:
        language === "ar"
          ? "لوحات الحروف البارزة LED"
          : "LED 3D Channel Letters",
      desc:
        language === "ar"
          ? "تصنيع احترافي من الاستانلس ستيل والأكريليك بتقنيات القص بالليزر وإضاءة خلفية توفر تأثير هالة مميز."
          : "Premium stainless steel and acrylic fabrication using laser cutting with energy-saving LED backlighting.",
      image: led,
    },
    {
      title:
        language === "ar"
          ? "الشاشات واللوحات العملاقة"
          : "Digital LED Screens & Unipols",
      desc:
        language === "ar"
          ? "شاشات عرض LED داخلية وخارجية متطورة، ولوحات يونيبول وبايلون ضخمة تصل لارتفاعات شاهقة للطرق الرئيسية."
          : "Advanced indoor/outdoor LED screens, massive highway Unipols, and Pylon signs designed for maximum impact.",
      image: Digital,
    },
    {
      title:
        language === "ar"
          ? "تجهيز المعارض والبوثات"
          : "Exhibitions & Booth Setups",
      desc:
        language === "ar"
          ? "تصميم وتنفيذ أجنحة العرض المتكاملة، البوب أب (Pop Up)، الرول أب (Roll Up)، والاستاندات الأرضية للفعاليات."
          : "Full execution of custom exhibition booths, premium Pop-ups, Roll-ups, and structural promotional stands.",
      image: booths,
    },
    {
      title:
        language === "ar"
          ? "المواد والطباعة المتخصصة"
          : "Specialized Media Printing",
      desc:
        language === "ar"
          ? "الطباعة على الوايت فيلم، الباكلايت للوحات المضيئة، الفلكس بنر، الاستيكرات بجميع أنواعها، وقماش الكانفس الفني."
          : "High-fidelity printing on White Film, Backlit, Flex Banners, high-durability Stickers, and decorative Canvas.",
      image: printing,
    },
  ];

  return (
    <main className="w-full min-h-screen bg-(--color-background) animate-in fade-in duration-500 overflow-hidden">
      {/* ── أولاً: البانر الترحيبي الهندسي الفاخر ── */}
      <section className="relative w-full py-20 md:py-28 border-b border-zinc-200 dark:border-zinc-800 bg-linear-to-b from-zinc-50 to-white dark:from-green-950/20 dark:to-(--color-background)">
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.35] dark:opacity-[0.15] bg-[linear-gradient(to_right,rgba(0,229,147,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,147,0.12)_1px,transparent_1px)] bg-size-[32px_32px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-400/20 dark:bg-(--color-brand)/15 blur-[100px] rounded-full pointer-events-none select-none" />

        <div className="container-x max-w-7xl px-6 mx-auto relative z-10 flex flex-col items-center text-center">
          <nav
            className="flex items-center gap-2 mb-5 text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            <Link
              to={ROUTES.HOME}
              className="hover:text-(--color-brand) transition-colors"
            >
              {t("nav.home") || (language === "ar" ? "الرئيسية" : "Home")}
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="text-(--color-brand) font-extrabold">
              {t("nav.about") || (language === "ar" ? "من نحن" : "About Us")}
            </span>
          </nav>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-zinc-900 dark:text-white tracking-tight mb-5 max-w-4xl leading-tight">
            {language === "ar"
              ? "أساطير خضراء · ملف المؤسسة"
              : "Asateer Green · Company Profile"}
          </h1>

          <p className="max-w-2xl text-base md:text-lg text-zinc-600 dark:text-(--color-muted-foreground) font-medium">
            {language === "ar"
              ? "منظومة إبداعية وإنتاجية متكاملة في عالم الدعاية والإعلان تجمع بين دقة التصميم وقوة التصنيع."
              : "A creative and integrated production powerhouse in print & advertising, combining precise design with industrial manufacturing."}
          </p>
        </div>
      </section>

      {/* ── ثانياً: نبذة عن المؤسسة (مأخوذة نصاً من البروفايل) ── */}
      <section
        className="relative w-full py-20 overflow-hidden"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="container-x max-w-7xl px-6 mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-start">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-(--color-brand) uppercase tracking-widest">
              <Users className="w-4 h-4" />
              <span>
                {language === "ar" ? "نبذة عن المؤسسة" : "ABOUT THE COMPANY"}
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl font-black text-(--color-foreground) tracking-tight leading-tight">
              {language === "ar"
                ? "نجمع بين الإبداع والاحترافية"
                : "We Blend Creativity with Professionalism"}
            </h2>

            <p className="text-base text-(--color-muted-foreground) leading-relaxed font-normal bg-(--color-surface) p-6 rounded-2xl border border-(--color-border) shadow-xs">
              {language === "ar"
                ? "أساطير خضراء هي شركة إبداعية متخصصة في مجال الدعاية والإعلان، تقدم حلولاً متكاملة في الهوية البصرية والخدمات الإعلانية. نجمع بين الإبداع والاحترافية لنقدم لعملائنا تجربة فريدة تعكس رؤيتهم وتحقق أهدافهم التسويقية بأعلى معايير الجودة والتميز."
                : "Asateer Green is a creative firm specialized in advertising, offering integrated solutions in visual identity and advertising services. We combine creativity and professionalism to offer a unique experience that drives marketing goals with premium quality."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-(--color-brand) shrink-0" />
                <span className="text-sm font-bold text-(--color-foreground)">
                  {language === "ar"
                    ? "تقنيات ومعدات عالمية"
                    : "World-Class Equipment"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-(--color-brand) shrink-0" />
                <span className="text-sm font-bold text-(--color-foreground)">
                  {language === "ar"
                    ? "دقة ألوان متناهية"
                    : "High Color Fidelity"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-(--color-brand) shrink-0" />
                <span className="text-sm font-bold text-(--color-foreground)">
                  {language === "ar"
                    ? "مقاومة كاملة للعوامل الجوية"
                    : "Weatherproof Materials"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-(--color-brand) shrink-0" />
                <span className="text-sm font-bold text-(--color-foreground)">
                  {language === "ar"
                    ? "تنفيذ وتركيب احترافي"
                    : "Professional Installation"}
                </span>
              </div>
            </div>
          </div>

          {/* إضافة صُورة الخلفية  */}
          <div className="relative w-full aspect-square max-h-115 rounded-3xl border border-(--color-border) dark:border-zinc-800 bg-gray-100 p-8 flex flex-col justify-between overflow-hidden group shadow-lg">
            {/* صُورة خلفية الصندوق الافتراضية - استبدلي مسار الإستيراد أو الرابط بالصورة المطلوبة */}
            <img
              src={aboutBg}
              alt="Machinery Infrastructure"
              className="absolute inset-0 w-full h-full object-cover opacity-95 group-hover:scale-105 transition-transform duration-700 pointer-events-none select-none z-0"
            />

            {/* طبقة حماية لونية داكنة فوق الصورة لتجعل النصوص البيضاء تلمع ومقروءة بشكل فائق */}
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-900/60 to-zinc-950/40 z-5" />

            {/* العناصر العلوية للصندوق */}
            <div className="flex justify-between items-start relative z-10">
              <div className="p-4 rounded-2xl bg-zinc-900/80 backdrop-blur-md border border-zinc-700/50 text-white">
                <Monitor className="w-8 h-8 text-(--color-brand)" />
              </div>
              <span className="text-xs font-black tracking-widest text-zinc-300 uppercase bg-zinc-950/50 backdrop-blur-xs px-3 py-1 rounded-full border border-zinc-800">
                Est. Industry Leaders
              </span>
            </div>

            {/* النصوص السفلية للصندوق */}
            <div className="space-y-3 relative z-10 bg-zinc-950/30 backdrop-blur-xs p-4 rounded-2xl border border-zinc-800/40">
              <div className="text-xs font-bold text-(--color-brand) uppercase tracking-wider">
                {language === "ar"
                  ? "قوة العتاد والإنتاج"
                  : "MACHINERY & INFRASTRUCTURE"}
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white">
                HP · Plamac · OKI
              </h3>
              <p className="text-xs text-zinc-200 leading-relaxed font-normal">
                {language === "ar"
                  ? "تعتمد خطوط إنتاجنا على طابعات OKI المتقدمة بدقة 1200 DPI وتقنيات UV LED المتطورة من Plamac و HP لضمان ثبات تام للمطبوعات الدعائية الضخمة."
                  : "Our facilities host advanced OKI 1200 DPI LED printers alongside heavy-duty UV LED technology from Plamac and HP to support grand-scale output."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ثالثاً: الخدمات الرئيسية (الركائز الثلاثة من البروفايل) ── */}
      <section
        className="w-full py-20 bg-(--color-surface) border-y border-(--color-border)"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="container-x max-w-7xl px-6 mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
            <span className="text-xs font-bold text-(--color-brand) uppercase tracking-widest">
              {language === "ar" ? "منظومتنا" : "OUR ECOSYSTEM"}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-(--color-foreground) tracking-tight">
              {language === "ar"
                ? "الخدمات الإستراتيجية الرئيسية"
                : "Our Core Strategic Services"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-start">
            {coreServices.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-start p-6 rounded-2xl bg-(--color-background) border border-(--color-border) shadow-2xs transition-all duration-300 hover:scale-[1.01] hover:border-emerald-500/30"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-(--color-brand)/10 text-(--color-brand) mb-6">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-lg font-black text-(--color-foreground) mb-3">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-(--color-muted-foreground) leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── رابعاً: إمكانيات التصنيع المتقدمة والتطبيقات ── */}
      {/* ── رابعاً: إمكانيات التصنيع المتقدمة والتطبيقات مع صور خلفية للكروت ── */}
      <section
        className="container-x max-w-7xl px-6 mx-auto py-20"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-(--color-brand)/10 text-(--color-brand) text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {language === "ar"
                ? "القدرات الفنية والتنفيذية"
                : "Technical & Structural Capabilities"}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-(--color-foreground) tracking-tight">
            {language === "ar"
              ? "نطاق عمل وتطبيقات أساطير خضراء"
              : "Scope of Execution & Deliverables"}
          </h2>
        </div>

        {/* شبكة الكروت الأربعة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-start">
          {capabilities.map((cap, i) => (
            <div
              key={i}
              className="relative w-full h-52 p-6 md:p-8 rounded-2xl border border-(--color-border)   flex gap-4 items-start overflow-hidden group shadow-2xs"
            >
              {/* صُورة خلفية الكارت المستدعاة ديناميكياً */}
              <img
                src={cap.image}
                alt={cap.title}
                className="absolute inset-0 w-full h-full object-cover  group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none z-0"
              />

              {/* طبقة لونية ذكية لحماية النصوص: فاتحة للايت مود وداكنة للدارك مود */}
              <div className="absolute inset-0 bg-linear-to-r from-white via-white/90 to-white/40 dark:from-zinc-950 dark:via-zinc-950/85 dark:to-transparent z-5" />

              {/* النقطة الدليليّة الجمالية */}
              <div className="relative z-10 mt-1.5 w-2 h-2 rounded-full bg-(--color-brand) shrink-0" />

              {/* نصوص الكارت الهامة */}
              <div className="relative z-10 space-y-2 max-w-[85%]">
                <h3 className="text-base md:text-lg font-black text-zinc-900 dark:text-white group-hover:text-(--color-brand) transition-colors duration-300">
                  {cap.title}
                </h3>
                <p className="text-xs md:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                  {cap.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── خامساً: الـ CTA السفلي لحث العميل على طلب عرض السعر ── */}
      <section className="w-full py-16 bg-linear-to-b from-white to-zinc-50 dark:from-(--color-background) dark:to-zinc-950 border-t border-(--color-border)">
        <div className="container-x max-w-4xl px-6 mx-auto text-center space-y-6">
          <h2 className="text-2xl md:text-4xl font-black text-(--color-foreground)">
            {language === "ar"
              ? "هل أنت مستعد لإطلاق علامتك التجارية؟"
              : "Ready to Elevate Your Ambitious Brand?"}
          </h2>
          <p className="max-w-xl mx-auto text-xs md:text-sm text-(--color-muted-foreground)">
            {language === "ar"
              ? "فريقنا المتكامل من المصممين والمهندسين والتقنيين جاهزون لتحويل أفكارك ورؤيتك إلى واقع ملموس ومبهر وبأعلى جودة تصنيع."
              : "Our fully integrated team of designers and industrial fabricators are fully equipped to bring your visual goals into majestic realities."}
          </p>
          <div className="pt-2">
            <Link
              to={ROUTES.QUOTE_REQUEST}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-(--color-brand) text-emerald-950 dark:text-zinc-950 font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
            >
              {language === "ar"
                ? "طلب عرض سعر ومواصفات"
                : "Request Quote & Specs"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutView;

// about: {
//   title: "أساطير خضراء · ملف المؤسسة",
//   subtitle: "منظومة إبداعية وإنتاجية متكاملة في عالم الدعاية والإعلان تجمع بين دقة التصميم وقوة التصنيع.",
//   story_title: "نجمع بين الإبداع والاحترافية",
//   story_p1: "أساطير خضراء هي شركة إبداعية متخصصة في مجال الدعاية والإعلان، تقدم حلولاً متكاملة في الهوية البصرية والخدمات الإعلانية. نجمع بين الإبداع والاحترافية لنقدم لعملائنا تجربة فريدة تعكس رؤيتهم وتحقق أهدافهم التسويقية بأعلى معايير الجودة والتميز.",
// },
