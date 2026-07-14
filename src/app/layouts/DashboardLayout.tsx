// src/app/layouts/DashboardLayout.tsx
import { Suspense, useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useLanguage } from "../../hooks/ui/useLanguage";
import { useTheme } from "../../hooks/ui/useTheme";
import { useAuthContext } from "../providers/AuthProvider";
import { ROUTES } from "../config/routes";
import { Sidebar } from "../../components/layout/Sidebar";
import { Topbar }  from "../../components/layout/Topbar";

// ── Skeleton ───────────────────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="flex h-screen bg-(--background)" aria-busy="true">
      <div className="w-60 h-full bg-(--card) border-e border-(--border) shrink-0 animate-pulse" />
      <div className="flex-1 p-8 space-y-6">
        <div className="h-8 w-1/4 rounded-lg bg-(--muted) animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-(--muted) animate-pulse" />
          ))}
        </div>
        <div className="h-64 rounded-xl bg-(--muted) animate-pulse" />
      </div>
    </div>
  );
}

// ── Layout ─────────────────────────────────────────────────────────────────
export function DashboardLayout() {
  const { direction, language } = useLanguage();
  const { resolvedTheme }       = useTheme();
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  if (isLoading)        return <DashboardSkeleton />;
  if (!isAuthenticated) return (
    <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />
  );

  return (
    <div
      data-layout="dashboard"
      data-dir={direction}
      data-lang={language}
      data-theme={resolvedTheme}
      className="flex h-screen overflow-hidden bg-(--background) text-(--foreground)"
    >
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Topbar />

        <main
          id="dashboard-main"
          role="main"
          className="flex-1 overflow-y-auto p-6 bg-(--surface)"
        >
          <Suspense fallback={<DashboardSkeleton />}>
            <div className="page-enter">
              <Outlet />
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;