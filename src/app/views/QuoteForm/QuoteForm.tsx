// src/app/views/services/RequestQuoteView.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { ROUTES } from "../../config/routes";
import {
  ArrowRight,
  ArrowLeft,
  Send,
  Upload,
  CheckCircle2,
  FileText,
} from "lucide-react";

// ⚠️ ضع رقم واتساب الشركة بالصيغة الدولية بدون + أو 00 (مثال: 9665XXXXXXXX)

export function QuoteForm() {
  const { t, language } = useLanguageContext();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // حقول النموذج (controlled) لاستخدامها في رسالة واتساب
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const serviceLabel = (val: string) => {
    const map: Record<string, { ar: string; en: string }> = {
      design: {
        ar: "التصميم والميديا والهوية البصرية",
        en: "Design & Media Identity",
      },
      printing: {
        ar: "خدمات الطباعة الرقمية والأوفست",
        en: "Printing Services",
      },
      manufacturing: {
        ar: "تصنيع اللوحات والستاندات والمعارض",
        en: "Signage & Manufacturing",
      },
      gifts: {
        ar: "الهدايا الدعائية ومطبوعات الشركات VIP",
        en: "Corporate Promotional Gifts",
      },
      advertising: {
        ar: " الإعلانات الخارجية والميدانية",
        en: "Outdoor Advertising",
      },
      branding: {
        ar: "الهوية البصرية والتصميم الجرافيكي",
        en: "Branding & Design",
      },
      events: {
        ar: " تجهيز الفعاليات والمناسبات الوطنية والموسمية",
        en: "Event Planning & Setup",
      },
      other: { ar: "خدمات اخرى", en: "Other Services" },
    };
    if (!val) return "-";
    return language === "ar" ? (map[val]?.ar ?? val) : (map[val]?.en ?? val);
  };

  const buildWhatsAppMessage = () => {
    if (language === "ar") {
      return [
        "*طلب عرض سعر جديد*",
        "",
        `*الاسم:* ${fullName}`,
        `*الشركة:* ${company || "-"}`,
        `*البريد:* ${email}`,
        `*الجوال:* ${phone}`,
        `*الخدمة:* ${serviceLabel(service)}`,
        "",
        "*تفاصيل المشروع:*",
        details,
        selectedFile
          ? `\n*ملف مرفق:* ${selectedFile.name} (سيتم إرساله يدوياً)`
          : "",
      ].join("\n");
    }
    return [
      "*New Quote Request*",
      "",
      `*Name:* ${fullName}`,
      `*Company:* ${company || "-"}`,
      `*Email:* ${email}`,
      `*Phone:* ${phone}`,
      `*Service:* ${serviceLabel(service)}`,
      "",
      "*Project Details:*",
      details,
      selectedFile
        ? `\n*Attached file:* ${selectedFile.name} (will be sent manually)`
        : "",
    ].join("\n");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(buildWhatsAppMessage());
    const url = `https://wa.me/${966503491912}?text=${text}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIsSubmitted(true);
  };

  return (
    <main className="w-full min-h-screen bg-(--color-background) animate-in fade-in duration-500 overflow-hidden">
      {/* ── البانر الترحيبي الهندسي الفاخر ── */}
      <section className="relative w-full py-16 md:py-24 border-b border-zinc-200 dark:border-zinc-800 bg-linear-to-b from-zinc-50 to-white dark:from-green-950 dark:to-(--color-background)">
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.35] dark:opacity-[0.15] bg-[linear-gradient(to_right,rgba(0,229,147,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,229,147,0.12)_1px,transparent_1px)] bg-size-[32px_32px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-400/20 dark:bg-(--color-brand)/15 blur-[100px] rounded-full pointer-events-none select-none" />

        <div className="container-x max-w-4xl px-6 mx-auto relative z-10 flex flex-col items-center text-center">
          <nav
            className="flex items-center gap-2 mb-5 text-xs font-bold text-zinc-500 dark:text-zinc-900 uppercase tracking-wider"
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            <Link
              to={ROUTES.HOME}
              className="hover:text-(--color-brand) transition-colors"
            >
              {t("nav.home") || (language === "ar" ? "الرئيسية" : "Home")}
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <Link
              to={ROUTES.SERVICES || "/services"}
              className="hover:text-(--color-brand) transition-colors"
            >
              {t("nav.services") ||
                (language === "ar" ? "خدماتنا" : "Our Services")}
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="text-(--color-brand) font-extrabold">
              {t("quote.breadcrumb") ||
                (language === "ar" ? "طلب تسعيرة" : "Request a Quote")}
            </span>
          </nav>

          <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight mb-4 leading-tight">
            {t("quote.title") ||
              (language === "ar"
                ? "طلب عرض سعر مخصص"
                : "Request a Custom Quote")}
          </h1>
          <p className="max-w-xl text-sm md:text-base text-zinc-600 dark:text-(--color-muted-foreground) font-medium">
            {t("quote.subtitle") ||
              (language === "ar"
                ? "زودنا بتفاصيل مشروعك وسيقوم فريق المبيعات بإعداد مقترح مالي وفني خلال أقل من 24 ساعة."
                : "Provide us with your project details, and our sales team will prepare a financial and technical proposal within 24 hours.")}
          </p>
        </div>
      </section>

      {/* ── قسم النموذج (Form Section) ── */}
      <section
        className="container-x max-w-3xl px-6 mx-auto py-16"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="w-full rounded-3xl border border-(--color-border) bg-(--color-surface) p-8 md:p-12 shadow-sm relative">
          {isSubmitted ? (
            /* رسالة نجاح الإرسال */
            <div className="flex flex-col items-center text-center py-12 animate-in scale-in duration-300">
              <CheckCircle2 className="w-20 h-20 text-(--color-brand) mb-6 stroke-[1.5]" />
              <h2 className="text-2xl font-black text-(--color-foreground) mb-3">
                {t("quote.success_title") ||
                  (language === "ar"
                    ? "تم تحويلك إلى واتساب!"
                    : "Redirected to WhatsApp!")}
              </h2>
              <p className="text-sm text-(--color-muted-foreground) max-w-md leading-relaxed">
                {t("quote.successMessage") ||
                  (language === "ar"
                    ? "تم فتح محادثة واتساب مع تفاصيل طلبك. اضغط إرسال داخل واتساب لإكمال الطلب، وسيتم التواصل معك قريباً."
                    : "A WhatsApp chat opened with your request details. Tap send inside WhatsApp to complete your request.")}
              </p>
              <Link
                to={ROUTES.HOME}
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                {language === "ar" ? (
                  <ArrowRight className="w-4 h-4" />
                ) : (
                  <ArrowLeft className="w-4 h-4" />
                )}
                <span>
                  {language === "ar" ? "العودة للرئيسية" : "Back to Home"}
                </span>
                {language === "ar" ? null : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>
          ) : (
            /* النموذج الحقيقي لجمع المتطلبات */
            <form onSubmit={handleSubmit} className="space-y-6 text-start">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* الاسم */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-(--color-foreground)/80 uppercase tracking-wider">
                    {language === "ar" ? "الاسم الكريم *" : "Full Name *"}
                  </label>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={
                      language === "ar"
                        ? "أدخل اسمك الكامل"
                        : "Enter your full name"
                    }
                    className="w-full px-4 py-3 rounded-xl border border-(--color-border) bg-(--color-background) text-sm focus:outline-hidden focus:border-(--color-brand) transition-colors"
                  />
                </div>
                {/* اسم الشركة */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-(--color-foreground)/80 uppercase tracking-wider">
                    {language === "ar" ? "اسم الشركة / الجهة" : "Company Name"}
                  </label>
                  <input
                    required
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder={
                      language === "ar"
                        ? "أدخل اسم الشركة"
                        : "Enter company name"
                    }
                    className="w-full px-4 py-3 rounded-xl border border-(--color-border) bg-(--color-background) text-sm focus:outline-hidden focus:border-(--color-brand) transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* البريد الإلكتروني */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-(--color-foreground)/80 uppercase tracking-wider">
                    {language === "ar"
                      ? "البريد الإلكتروني *"
                      : "Email Address *"}
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      language === "ar"
                        ? "أدخل عنوان بريدك الإلكتروني"
                        : "Enter your email address"
                    }
                    className="w-full px-4 py-3 rounded-xl border border-(--color-border) bg-(--color-background) text-sm focus:outline-hidden focus:border-(--color-brand) transition-colors"
                    dir="ltr"
                  />
                </div>
                {/* رقم الجوال */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-(--color-foreground)/80 uppercase tracking-wider">
                    {language === "ar"
                      ? "رقم الهاتف / الجوال *"
                      : "Phone Number *"}
                  </label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={
                      language === "ar"
                        ? "أدخل رقم هاتفك"
                        : "Enter your phone number"
                    }
                    className="w-full px-4 py-3 rounded-xl border border-(--color-border) bg-(--color-background) text-sm focus:outline-hidden focus:border-(--color-brand) transition-colors"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* نوع الخدمة المطلوبة */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="service-select"
                  className="text-xs font-bold text-(--color-foreground)/80 uppercase tracking-wider"
                >
                  {language === "ar"
                    ? "نوع الخدمة المطلوبة *"
                    : "Select Required Service *"}
                </label>
                <select
                  id="service-select"
                  required
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-(--color-border) bg-(--color-background) text-sm focus:outline-hidden focus:border-(--color-brand) transition-colors cursor-pointer"
                >
                  <option value="">
                    {language === "ar"
                      ? "-- اختر الخدمة الأساسية --"
                      : "-- Choose Main Service --"}
                  </option>
                  <option value="design">
                    {language === "ar"
                      ? "التصميم والميديا والهوية البصرية"
                      : "Design & Media Identity"}
                  </option>
                  <option value="printing">
                    {language === "ar"
                      ? "خدمات الطباعة الرقمية والأوفست"
                      : "Printing Services"}
                  </option>
                  <option value="manufacturing">
                    {language === "ar"
                      ? "تصنيع اللوحات والستاندات والمعارض"
                      : "Signage & Manufacturing"}
                  </option>
                  <option value="gifts">
                    {language === "ar"
                      ? "الهدايا الدعائية ومطبوعات الشركات VIP"
                      : "Corporate Promotional Gifts"}
                  </option>
                  <option value="advertising">
                    {language === "ar"
                      ? "الإعلانات الخارجية والميدانية"
                      : "Outdoor Advertising"}
                  </option>
                  <option value="branding">
                    {language === "ar"
                      ? "الهوية البصرية والتصميم الجرافيكي"
                      : "Branding & Design"}
                  </option>
                  <option value="events">
                    {language === "ar"
                      ? "تجهيز الفعاليات والمناسبات الوطنية والموسمية"
                      : "Event Planning & Setup"}
                  </option>
                  <option value="other">
                    {language === "ar" ? "خدمات اخرى" : "Other Services"}
                  </option>
                </select>
              </div>

              {/* تفاصيل المواصفات والكميات */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-(--color-foreground)/80 uppercase tracking-wider">
                  {language === "ar"
                    ? "تفاصيل ومواصفات المشروع (الكميات، المقاسات، الخامات) *"
                    : "Project Specs & Quantities *"}
                </label>
                <textarea
                  required
                  rows={5}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-(--color-border) bg-(--color-background) text-sm focus:outline-hidden focus:border-(--color-brand) transition-colors resize-none placeholder-zinc-400 dark:placeholder-zinc-600"
                  placeholder={
                    language === "ar"
                      ? "يرجى كتابة كمية المنتجات المطلوبة، المقاسات التقريبية، وأي شروط فنية..."
                      : "Please describe quantities, sizes, and technical requirements..."
                  }
                ></textarea>
              </div>

              {/* حقل رفع ملفات التصميم أو القياسات */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="file-upload"
                  className="text-xs font-bold text-(--color-foreground)/80 uppercase tracking-wider"
                >
                  {language === "ar"
                    ? "إرفاق الشعار أو ملف القياسات والتصميم (إن وجد)"
                    : "Attach Logo or Specs File (Optional)"}
                </label>
                <div className="relative w-full border-2 border-dashed border-(--color-border) rounded-xl p-6 bg-(--color-background)/50 hover:bg-(--color-background) transition-colors text-center flex flex-col items-center justify-center cursor-pointer group">
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    accept=".pdf,.png,.jpg,.jpeg,.zip,.ai"
                  />
                  <Upload className="w-8 h-8 text-zinc-400 group-hover:text-(--color-brand) transition-colors mb-2 stroke-[1.5]" />
                  {selectedFile ? (
                    <div className="flex items-center gap-2 text-sm text-(--color-foreground) font-semibold">
                      <FileText className="w-4 h-4 text-(--color-brand)" />
                      <span>{selectedFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                        {language === "ar"
                          ? "اسحب الملف هنا أو اضغط للتصفح"
                          : "Drag your file here or click to browse"}
                      </p>
                      <p className="text-[10px] text-zinc-400 mt-1">
                        PDF, PNG, JPG, ZIP, AI (Max 25MB)
                      </p>
                    </>
                  )}
                </div>
                {selectedFile && (
                  <p className="text-[11px] text-zinc-500 mt-1">
                    {language === "ar"
                      ? "ملاحظة: واتساب لا يسمح بإرسال الملفات تلقائياً عبر الرابط، يرجى إرفاق الملف يدوياً داخل المحادثة بعد فتحها."
                      : "Note: WhatsApp can't auto-attach files via link. Please attach the file manually in the chat after it opens."}
                  </p>
                )}
              </div>

              {/* زر الإرسال المشرق */}
              <button
                type="submit"
                className="w-full mt-4 inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-(--color-brand) text-emerald-950 dark:text-zinc-950 font-black text-sm shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
              >
                <span>
                  {language === "ar"
                    ? "إرسال الطلب عبر واتساب"
                    : "Send Request via WhatsApp"}
                </span>
                {language === "ar" ? (
                  <Send className="w-4 h-4 rotate-180" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

export default QuoteForm;
// quote.success_desc
