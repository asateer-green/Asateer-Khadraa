import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguageContext } from "../../app/providers/LanguageProvider";
import { useThemeContext } from "../../app/providers/ThemeProvider";
import { ROUTES } from "../../app/config/routes";
import Logo from "../../assets/logos/favicon.ico";

// ── Breakpoint hook ────────────────────────────────────────────────────────
function useIsMobile(bp = 768) {
  const [v, setV] = useState(
    () => typeof window !== "undefined" && window.innerWidth < bp,
  );
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${bp - 1}px)`);
    const handler = (e: MediaQueryListEvent) => setV(e.matches);
    setV(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [bp]);
  return v;
}

// ── Social links ───────────────────────────────────────────────────────────
const SOCIALS = [
  {
    label: "واتساب",
    href: "https://wa.me/966570105601",
    icon: (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    ),
  },
  // {
  //   label: "إنستغرام",
  //   href: "https://instagram.com",
  //   icon: (
  //     <svg
  //       width="17"
  //       height="17"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //       aria-hidden="true"
  //     >
  //       <rect x="2" y="2" width="20" height="20" rx="5" />
  //       <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
  //       <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  //     </svg>
  //   ),
  // },
  // {
  //   label: "X / Twitter",
  //   href: "https://x.com",
  //   icon: (
  //     <svg
  //       width="15"
  //       height="15"
  //       viewBox="0 0 24 24"
  //       fill="currentColor"
  //       aria-hidden="true"
  //     >
  //       <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  //     </svg>
  //   ),
  // },
  // {
  //   label: "LinkedIn",
  //   href: "https://linkedin.com",
  //   icon: (
  //     <svg
  //       width="16"
  //       height="16"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //       aria-hidden="true"
  //     >
  //       <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
  //       <rect x="2" y="9" width="4" height="12" />
  //       <circle cx="4" cy="4" r="2" />
  //     </svg>
  //   ),
  // },
];

// ── Footer ─────────────────────────────────────────────────────────────────
export function Footer() {
  const { t, language } = useLanguageContext();
  const { theme } = useThemeContext();
  const isMobile = useIsMobile(768);
  const year = new Date().getFullYear();

  // const isDark = theme === "dark";
  const isAr = language === "ar";
  // 1. أضيفي State محلي للتحقق من الوضع المظلم
const [isDark, setIsDark] = useState(theme === "dark");

// 2. استخدمي useEffect لمراقبة وتحديث الوضع المظلم بدقة حتى للمستخدمين الآخرين
useEffect(() => {
  // فحص ما إذا كان الـ Context مظلماً، أو إذا كان كلاس dark موجوداً في الـ document
  const hasDarkClass = document.documentElement.classList.contains("dark") || 
                       document.body.classList.contains("dark");
  
  setIsDark(theme === "dark" || hasDarkClass);
}, [theme]);

  // 🎨 ديناميكية الألوان بناءً على الـ Theme الحالي
  const textColor = isDark
    ? "var(--color-slate-400, #8da5ba)"
    : "var(--color-slate-600, #5c6f84)";
  const hoverColor = "var(--color-brand-500, #10b981)";

  const linkStyle: React.CSSProperties = {
    fontSize: "0.845rem",
    color: textColor,
    textDecoration: "none",
    display: "inline-block",
    transition: "color 0.2s, padding-inline-start 0.2s",
  };

  const hoverLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    (e.currentTarget as HTMLAnchorElement).style.color = hoverColor;
    (e.currentTarget as HTMLAnchorElement).style.paddingInlineStart = "4px";
  };
  const leaveLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    (e.currentTarget as HTMLAnchorElement).style.color = textColor;
    (e.currentTarget as HTMLAnchorElement).style.paddingInlineStart = "0";
  };

  const colStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    minWidth: 0,
  };

  const colHeading: React.CSSProperties = {
    fontSize: "0.68rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: isDark ? "var(--color-brand-400)" : "var(--color-brand-600)",
    margin: 0,
  };

  return (
    <footer
      role="contentinfo"
      style={{
        position: "relative",
        background: isDark
          ? "var(--color-bg-glow)"
          : "var(--color-slate-50, #f8fafc)",
        color: isDark
          ? "var(--color-slate-300, #b8cad9)"
          : "var(--color-slate-700, #334155)",
        borderTop: isDark
          ? "none"
          : "1px solid var(--color-slate-200, #e2e8f0)",
        overflow: "hidden",
        transition: "background 0.3s, color 0.3s, border 0.3s",
      }}
    >
      <style>{`
        @keyframes ag-gradient-shift {
          0%  { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100%{ background-position: 0% 50%; }
        }
        .footer-social-btn:hover {
          color: ${hoverColor} !important;
          border-color: ${isDark ? "var(--color-brand-600)" : "var(--color-brand-400)"} !important;
          background: ${isDark ? "color-mix(in srgb, var(--color-brand-500) 12%, var(--color-dark-750, #142c3e))" : "color-mix(in srgb, var(--color-brand-500) 8%, #ffffff)"} !important;
          transform: translateY(-2px) !important;
        }
      `}</style>

      {/* Gradient top stripe */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          insetInline: 0,
          height: "3px",
          background:
            "linear-gradient(90deg, var(--color-brand-700), var(--color-brand-500), var(--color-teal-400), var(--color-brand-500), var(--color-brand-700))",
          backgroundSize: "300% 100%",
          animation: "ag-gradient-shift 6s ease infinite",
        }}
      />

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-80px",
          insetInlineEnd: "8%",
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, color-mix(in srgb, var(--color-brand-500) 7%, transparent) 0%, transparent 70%)"
            : "radial-gradient(circle, color-mix(in srgb, var(--color-brand-400) 12%, transparent) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main grid */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "3.5rem 1.5rem 2rem",
          display: "grid",
          gap: "2.5rem",
          gridTemplateColumns: isMobile ? "1fr" : "1.6fr 1fr 1fr 1fr",
        }}
      >
        {/* ── Brand column ── */}
        <div style={colStyle}>
          {/* Logo */}
          <Link
            to={ROUTES.HOME}
            aria-label="أساطير خضراء – الرئيسية"
            className="flex items-center gap-3 no-underline shrink-0 group"
          >
            {/* 1. صورة اللوجو بأبعاد متناسقة وتأثير hover ناعم */}
            <img
              src={Logo}
              alt="Logo"
              className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-105"
            />

            {/* 2. حاوية النصوص الجانبية (مرصوصة عمودياً) */}
            <div className="flex flex-col leading-[1.2] text-right">
              {/* اسم المؤسسة الرئيسي بالـ Gradient المضيء */}
              <span className="font-display font-bold text-[1.15rem] bg-linear-to-r from-(--color-brand) to-(--color-accent) bg-clip-text text-transparent">
                {language === "ar" ? "أساطير خضراء" : "Asateer Green"}
              </span>

              {/* الوصف الفرعي السفلي */}
              <span className="text-[0.58rem] font-medium tracking-[0.12em] uppercase text-(--color-muted-foreground)">
                Print &amp; Advertising
              </span>
            </div>
          </Link>

          {/* Tagline */}
          <p
            style={{
              fontSize: "0.82rem",
              lineHeight: 1.75,
              color: isDark
                ? "var(--color-slate-400, #8da5ba)"
                : "var(--color-slate-600, #475569)",
              maxWidth: "270px",
              margin: 0,
            }}
          >
            {t("about.description2")}
          </p>

          {/* Socials */}
          {/* <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="footer-social-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "34px",
                  height: "34px",
                  borderRadius: "8px",
                  background: isDark
                    ? "var(--color-dark-750, #142c3e)"
                    : "var(--color-slate-100, #f1f5f9)",
                  border: isDark
                    ? "1px solid var(--color-dark-700, #1a3549)"
                    : "1px solid var(--color-slate-200, #e2e8f0)",
                  color: isDark
                    ? "var(--color-slate-400, #8da5ba)"
                    : "var(--color-slate-600, #475569)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </a>
            ))}
          </div> */}
        </div>

        {/* ── Services column ── */}
        <div style={colStyle}>
          <h3 style={colHeading}>{t("nav.services")}</h3>
          <ul
            role="list"
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.55rem",
            }}
          >
            {[
              { label: t("nav.home"), href: ROUTES.SERVICES },
              { label: t("nav.services"), href: ROUTES.SERVICES },
              {
                label: t("nav.portfolio"),
                href: ROUTES.SERVICES,
              },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link
                  to={href}
                  style={linkStyle}
                  onMouseEnter={hoverLink}
                  onMouseLeave={leaveLink}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Company column ── */}
        <div style={colStyle}>
          <h3 style={colHeading}>{t("nav.about")}</h3>
          <ul
            role="list"
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.55rem",
            }}
          >
            {[
              { label: t("nav.about"), href: ROUTES.ABOUT },
              { label: t("nav.portfolio"), href: ROUTES.PORTFOLIO },
              { label: t("nav.contact"), href: ROUTES.CONTACT },
              { label: t("nav.quoteRequest"), href: ROUTES.QUOTE_REQUEST },
            ].map(({ label, href }) => (
              <li key={label}>
                <Link
                  to={href}
                  style={linkStyle}
                  onMouseEnter={hoverLink}
                  onMouseLeave={leaveLink}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Contact column ── */}
        <div style={colStyle}>
          <h3 style={colHeading}>{t("contact.title")}</h3>
          <ul
            role="list"
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {/* whatsapp */}
            <li>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="footer-social-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "34px",
                  height: "34px",
                  borderRadius: "8px",
                  background: isDark
                    ? "var(--color-dark-750, #142c3e)"
                    : "var(--color-slate-100, #f1f5f9)",
                  border: isDark
                    ? "1px solid var(--color-dark-700, #1a3549)"
                    : "1px solid var(--color-slate-200, #e2e8f0)",
                  color: isDark
                    ? "var(--color-slate-400, #8da5ba)"
                    : "var(--color-slate-600, #475569)",
                  textDecoration: "none",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
            </li>
            {/* Phone */}
            <li>
              <a
                href={`tel:${t("contact.phoneNumber")}`}
                style={{
                  ...linkStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
                onMouseEnter={hoverLink}
                onMouseLeave={leaveLink}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.99 3.23 2 2 0 0 1 3.98 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span dir="ltr">{t("contact.phoneNumber")}</span>
              </a>
            </li>

            {/* Email */}
            <li>
              <a
                href={`mailto:${t("contact.emailAddress")}`}
                style={{
                  ...linkStyle,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  wordBreak: "break-all",
                }}
                onMouseEnter={hoverLink}
                onMouseLeave={leaveLink}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ flexShrink: 0 }}
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {t("contact.emailAddress")}
              </a>
            </li>

            {/* Location */}
            <li
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.845rem",
                color: isDark
                  ? "var(--color-slate-500)"
                  : "var(--color-slate-600)",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ flexShrink: 0 }}
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {t("contact.address")}
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: isDark
            ? "1px solid var(--color-dark-800, #102535)"
            : "1px solid var(--color-slate-200, #e2e8f0)",
          padding: "1.1rem 1.5rem",
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
        }}
      >
        <p
          style={{
            fontSize: "0.73rem",
            color: isDark
              ? "var(--color-slate-600, #4e6475)"
              : "var(--color-slate-500, #64748b)",
            margin: 0,
          }}
        >
          © {year}{" "}
          <span style={{ color: "var(--color-brand-600)", fontWeight: 600 }}>
            {isAr ? "أساطير خضراء" : "Asateer Green"}
          </span>
          {isAr ? " · جميع الحقوق محفوظة" : " · All rights reserved"}
        </p>

        <div style={{ display: "flex", gap: "1.25rem" }}>
          {(isAr
            ? ([
                ["سياسة الخصوصية", "#"],
                ["الشروط والأحكام", "#"],
              ] as const)
            : ([
                ["Privacy Policy", "#"],
                ["Terms of Service", "#"],
              ] as const)
          ).map(([label, href]) => (
            <a
              key={label}
              href={href}
              style={{
                fontSize: "0.71rem",
                color: isDark
                  ? "var(--color-slate-600, #4e6475)"
                  : "var(--color-slate-500, #64748b)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = isDark
                  ? "var(--color-slate-400)"
                  : "var(--color-slate-800)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = isDark
                  ? "var(--color-slate-600, #4e6475)"
                  : "var(--color-slate-500, #64748b)")
              }
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
