// src/app/config/routes.tsx
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ABOUT: "/about",
  SERVICES: "/services",
  PORTFOLIO: "/portfolio",
  CONTACT: "/contact",
  QUOTE_REQUEST: "/quote-request",
  QUOTA_REQUEST: "/quota-request",

  // Dashboard
  DASHBOARD: "/dashboard",
  DASHBOARD_SERVICES: "/dashboard/services",
  DASHBOARD_SIGNAGE: "/dashboard/signage",
  DASHBOARD_PORTFOLIO: "/dashboard/portfolio",
  DASHBOARD_CATEGORIES: "/dashboard/categories",
  DASHBOARD_QUOTES: "/dashboard/quotes",
  DASHBOARD_SETTINGS: "/dashboard/settings",
} as const;
