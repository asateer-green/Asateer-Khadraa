// src/app/router/index.tsx
import { lazy } from "react";
import { createBrowserRouter, type RouteObject } from "react-router-dom";
import { ROUTES } from "../config/routes";

// ── Layouts ────────────────────────────────────────────────────────────────
import WebsiteLayout from "../layouts/WebsiteLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import PrintingServicePage from "../views/services/PrintingServicePage";
import SignageServicePage from "../views/services/SignageServicePage";
import { MediaServicePage } from "../views/services/MediaServicePage";
import { GiftsServicePage } from "../views/services/GiftsServicePage";
import PackagingServicePage from "../views/services/PackagingServicePage";

// ── Website pages (lazy) ───────────────────────────────────────────────────
const Home = lazy(() => import("../../features/website/home/HomeView"));
const ServicesView = lazy(() => import("../views/services/ServicesView"));
const PortfolioView = lazy(() =>
  import("../views/portfolio/PortfolioView").then((m) => ({
    default: m.PortfolioView,
  })),
);
const ContactView = lazy(() =>
  import("../views/contact/ContactView").then((m) => ({
    default: m.ContactView,
  })),
);
const About = lazy(
  () => import("../../features/website/home/components/About"),
);
const QuoteForm = lazy(() => import("../views/QuoteForm/QuoteForm"));
// import AboutSection from "../../features/website/home/components/About";

// ── Dashboard pages (lazy) ────────────────────────────────────────────────
const DashboardHome = lazy(
  () => import("../../features/dashboard/overview/DashboardHome"),
);
const Login = lazy(() => import("../../features/dashboard/auth/Login"));
const QuotesManager = lazy(
  () => import("../../features/dashboard/quotes-manage/QuotesManager"),
);
const ServicesManager = lazy(
  () => import("../../features/dashboard/services-manager/ServicesManager"),
);
const PortfolioManager = lazy(
  () => import("../../features/dashboard/portfolio-manager/PortfolioManager"),
);
const LogosManager = lazy(
  () => import("../../features/dashboard/logos-manager/LogosManager"),
);
const SignageManager = lazy(
  () => import("../../features/dashboard/signage-manager/SignageManager"),
);
const CategoriesManager = lazy(
  () => import("../../features/dashboard/categories-manager/CategoriesManager"),
);
const Settings = lazy(
  () => import("../../features/dashboard/settings/Settings"),
);

// ── 404 ───────────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <span
        className="text-8xl font-bold"
        style={{ color: "var(--color-brand-500)" }}
      >
        404
      </span>
      <p style={{ color: "var(--color-text-secondary)" }}>
        الصفحة غير موجودة · Page not found
      </p>
      <a href={ROUTES.HOME} style={{ color: "var(--color-brand-500)" }}>
        العودة للرئيسية · Go Home
      </a>
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
      { index: true, element: <Home /> },
      { path: ROUTES.SERVICES, element: <ServicesView /> },
      { path: ROUTES.PRINTING_SERVICE, element: <PrintingServicePage /> }, 
      { path: ROUTES.SIGNAGE_SERVICE, element: <SignageServicePage /> },
      { path: ROUTES.MEDIA_SERVICE, element: <MediaServicePage /> }, 
      { path: ROUTES.GIFTS_SERVICE, element: <GiftsServicePage /> }, 
      { path: ROUTES.PACKAGING_SERVICE, element: <PackagingServicePage /> }, 
      { path: ROUTES.PORTFOLIO, element: <PortfolioView /> },
      { path: ROUTES.ABOUT, element: <About /> },
      { path: ROUTES.CONTACT, element: <ContactView /> },
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
      { index: true, element: <DashboardHome /> },
      { path: "services", element: <ServicesManager /> },
      { path: "signage", element: <SignageManager /> },
      { path: "portfolio", element: <PortfolioManager /> },
      { path: "categories", element: <CategoriesManager /> },
      { path: "quotes", element: <QuotesManager /> },
      { path: "settings", element: <Settings /> },
      { path: "logos", element: <LogosManager /> },
    ],
  },

  { path: "*", element: <NotFound /> },
];

export const router = createBrowserRouter(routes, { basename });
export default router;
