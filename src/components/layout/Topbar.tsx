// src/components/layout/Topbar.tsx
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../hooks/ui/useLanguage";
import { useTheme } from "../../hooks/ui/useTheme";
import { ROUTES } from "../../app/config/routes";

// ── Page title map ─────────────────────────────────────────────────────────
const PAGE_TITLE_KEY: Record<string, string> = {
  [ROUTES.DASHBOARD]:            "dashboard.overview",
  [ROUTES.DASHBOARD_SERVICES]:   "dashboard.services",
  [ROUTES.DASHBOARD_SIGNAGE]:    "dashboard.signage",
  [ROUTES.DASHBOARD_PORTFOLIO]:  "dashboard.portfolio",
  [ROUTES.DASHBOARD_CATEGORIES]: "dashboard.categories",
  [ROUTES.DASHBOARD_QUOTES]:     "dashboard.quotes",
  [ROUTES.DASHBOARD_SETTINGS]:   "dashboard.settings",
};

// ── Icons ──────────────────────────────────────────────────────────────────
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  );
}

// ── Topbar ─────────────────────────────────────────────────────────────────
export function Topbar() {
  const { t, language, toggleLanguage } = useLanguage();
  const { resolvedTheme, toggleTheme }  = useTheme();
  const location = useLocation();

  const titleKey = PAGE_TITLE_KEY[location.pathname] ?? "dashboard.overview";
  const pageTitle = t(titleKey);

  return (
    <header className="
      flex items-center justify-between
      h-14 px-5 shrink-0
      bg-(--card) border-b border-(--border)
    ">
      {/* ── Page title (breadcrumb style) ────────────────────────────── */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-(--muted-foreground)">{t("dashboard.title")}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          className="text-(--muted-foreground) shrink-0">
          <g transform={language === "ar" ? "rotate(180 12 12)" : undefined}>
            <polyline points="9 18 15 12 9 6"/>
          </g>
        </svg>
        <h1 className="text-sm font-semibold text-(--foreground)">{pageTitle}</h1>
      </div>

      {/* ── Actions ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={t("theme.toggle")}
          title={t("theme.toggle")}
          type="button"
          className="
            w-9 h-9 rounded-xl flex items-center justify-center
            text-(--muted-foreground) hover:text-(--foreground)
            hover:bg-(--muted) transition-colors duration-150
          "
        >
          {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Language toggle */}
        <button
          onClick={toggleLanguage}
          aria-label={t("language.switch")}
          title={t("language.switch")}
          type="button"
          className="
            h-9 px-3 rounded-xl flex items-center gap-1.5 text-xs font-medium
            text-(--muted-foreground) hover:text-(--foreground)
            hover:bg-(--muted) transition-colors duration-150
          "
        >
          <GlobeIcon />
          <span>{language === "ar" ? "EN" : "عربي"}</span>
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-(--border) mx-1" />

        {/* Website link */}
        <a
          href={ROUTES.HOME}
          target="_blank"
          rel="noopener noreferrer"
          title={language === "ar" ? "زيارة الموقع" : "Visit website"}
          className="
            w-9 h-9 rounded-xl flex items-center justify-center
            text-(--muted-foreground) hover:text-(--foreground)
            hover:bg-(--muted) transition-colors duration-150
          "
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
      </div>
    </header>
  );
}

export default Topbar;