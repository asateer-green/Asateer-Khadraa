// src/components/layout/Navbar.tsx
//
// FIX NOTES:
// 1. كل الـ responsive مبني على JS state (isMobile) بدل Tailwind classes
//    لأن style={{ display }} بيـ override className في React
// 2. useLanguageContext و useThemeContext بالأسماء الصحيحة من الـ Providers
// 3. t() fallback يظهر النص بدل الـ key لو الترجمة مفقودة

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useThemeContext } from "../../app/providers/ThemeProvider";
import { useLanguageContext } from "../../app/providers/LanguageProvider";
import { ROUTES } from "../../app/config/routes";
import Logo from "../../assets/logos/favicon.ico";
// ─────────────────────────────────────────────────────────────────────────────
// Drawer footer
// ─────────────────────────────────────────────────────────────────────────────
interface NavItem {
  labelKey: string;
  href: string;
}
const NAV_ITEMS: NavItem[] = [
  { labelKey: "nav.home", href: ROUTES.HOME },
  { labelKey: "nav.about", href: ROUTES.ABOUT },
  { labelKey: "nav.services", href: ROUTES.SERVICES },
  { labelKey: "nav.portfolio", href: ROUTES.PORTFOLIO },
  // { labelKey: "nav.contact", href: ROUTES.CONTACT },
];

// ─────────────────────────────────────────────────────────────────────────────
// Breakpoint hook  (replaces Tailwind responsive classes)
// ─────────────────────────────────────────────────────────────────────────────
function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < breakpoint,
  );
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}

// ─────────────────────────────────────────────────────────────────────────────
// Inline icons (zero external deps)
// ─────────────────────────────────────────────────────────────────────────────
const SunIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const MoonIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
  </svg>
);
const CloseIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const GlobeIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Bottom tab-bar icons (LinkedIn-style: icon + label, mobile only)
// ─────────────────────────────────────────────────────────────────────────────
const HomeTabIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill={active ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
  </svg>
);
const ServicesTabIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect
      x="3"
      y="7"
      width="18"
      height="13"
      rx="2"
      fill={active ? "currentColor" : "none"}
      fillOpacity={active ? 0.15 : 0}
    />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="3" y1="12" x2="21" y2="12" />
  </svg>
);
const PortfolioTabIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect
      x="3"
      y="4"
      width="18"
      height="16"
      rx="2"
      fill={active ? "currentColor" : "none"}
      fillOpacity={active ? 0.15 : 0}
    />
    <circle cx="8.5" cy="9.5" r="1.5" />
    <path d="m21 15-5-5-9 9" />
  </svg>
);
const ContactTabIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect
      x="2"
      y="5"
      width="20"
      height="14"
      rx="2"
      fill={active ? "currentColor" : "none"}
      fillOpacity={active ? 0.15 : 0}
    />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
