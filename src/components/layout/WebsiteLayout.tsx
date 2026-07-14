
import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useLanguageContext } from "../../app/providers/LanguageProvider";
import { useThemeContext } from "../../app/providers/ThemeProvider";
import  Navbar  from "../../components/layout/Navbar";
import  Footer  from "../../components/layout/Footer";

// ── Page skeleton (shown while lazy chunk loads) ───────────────────────────
function PageSkeleton() {
  return (
    <div
      style={{ background: "var(--color-bg-primary)", minHeight: "60vh" }}
      aria-busy="true"
      aria-label="Loading…"
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem" }}>
        <div className="skeleton" style={{ height: "2rem", width: "33%", marginBottom: "1rem", borderRadius: "var(--radius-md)" }} />
        <div className="skeleton" style={{ height: "1rem", width: "60%", marginBottom: "0.75rem", borderRadius: "var(--radius-md)" }} />
        <div className="skeleton" style={{ height: "1rem", width: "45%", borderRadius: "var(--radius-md)" }} />
      </div>
    </div>
  );
}

// ── Layout ─────────────────────────────────────────────────────────────────
export function WebsiteLayout() {
  const { direction, language } = useLanguageContext();
  const { resolvedTheme } = useThemeContext();
  const location = useLocation();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div
      data-layout="website"
      data-dir={direction}
      data-lang={language}
      data-theme={resolvedTheme}
      className="layout-ready"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        background: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
      }}
    >
      {/* ── Navbar (fixed, 64px) ── */}
      <Navbar />

      {/* ── Main content ── */}
      <main
        id="main-content"
        role="main"
        style={{ flex: 1 }}
        // Skip-to-content target for keyboard users
        tabIndex={-1}
      >
        <Suspense fallback={<PageSkeleton />}>
          <div className="page-enter">
            <Outlet />
          </div>
        </Suspense>
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}

export default WebsiteLayout;