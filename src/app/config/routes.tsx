// src/app/config/routes.tsx
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ABOUT: "/about",
  SERVICES: "/services",
  PRINTING_SERVICE: "/services/printing",
  ADVERTISING_SERVICE: "/services/advertising",
  BRANDING_SERVICE: "/services/branding",
  PACKAGING_SERVICE: "/services/packaging",
  SIGNAGE_SERVICE: "/services/signage",
  MEDIA_SERVICE: "/services/media",
  GIFTS_SERVICE: "/services/gifts",
  PORTFOLIO: "/portfolio",
  CONTACT: "/contact",
  QUOTE_REQUEST: "/quote-request",

  // Dashboard
  DASHBOARD: "/dashboard",
  DASHBOARD_SERVICES: "/dashboard/services",
  DASHBOARD_SIGNAGE: "/dashboard/signage",
  DASHBOARD_PORTFOLIO: "/dashboard/portfolio",
  DASHBOARD_CATEGORIES: "/dashboard/categories",
  DASHBOARD_QUOTES: "/dashboard/quotes",
  DASHBOARD_SETTINGS: "/dashboard/settings",
} as const;