const MoreTabIcon = ({ active }: { active?: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="4.5" cy="12" r="1.6" fill={active ? "currentColor" : "none"} />
    <circle cx="12" cy="12" r="1.6" fill={active ? "currentColor" : "none"} />
    <circle cx="19.5" cy="12" r="1.6" fill={active ? "currentColor" : "none"} />
  </svg>
);

// خريطة الأيقونات لكل رابط — بترجع الأيقونة المناسبة حسب href
function getBottomTabIcon(href: string, active: boolean) {
  switch (href) {
    case ROUTES.HOME:
      return <HomeTabIcon active={active} />;
    case ROUTES.SERVICES:
      return <ServicesTabIcon active={active} />;
    case ROUTES.PORTFOLIO:
      return <PortfolioTabIcon active={active} />;
    case ROUTES.CONTACT:
      return <ContactTabIcon active={active} />;
    default:
      return <HomeTabIcon active={active} />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────────────────────────
export function Navbar() {
  const { resolvedTheme, toggleTheme } = useThemeContext();
  const { t, language, toggleLanguage, direction } = useLanguageContext();
  const location = useLocation();
  const isMobile = useIsMobile(768);
  const isDark = resolvedTheme === "dark";

  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);
  const moreTabRef = useRef<HTMLButtonElement>(null);
  const isRtl = direction === "rtl";

  // ── close drawer on route change ──
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // ── close drawer when switching to desktop ──
  useEffect(() => {
    if (!isMobile) setDrawerOpen(false);
  }, [isMobile]);

  // ── scroll detection ──
  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ── body scroll lock ──
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // ── focus trap inside drawer ──
  useEffect(() => {
    if (!drawerOpen || !drawerRef.current) return;
    const el = drawerRef.current;
    const nodes = el.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (
        e.shiftKey
          ? document.activeElement === first
          : document.activeElement === last
      ) {
        e.preventDefault();
        (e.shiftKey ? last : first)?.focus();
      }
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        moreTabRef.current?.focus();
      }
    };
    document.addEventListener("keydown", trap);
    document.addEventListener("keydown", esc);
    first?.focus();
    return () => {
      document.removeEventListener("keydown", trap);
      document.removeEventListener("keydown", esc);
    };
  }, [drawerOpen]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // ── Secret admin access: 5 taps on logo ──────────────────────────────
  const navigate = useNavigate();
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleLogoTap = useCallback(() => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      navigate(ROUTES.LOGIN);
      return;
    }
    tapTimerRef.current = setTimeout(() => { tapCountRef.current = 0; }, 2000);
  }, [navigate]);

  // ── styles ──────────────────────────────────────────────────────────────

  const iconBtn: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    color: "var(--color-text-secondary)",
    cursor: "pointer",
    transition: "background 0.18s, color 0.18s",
    flexShrink: 0,
  };

  const activeLink: React.CSSProperties = {
    color: "var(--color-brand-500)",
    fontWeight: 600,
    textDecoration: "none",
    fontSize: "0.875rem",
    transition: "color 0.2s",
    position: "relative",
    paddingBottom: "4px",
  };

  const inactiveLink: React.CSSProperties = {
    color: "var(--color-text-secondary)",
    fontWeight: 400,
    textDecoration: "none",
    fontSize: "0.875rem",
    transition: "color 0.2s",
    position: "relative",
    paddingBottom: "4px",
  };

  return (
    <>
      {/* ── Inject underline animation once ───────────────────────────── */}
      <style>{`
        .nav-link-item::after {
          content: "";
          position: absolute;
          bottom: 0;
          inset-inline-start: 0;
          width: 100%;
          height: 2px;
          border-radius: 9999px;
          background: var(--color-brand-500);
          transform: scaleX(0);
          transform-origin: start;
          transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        .nav-link-item.active-link::after,
        .nav-link-item:hover::after { transform: scaleX(1); }
        .nav-link-item:hover { color: var(--color-text-primary) !important; }

        .icon-btn:hover {
          background: var(--color-bg-secondary) !important;
          color: var(--color-brand-500) !important;
        }
        .drawer-link:hover {
          color: var(--color-brand-500) !important;
          background: color-mix(in srgb, var(--color-brand-500) 8%, transparent) !important;
        }
        .bottom-tab-link:active {
          opacity: 0.6;
        }

        /* بنسيب مساحة تحت محتوى الصفحة عشان مايتغطاش بالـ bottom tab bar
           (بنستهدف الـ body مباشرة عشان الـ Navbar ممكن يترندر فوق الـ Outlet
           وأي spacer محلي هنا مش هيوصل لآخر الصفحة فعلياً) */
        @media (max-width: 767px) {
          body {
            padding-bottom: calc(58px + env(safe-area-inset-bottom, 0px));
          }
        }
      `}</style>

      {/* ── Header bar ──────────────────────────────────────────────────── */}
      <header
        role="banner"
        style={{
          position: "fixed",
          top: 0,
          insetInline: 0,
          zIndex: 1000,
          height: "64px",
          display: "flex",
          alignItems: "center",
          transition: "background 0.3s, box-shadow 0.3s, border-color 0.3s",

          /* 👇 التعديل هنا: نخليه يقرأ درجة الـ bg-primary الجديدة مضاف لها شفافية بسيطة ولطيفة للـ Glassmorphism دايماً */
          background: "var(--color-bg-glow)",
          backdropFilter: "blur(18px) saturate(1.6)",
          WebkitBackdropFilter: "blur(18px) saturate(1.6)",

          /* الحدود والظلال تتأثر بالـ Scroll بس عشان تفصل الناف بار لما نتحرك */
          borderBottom: `1px solid ${isScrolled ? "var(--color-border)" : "transparent"}`,
          boxShadow: isScrolled ? "0 4px 30px -8px rgba(0,0,0,0.08)" : "none",
        }}
      >
        <nav
          aria-label="القائمة الرئيسية"
          style={{
            width: "100%",
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          {/* Logo */}
          <Link
            to={ROUTES.HOME}
            onClick={handleLogoTap}
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

          {/* Desktop links — only rendered on desktop */}
          {!isMobile && (
            <ul
              role="list"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2rem",
                listStyle: "none",
                margin: 0,
                padding: 0,
              }}
            >
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    end={item.href === ROUTES.HOME}
                    className={({ isActive }) =>
                      `nav-link-item${isActive ? " active-link" : ""}`
                    }
                    style={({ isActive }) =>
                      isActive ? activeLink : inactiveLink
                    }
                  >
                    {t(item.labelKey)}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}

          {/* Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flexShrink: 0,
            }}
          >
            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="icon-btn"
              style={iconBtn}
              aria-label={t("theme.toggle")}
              title={isDark ? t("theme.light") : t("theme.dark")}
            >
              <span
                style={{
                  display: "inline-flex",
                  transition: "transform 0.35s",
                  transform: isDark ? "rotate(0deg)" : "rotate(200deg)",
                }}
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
              </span>
            </button>

            {/* Language switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="icon-btn"
              style={{
                ...iconBtn,
                width: "auto",
                paddingInline: "8px",
                gap: "4px",
              }}
              aria-label={t("language.switch")}
              title={
                language === "ar" ? "Switch to English" : "التبديل للعربية"
              }
            >
              <GlobeIcon />
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}
              >
                {language === "ar" ? "EN" : "ع"}
              </span>
            </button>

            {/* CTA — desktop only */}
            {!isMobile && (
              <Link
                to={ROUTES.QUOTE_REQUEST}
                style={{
                  marginInlineStart: "8px",
                  paddingInline: "14px",
                  paddingBlock: "7px",
                  borderRadius: "var(--radius-md, 8px)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  background: "var(--color-brand-500)",
                  color: "#fff",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transition:
                    "background 0.2s, box-shadow 0.2s, transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "var(--color-brand-400)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "var(--shadow-brand, 0 0 20px -4px rgba(0,184,106,0.4))";
                  (e.currentTarget as HTMLAnchorElement).style.transform =
                    "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "var(--color-brand-500)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "none";
                  (e.currentTarget as HTMLAnchorElement).style.transform =
                    "translateY(0)";
                }}
              >
                {t("nav.quoteRequest")}
              </Link>
            )}

          </div>
        </nav>
      </header>

      {/* ── Backdrop ──────────────────────────────────────────────────────── */}
      {isMobile && (
        <div
          aria-hidden="true"
          onClick={closeDrawer}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 998,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(3px)",
            transition: "opacity 0.28s",
            opacity: drawerOpen ? 1 : 0,
            pointerEvents: drawerOpen ? "auto" : "none",
          }}
        />
      )}

      {/* ── Mobile Drawer ─────────────────────────────────────────────────── */}
      {isMobile && (
        <div
          ref={drawerRef}
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="القائمة الرئيسية"
          style={{
            position: "fixed",
            top: 0,
            bottom: 0,
            // bottom: "calc(58px + env(safe-area-inset-bottom, 0px))",
            [isRtl ? "right" : "left"]: 0,
            width: "min(300px, 82vw)",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            background: "var(--color-bg-card)",
            borderStyle: "solid",
            borderWidth: 0,
            [isRtl ? "borderLeftWidth" : "borderRightWidth"]: "1px",
            borderColor: "var(--color-border)",
            overflowY: "auto",
            transform: drawerOpen
              ? "translateX(0)"
              : `translateX(${isRtl ? "100%" : "-100%"})`,
            transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: drawerOpen ? "0 0 60px rgba(0,0,0,0.35)" : "none",
          }}
        >
          {/* Drawer header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isRtl ? "flex-start" : "flex-end",
              padding: "1.1rem 1.25rem",
              borderBottom: "1px solid var(--color-border)",
              height: "64px",
              boxSizing: "border-box",
            }}
          >
            {/* <span
              style={{
                fontFamily: "var(--font-display, sans-serif)",
                fontWeight: 700,
                fontSize: "1rem",
                background:
                  "linear-gradient(135deg, var(--color-brand-500), var(--color-teal-400))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {language === "ar" ? "أساطير خضراء" : "Asateer Green"}
            </span> */}
            <button
              type="button"
              onClick={closeDrawer}
              className="icon-btn"
              style={{
                ...iconBtn,
                margin: 0,
                padding: "0.55rem",
                position: "absolute",
                top: "12px",
                [isRtl ? "left" : "right"]: "12px",
              }}
              aria-label={t("common.close")}
            >
              <CloseIcon />
            </button>
          </div>

          {/* Nav links */}
          <nav
            aria-label="Mobile navigation"
            style={{ flex: 1, paddingBlock: "0.5rem" }}
          >
            <ul
              role="list"
              style={{ listStyle: "none", margin: 0, padding: 0 }}
            >
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    end={item.href === ROUTES.HOME}
                    onClick={closeDrawer}
                    className="drawer-link"
                    style={({ isActive }) => ({
                      display: "block",
                      paddingInline: "1.25rem",
                      paddingBlock: "0.85rem",
                      fontSize: "0.925rem",
                      fontWeight: isActive ? 600 : 400,
                      textDecoration: "none",
                      color: isActive
                        ? "var(--color-brand-500)"
                        : "var(--color-text-secondary)",
                      background: isActive
                        ? "color-mix(in srgb, var(--color-brand-500) 8%, transparent)"
                        : "transparent",
                      borderInlineStart: `3px solid ${isActive ? "var(--color-brand-500)" : "transparent"}`,
                      transition: "all 0.18s",
                    })}
                  >
                    {t(item.labelKey)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Drawer footer */}
          <div
            style={{
              padding: "1.1rem 1.25rem",
              paddingBottom: "calc(65px + env(safe-area-inset-bottom, 0px))",
              borderTop: "1px solid var(--color-border)",
              display: "flex",
              flexDirection: "column",
              gap: "0.625rem",
            }}
          >
            <Link
              to={ROUTES.QUOTE_REQUEST}
              onClick={closeDrawer}
              style={{
                display: "block",
                textAlign: "center",
                padding: "0.7rem",
                borderRadius: "var(--radius-md, 8px)",
                background: "var(--color-brand-500)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.85rem",
                textDecoration: "none",
              }}
            >
              {t("nav.quoteRequest")}
            </Link>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[
                {
                  id: "theme",
                  label: isDark ? t("theme.light") : t("theme.dark"),
                  icon: isDark ? <SunIcon /> : <MoonIcon />,
                  fn: toggleTheme,
                },
                {
                  id: "lang",
                  label: language === "ar" ? "English" : "العربية",
                  icon: <GlobeIcon />,
                  fn: toggleLanguage,
                },
              ].map(({ label, icon, fn }) => (
                <button
                  key={label}
                  type="button"
                  onClick={fn}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px",
                    padding: "0.55rem",
                    borderRadius: "var(--radius-sm, 6px)",
                    background: "var(--color-bg-secondary)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-secondary)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {/* الـ span دي هي اللي هتاخد تأثير الدوران للأيقونة فقط */}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {icon}
                  </span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom tab bar (mobile only) — أيقونة فوق واسمها تحت، زي LinkedIn ── */}
      {isMobile && (
        <nav
          aria-label="القائمة السفلية"
          style={{
            position: "fixed",
            bottom: 0,
            insetInline: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "stretch",
            background: "var(--color-bg-card)",
            borderTop: "1px solid var(--color-border)",
            boxShadow: "0 -4px 20px -8px rgba(0,0,0,0.12)",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === ROUTES.HOME
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href);
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === ROUTES.HOME}
                className="bottom-tab-link"
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "3px",
                  padding: "6px 2px 8px",
                  textDecoration: "none",
                  color: isActive
                    ? "var(--color-brand-500)"
                    : "var(--color-text-secondary)",
                  transition: "color 0.18s",
                }}
              >
                {getBottomTabIcon(item.href, isActive)}
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: isActive ? 600 : 500,
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {t(item.labelKey)}
                </span>
              </NavLink>
            );
          })}

          {/* More — بيفتح نفس الدرج (الثيم / اللغة / اطلب عرض سعر) */}
          <button
            ref={moreTabRef}
            type="button"
            onClick={() => setDrawerOpen((v) => !v)}
            aria-expanded={drawerOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={drawerOpen ? t("common.close") : "المزيد"}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              padding: "6px 2px 8px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: drawerOpen
                ? "var(--color-brand-500)"
                : "var(--color-text-secondary)",
              transition: "color 0.18s",
            }}
          >
            {drawerOpen ? <CloseIcon /> : <MoreTabIcon active={drawerOpen} />}
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: drawerOpen ? 600 : 500,
                lineHeight: 1,
              }}
            >
              {language === "ar" ? "المزيد" : "More"}
            </span>
          </button>
        </nav>
      )}

      {/* Spacer for fixed header */}
      <div style={{ height: "64px" }} aria-hidden="true" />
    </>
  );
}

export default Navbar;