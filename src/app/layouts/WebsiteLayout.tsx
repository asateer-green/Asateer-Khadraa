// src/app/layouts/WebsiteLayout.tsx
import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useLanguage } from "../../hooks/ui/useLanguage";
import { useTheme } from "../../hooks/ui/useTheme";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

// ── Skeleton loader while page chunks load ─────────────────────────────────
function PageSkeleton() {
  return (
    <div
      className="min-h-screen bg-(--color-background)"
      aria-busy="true"
      aria-label="Loading page…"
    >
      <div className="h-16 w-full bg-(--color-surface) animate-pulse rounded-none" />
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <div className="h-8 w-1/3 bg-(--color-surface) animate-pulse rounded-lg" />
        <div className="h-4 w-2/3 bg-(--color-surface) animate-pulse rounded-lg" />
        <div className="h-4 w-1/2 bg-(--color-surface) animate-pulse rounded-lg" />
      </div>
    </div>
  );
}

// ── Layout ─────────────────────────────────────────────────────────────────
export function WebsiteLayout() {
  const { direction, language } = useLanguage();
  const { resolvedTheme } = useTheme();
  const location = useLocation();

  // Scroll to top on route change only when there's no hash target
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location.pathname, location.hash]);

  return (
    <div
      data-layout="website"
      data-dir={direction}
      data-lang={language}
      data-theme={resolvedTheme}
      className="flex flex-col min-h-screen layout-ready bg-(--color-background) text-(--color-foreground)"
    >
      <Navbar />

      <main className="flex-1" id="main-content" role="main">
        <Suspense fallback={<PageSkeleton />}>
          <div className="page-enter">
            <Outlet />
          </div>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default WebsiteLayout;