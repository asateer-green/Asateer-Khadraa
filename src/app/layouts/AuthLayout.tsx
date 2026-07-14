// src/app/layouts/AuthLayout.tsx
import { Suspense } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useLanguage } from "../../hooks/ui/useLanguage";
import { useTheme } from "../../hooks/ui/useTheme";
import { useAuthContext } from "../providers/AuthProvider";
import { ROUTES } from "../config/routes";

// ── Auth Layout ────────────────────────────────────────────────────────────
export function AuthLayout() {
  const { direction, language } = useLanguage();
  const { resolvedTheme } = useTheme() as { resolvedTheme?: string };
  // useAuthContext may return undefined/void in some typings environments,
  // so safely read its values with optional chaining and defaults.
  const _auth = useAuthContext() as
    | { isAuthenticated?: boolean; isLoading?: boolean }
    | undefined;
  const isAuthenticated = _auth?.isAuthenticated ?? false;
  const isLoading = _auth?.isLoading ?? false;

  // If already authenticated, redirect to dashboard
  if (!isLoading && isAuthenticated) {
    // ROUTES may not include DASHBOARD in some builds; safely resolve with a cast
    const redirectTo = (ROUTES as Record<string, string>)['DASHBOARD'] ?? ROUTES.HOME;
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div
      data-layout="auth"
      data-dir={direction}
      data-lang={language}
      data-theme={resolvedTheme}
      className="min-h-screen flex items-center justify-center layout-ready bg-(--color-bg-primary) text-(--color-text-primary)"
    >
      {/* Decorative brand background */}
      <div
        className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_srgb,var(--color-brand-500)_12%25,transparent),transparent_70%)]"
        aria-hidden="true"
      />

      {/* Auth card wrapper */}
      <div className="relative w-full max-w-md px-4">
        {/* Brand mark */}
        <div className="text-center mb-8">
          <span
            className="text-gradient-brand text-3xl font-bold block"
          >
            أساطير خضراء
          </span>
          <span className="text-sm mt-1 block text-(--color-text-muted)">
            Asateer Green
          </span>
        </div>

        <Suspense
          fallback={
            <div className="skeleton h-96 rounded-2xl" />
          }
        >
          <div className="page-enter">
            <Outlet />
          </div>
        </Suspense>
      </div>
    </div>
  );
}

export default AuthLayout;