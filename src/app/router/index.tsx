// src/app/router/index.tsx
import { lazy } from "react";
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { ROUTES } from "../config/routes";

// ── Layouts ────────────────────────────────────────────────────────────────
import WebsiteLayout    from "../layouts/WebsiteLayout";
import DashboardLayout  from "../layouts/DashboardLayout";
import AuthLayout       from "../layouts/AuthLayout";
import { ServicesView } from "../views/services/ServicesView";
import { PortfolioView } from "../views/portfolio/PortfolioView";
import { ContactView }  from "../views/contact/ContactView";


// ── Website pages (lazy) ───────────────────────────────────────────────────
const Home      = lazy(() => import("../../features/website/home/HomeView"));
import QuoteForm from "../views/QuoteForm/QuoteForm";

// ── Dashboard pages (lazy) ────────────────────────────────────────────────
const DashboardHome = lazy(() => import("../../features/dashboard/overview/DashboardHome"));
const Login         = lazy(() => import("../../features/dashboard/auth/Login"));
const QuotesManager   = lazy(() => import("../../features/dashboard/quotes-manage/QuotesManager"));
const ServicesManager   = lazy(() => import("../../features/dashboard/services-manager/ServicesManager"));
const PortfolioManager    = lazy(() => import("../../features/dashboard/portfolio-manager/PortfolioManager"));
const LogosManager      = lazy(() => import("../../features/dashboard/logos-manager/LogosManager"));
const SignageManager      = lazy(() => import("../../features/dashboard/signage-manager/SignageManager"));
const CategoriesManager   = lazy(() => import("../../features/dashboard/categories-manager/CategoriesManager"));
const Settings            = lazy(() => import("../../features/dashboard/settings/Settings"));

// ── 404 ───────────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <span className="text-8xl font-bold" style={{ color: "var(--color-brand-500)" }}>404</span>
      <p style={{ color: "var(--color-text-secondary)" }}>الصفحة غير موجودة · Page not found</p>
      <a href={ROUTES.HOME} style={{ color: "var(--color-brand-500)" }}>العودة للرئيسية · Go Home</a>
    </div>
  );
}

// ── Base path من Vite تلقائياً ────────────────────────────────────────────
const basename = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

// ── Routes ────────────────────────────────────────────────────────────────
const routes: RouteObject[] = [
  // Website
  {
    element: <WebsiteLayout />,
    children: [
      { index: true,                element: <Home /> },
      { path: ROUTES.SERVICES,      element: <ServicesView /> },
      { path: ROUTES.PORTFOLIO,     element: <PortfolioView /> },
      { path: ROUTES.CONTACT,       element: <ContactView /> },
      { path: ROUTES.QUOTE_REQUEST, element: <QuoteForm /> },
    ],
  },

  // Auth
  {
    element: <AuthLayout />,
    children: [{ path: ROUTES.LOGIN, element: <Login /> }],
  },

  // Dashboard
  {
    path: ROUTES.DASHBOARD,
    element: <DashboardLayout />,
    children: [
      { index: true,                        element: <DashboardHome /> },
      { path: "services",                   element: <ServicesManager /> },
      { path: "signage",                    element: <SignageManager /> },
      { path: "portfolio",                  element: <PortfolioManager /> },
      { path: "categories",                 element: <CategoriesManager /> },
      { path: "quotes",                     element: <QuotesManager /> },
      { path: "settings",                   element: <Settings /> },
      { path: "logos",                      element: <LogosManager /> },
    ],
  },

  { path: "*", element: <NotFound /> },
];

export const router = createBrowserRouter(routes, { basename });
export default router;