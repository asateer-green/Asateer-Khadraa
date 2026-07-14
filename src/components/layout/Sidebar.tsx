// src/components/layout/Sidebar.tsx
import { useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLanguage } from "../../hooks/ui/useLanguage";
import { useAuthContext } from "../../app/providers/AuthProvider";
import { ROUTES } from "../../app/config/routes";
import Logo from "../../assets/logos/favicon.ico"

// ── Nav items config ───────────────────────────────────────────────────────
type NavItem = {
  key: string;
  path: string;
  icon: ReactNode;
  exact?: boolean;
};

const NAV_ITEMS: ReadonlyArray<NavItem> = [
  {
    key:   "overview",
    path:  ROUTES.DASHBOARD,
    exact: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    key:  "services",
    path: ROUTES.DASHBOARD_SERVICES,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
  {
    key:  "signage",
    path: ROUTES.DASHBOARD_SIGNAGE,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    key:  "logos", 
    path: "/dashboard/logos/", // أو ROUTES.DASHBOARD_LOGOS إذا كانت معرّفة بالكامل هناك
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19H12V22Z" />
        <circle cx="7.5" cy="10.5" r="1.5" />
        <circle cx="11.5" cy="7.5" r="1.5" />
        <circle cx="16.5" cy="9.5" r="1.5" />
        <circle cx="15.5" cy="14.5" r="1.5" />
      </svg>
    ),
  },
  {
    key:  "portfolio",
    path: ROUTES.DASHBOARD_PORTFOLIO,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
  },
  {
    key:  "categories",
    path: ROUTES.DASHBOARD_CATEGORIES,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
  {
    key:  "quotes",
    path: ROUTES.DASHBOARD_QUOTES,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    key:  "settings",
    path: ROUTES.DASHBOARD_SETTINGS,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  },
];

// ── Sidebar ────────────────────────────────────────────────────────────────
export function Sidebar() {
  const { t, direction } = useLanguage();
  const { logout, user }  = useAuthContext();
  const navigate          = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const isRtl = direction === "rtl";

  return (
    <aside
      data-collapsed={collapsed}
      className={`${collapsed ? "w-16" : "w-60"} 
        relative flex flex-col h-screen shrink-0 overflow-hidden
        bg-(--card) border-e border-(--border)
        transition-[width] duration-300 ease-in-out
      `}
    >
      {/* ── Brand ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-(--border) shrink-0">
        {/* Logo mark */}
        <div className="shrink-0 w-8 h-8 rounded-lg bg-(--primary) flex items-center justify-center text-(--primary-foreground) font-bold text-sm select-none">
       <img
              src={Logo}
              alt="Logo"
              className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-105"
            />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-(--foreground) truncate leading-tight">
              أساطير خضراء
            </p>
            <p className="text-[11px] text-(--muted-foreground) truncate">
              {t("dashboard.title")}
            </p>
          </div>
        )}
      </div>

      {/* ── Nav ───────────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-0.5 px-2">
        {NAV_ITEMS.map(({ key, path, icon, exact }) => (
          <NavLink
            key={key}
            to={path}
            end={exact}
            title={collapsed ? t(`dashboard.${key}`) : undefined}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
              transition-colors duration-150 group relative
              ${isActive
                ? "bg-(--primary) text-(--primary-foreground) font-medium"
                : "text-(--muted-foreground) hover:bg-(--muted) hover:text-(--foreground)"
              }
            `}
          >
            <span className="shrink-0">{icon}</span>
            {!collapsed && (
              <span className="truncate">{t(`dashboard.${key}`)}</span>
            )}
            {/* Tooltip when collapsed */}
            {collapsed && (
              <span className={`
                absolute ${isRtl ? "inset-e-full me-2" : "inset-s-full ms-2"}
                px-2 py-1 rounded-md text-xs font-medium
                bg-(--foreground) text-(--background) whitespace-nowrap
                opacity-0 group-hover:opacity-100 pointer-events-none
                transition-opacity duration-150 z-50
              `}>
                {t(`dashboard.${key}`)}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer: user + collapse toggle ────────────────────────────── */}
      <div className="shrink-0 border-t border-(--border) p-2 space-y-1">
        {/* User row */}
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-(--muted)/50">
            <div className="w-7 h-7 rounded-full bg-(--primary)/20 flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="text-(--primary)">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <p className="text-xs text-(--muted-foreground) truncate flex-1 min-w-0">
              {user?.email ?? "admin"}
            </p>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          title={t("nav.logout")}
          type="button"
          className="
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
            text-(--muted-foreground) hover:bg-red-50 hover:text-red-600
            dark:hover:bg-red-950/30 dark:hover:text-red-400
            transition-colors duration-150
          "
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          {!collapsed && <span>{t("nav.logout")}</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(v => !v)}
          aria-label={collapsed ? "توسيع الشريط الجانبي" : "طي الشريط الجانبي"}
          type="button"
          className="
            w-full flex items-center justify-center py-2 rounded-xl text-sm
            text-(--muted-foreground) hover:bg-(--muted) hover:text-(--foreground)
            transition-colors duration-150
          "
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`transform transition-transform duration-300 ease ${isRtl
              ? collapsed ? "rotate-180" : "rotate-0"
              : collapsed ? "rotate-0" : "rotate-180"}`}
          >
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;