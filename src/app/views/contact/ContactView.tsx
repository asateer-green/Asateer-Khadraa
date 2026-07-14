// src/app/views/contact/ContactView.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { ROUTES } from "../../config/routes";

export function ContactView() {
  const { t, language } = useLanguageContext();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // التحقق من المدخلات باستخدام Zod بناءً على قيم لغة النظام
  const schema = z.object({
    name: z
      .string()
      .trim()
      .min(1, {
        message: language === "ar" ? "الاسم مطلوب" : "Name is required",
      })
      .max(100),
    email: z
      .string()
      .trim()
      .email({
        message:
          language === "ar" ? "البريد غير صحيح" : "Invalid email address",
      })
      .max(255),
    message: z
      .string()
      .trim()
      .min(1, {
        message: language === "ar" ? "الرسالة مطلوبة" : "Message is required",
      })
      .max(1000),
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    const r = schema.safeParse(data);
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => {
        errs[String(i.path[0])] = i.message;
      });
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitted(true);
  };

  return (
    <main className="w-full min-h-screen bg-(--color-background)  animate-in fade-in duration-500 overflow-hidden">
      {/* ── البانر الترحيبي الهندسي الفاخر المحدث (مشرق وحيوي في السايد الفاتح) ── */}
      <section className="relative w-full py-20 md:py-28 border-b border-zinc-200 dark:border-zinc-800 bg-linear-to-b from-zinc-50 to-white dark:from-green-950 dark:to-(--color-background)">
        {/* خطوط الشبكة الهندسية المحدثة بلون أخضر زمردي شفاف ناعم */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-[0.45] dark:opacity-[0.15] bg-[linear-gradient(to_right,rgba(16,185,129,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.08)_1px,transparent_1px)] bg-size-[32px_32px]" />

        {/* تأثير التوهج المضيء الخلفي - منعش ومشرق في الفاتح وناعم في الداكن */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-300/30 dark:bg-(--color-brand)/10 blur-[120px] rounded-full pointer-events-none select-none" />

        <div className="container-x max-w-7xl px-6 mx-auto relative z-10 flex flex-col items-center text-center">
          <nav
            className="flex items-center gap-2 mb-5 text-xs font-bold text-zinc-400 dark:text-zinc-900 uppercase tracking-wider"
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            <Link
              to={ROUTES.HOME}
              className="hover:text-emerald-600 dark:hover:text-(--color-brand) transition-colors"
            >
              {t("nav.home")}
            </Link>
            <span className="text-zinc-300 dark:text-zinc-700">/</span>
            <span className="text-emerald-600 dark:text-(--color-brand) font-extrabold">
              {t("nav.contact")}
            </span>
          </nav>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white dark:text-zinc-100 tracking-tight mb-5 max-w-3xl leading-tight">
            {t("contact.title")}
          </h1>

          <p className="max-w-2xl text-base md:text-lg text-zinc-600 dark:text-zinc-600 font-medium dark:font-normal">
            {t("contact.description")}
          </p>
        </div>
      </section>

      {/* ── قسم كروت التواصل واستمارة الإرسال ── */}
      <section
        className="container-x max-w-7xl px-6 mx-auto py-20"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* الجانب الأول: كروت قنوات الاتصال السريع */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {[
              {
                Icon: Mail,
                label: t("contact.email"),
                value: "Asateer.gr@gmail.com",
                href: "mailto:Asateer.gr@gmail.com",
              },
              {
                Icon: Phone,
                label: t("contact.phone"),
                value: "+966 57 010 6501",
                href: "tel:+966570106501",
              },
              {
                Icon: MapPin,
                label: t("nav.contact"),
                value: t("contact.address"),
                href: undefined,
              },
            ].map(({ Icon, label, value, href }) => {
              const CardTag = href ? "a" : "div";
              return (
                <CardTag
                  key={label}
                  href={href}
                  className={`block rounded-3xl border border-(--color-border) bg-(--color-surface) p-6 transition-all duration-300 ${
                    href
                      ? "hover:border-emerald-500/30 hover:shadow-sm hover:-translate-y-0.5"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-5 text-start">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 dark:bg-(--color-brand)/10 text-emerald-600 dark:text-(--color-brand) shrink-0">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-(--color-muted-foreground)">
                        {label}
                      </p>
                      <p
                        className="mt-1 text-base font-extrabold text-(--color-foreground)"
                        dir="ltr"
                      >
                        {value}
                      </p>
                    </div>
                  </div>
                </CardTag>
              );
            })}
          </div>

          {/* الجانب الثاني: حاوية استمارة التواصل */}
          <div className="lg:col-span-3 rounded-3xl border border-(--color-border) bg-(--color-surface) p-8 md:p-10 shadow-xs relative">
            {submitted ? (
              <div className="flex flex-col items-center text-center py-12 animate-in zoom-in-95 duration-400">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/10 dark:bg-(--color-brand)/10 text-emerald-500 dark:text-(--color-brand)">
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <h3 className="mt-6 text-xl font-black text-(--color-foreground)">
                  {language === "ar" ? "تم الإرسال بنجاح!" : "Message Sent!"}
                </h3>
                <p className="mt-2.5 text-sm text-(--color-muted-foreground) max-w-md leading-relaxed font-medium dark:font-normal">
                  {t("contact.successMessage")}
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6" noValidate>
                <Field
                  label={t("contact.name")}
                  name="name"
                  error={errors.name}
                  placeholder={
                    language === "ar" ? "أكتب اسمك الكامل" : "Your full name"
                  }
                />
                <Field
                  label={t("contact.email")}
                  name="email"
                  type="email"
                  error={errors.email}
                  placeholder="name@company.com"
                />
                <Field
                  label={t("contact.message")}
                  name="message"
                  textarea
                  error={errors.message}
                  placeholder={
                    language === "ar"
                      ? "كيف يمكن لأساطير جرين مساعدتك؟"
                      : "Describe your project..."
                  }
                />

                <div className="flex justify-start pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-(--color-brand) text-emerald-950 dark:text-zinc-950 font-bold text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                  >
                    <span>{t("contact.send")}</span>
                    <Send className="h-4 w-4 shrink-0" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

// مكون الحقل الفرعي المرن
function Field({
  label,
  name,
  type = "text",
  textarea,
  error,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  error?: string;
  placeholder?: string;
}) {
  const baseInputStyle =
    "w-full mt-2 rounded-2xl border border-(--color-border) bg-(--color-background) px-4 py-3.5 text-sm text-(--color-foreground) placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 dark:focus:ring-emerald-400/5 transition-all duration-200";

  return (
    <label className="block text-start">
      <span className="text-[11px] font-bold uppercase tracking-wider text-(--color-muted-foreground)">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          rows={5}
          placeholder={placeholder}
          className={`${baseInputStyle} resize-none`}
          maxLength={1000}
          required
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          className={baseInputStyle}
          maxLength={255}
          required
        />
      )}
      {error && (
        <span className="mt-1.5 block text-xs font-semibold text-rose-500 dark:text-rose-400 animate-in fade-in duration-200">
          {error}
        </span>
      )}
    </label>
  );
}

export default ContactView;
