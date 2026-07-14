// src/features/dashboard/overview/DashboardHome.tsx
import { useQuoteStats, useQuotes } from "../../../hooks/api/useQuotes";
import { useServiceStats } from "../../../hooks/api/useServices";
import { usePortfolioStats } from "../../../hooks/api/usePortfolio";
import { useSignageStats } from "../../../hooks/api/useSignage";
import { useAuthContext } from "../../../app/providers/AuthProvider";
import { useLanguage } from "../../../hooks/ui/useLanguage";
import { ROUTES } from "../../../app/config/routes";
import { Link } from "react-router-dom";

// ── Stat card ──────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number | undefined;
  sub?: string;
  subValue?: number | undefined;
  isLoading: boolean;
  isError: boolean;
  to: string;
  color: "brand" | "amber" | "blue" | "violet";
  icon: React.ReactNode;
}

const COLOR_MAP = {
  brand: {
    bg: "bg-(--primary)/10",
    text: "text-(--primary)",
    border: "border-(--primary)/20",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/20",
  },
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/20",
  },
  violet: {
    bg: "bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-500/20",
  },
};

function StatCard({
  label,
  value,
  sub,
  subValue,
  isLoading,
  isError,
  to,
  color,
  icon,
}: StatCardProps) {
  const c = COLOR_MAP[color];
  return (
    <Link
      to={to}
      className="
        group flex flex-col gap-4 p-5 rounded-2xl
        bg-(--card) border border-(--border)
        hover:border-(--primary)/40 hover:shadow-md
        transition-all duration-200
      "
    >
      {/* Icon + label */}
      <div className="flex items-center justify-between">
        <span
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg} ${c.text} border ${c.border}`}
        >
          {icon}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-(--muted-foreground) group-hover:text-(--primary) transition-colors"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>

      {/* Value */}
      <div>
        {isLoading ? (
          <div className="h-8 w-16 rounded-lg bg-(--muted) animate-pulse mb-1" />
        ) : isError ? (
          <span className="text-2xl font-bold text-(--muted-foreground)">
            —
          </span>
        ) : (
          <span className="text-3xl font-bold text-(--foreground)">
            {value ?? 0}
          </span>
        )}
        <p className="text-sm text-(--muted-foreground) mt-0.5">{label}</p>
      </div>

      {/* Sub-stat badge */}
      {sub && (
        <div
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${c.bg} ${c.text}`}
        >
          {isLoading ? (
            <span className="w-8 h-3 rounded bg-current opacity-30 animate-pulse" />
          ) : (
            <>
              <span className="font-bold">{subValue ?? 0}</span>
              <span>{sub}</span>
            </>
          )}
        </div>
      )}
    </Link>
  );
}

// ── Recent quotes table ────────────────────────────────────────────────────
import type { Quote } from "../../../types/api.types";

const STATUS_STYLE: Record<string, string> = {
  pending:
    "bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-400",
  reviewed:
    "bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400",
  accepted:
    "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400",
  rejected:
    "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400",
};

function RecentQuotes({ language }: { language: string }) {
  const { data: quotes, isLoading, isError } = useQuotes();
  const recent = (quotes ?? []).slice(0, 5);

  const statusLabel: Record<string, Record<string, string>> = {
    pending: { ar: "معلق", en: "Pending" },
    reviewed: { ar: "مراجعة", en: "Reviewed" },
    accepted: { ar: "مقبول", en: "Accepted" },
    rejected: { ar: "مرفوض", en: "Rejected" },
  };

  return (
    <div className="rounded-2xl bg-(--card) border border-(--border) overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-(--border)">
        <h2 className="text-sm font-semibold text-(--foreground)">
          {language === "ar" ? "أحدث الطلبات" : "Recent Quotes"}
        </h2>
        <Link
          to={ROUTES.DASHBOARD_QUOTES}
          className="text-xs text-(--primary) hover:underline font-medium"
        >
          {language === "ar" ? "عرض الكل" : "View all"}
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="p-5 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-10 rounded-lg bg-(--muted) animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <p className="p-5 text-sm text-(--muted-foreground) text-center">
          {language === "ar" ? "تعذّر تحميل الطلبات" : "Could not load quotes"}
        </p>
      ) : recent.length === 0 ? (
        <p className="p-8 text-sm text-(--muted-foreground) text-center">
          {language === "ar" ? "لا توجد طلبات بعد" : "No quotes yet"}
        </p>
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="sm:hidden divide-y divide-(--border)">
            {recent.map((q: Quote) => (
              <div key={q.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-(--foreground) truncate">
                    {q.name}
                  </span>
                  <span
                    className={`shrink-0 inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[q.status] ?? ""}`}
                  >
                    {statusLabel[q.status]?.[language] ?? q.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-(--muted-foreground)">
                  <span>{q.service_type}</span>
                  <span>
                    {new Date(q.created_at).toLocaleDateString(
                      language === "ar" ? "ar-SA" : "en-GB",
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop / tablet: table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-(--border)">
                  {[
                    language === "ar" ? "الاسم" : "Name",
                    language === "ar" ? "الخدمة" : "Service",
                    language === "ar" ? "التاريخ" : "Date",
                    language === "ar" ? "الحالة" : "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-start px-5 py-3 text-xs font-medium text-(--muted-foreground)"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-(--border)">
                {recent.map((q: Quote) => (
                  <tr
                    key={q.id}
                    className="hover:bg-(--muted)/40 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-(--foreground) whitespace-nowrap">
                      {q.name}
                    </td>
                    <td className="px-5 py-3 text-(--muted-foreground) whitespace-nowrap">
                      {q.service_type}
                    </td>
                    <td className="px-5 py-3 text-(--muted-foreground) whitespace-nowrap">
                      {new Date(q.created_at).toLocaleDateString(
                        language === "ar" ? "ar-SA" : "en-GB",
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[q.status] ?? ""}`}
                      >
                        {statusLabel[q.status]?.[language] ?? q.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ── Quick actions ──────────────────────────────────────────────────────────
function QuickActions({ language }: { language: string }) {
  const actions = [
    {
      label: language === "ar" ? "إضافة خدمة" : "Add Service",
      to: ROUTES.DASHBOARD_SERVICES,
      icon: "+",
    },
    {
      label: language === "ar" ? "رفع عمل جديد" : "Add Portfolio",
      to: ROUTES.DASHBOARD_PORTFOLIO,
      icon: "+",
    },
    {
      label: language === "ar" ? "إضافة لوحة" : "Add Signage",
      to: ROUTES.DASHBOARD_SIGNAGE,
      icon: "+",
    },
    {
      label: language === "ar" ? "إدارة معرض الشعارات" : "Manage Logos",
      to: "/dashboard/logos/",
      icon: "+",
    },
    {
      label: language === "ar" ? "الإعدادات" : "Settings",
      to: ROUTES.DASHBOARD_SETTINGS,
      icon: "⚙",
    },
  ];

  return (
    <div className="rounded-2xl bg-(--card) border border-(--border) overflow-hidden">
      <div className="px-5 py-4 border-b border-(--border)">
        <h2 className="text-sm font-semibold text-(--foreground)">
          {language === "ar" ? "إجراءات سريعة" : "Quick Actions"}
        </h2>
      </div>
      <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2">
        {actions.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="
              flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm
              text-(--muted-foreground) hover:text-(--foreground)
              hover:bg-(--muted) transition-colors duration-150
            "
          >
            <span className="w-6 h-6 rounded-md bg-(--primary)/10 text-(--primary) flex items-center justify-center text-base font-bold shrink-0">
              {a.icon}
            </span>
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────
const IconDoc = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const IconWrench = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
  </svg>
);
const IconImage = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const IconHome = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

// ── Main page ──────────────────────────────────────────────────────────────
const DashboardHome = () => {
  const { user } = useAuthContext();
  const { t, language } = useLanguage();

  const quoteStats = useQuoteStats();
  const serviceStats = useServiceStats();
  const portfolioStats = usePortfolioStats();
  const signageStats = useSignageStats();

  const greeting =
    language === "ar"
      ? `مرحباً ${user?.email?.split("@")[0] ?? ""} `
      : `Welcome back, ${user?.email?.split("@")[0] ?? ""} `;

  const now = new Date().toLocaleDateString(
    language === "ar" ? "ar-SA" : "en-GB",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-bold text-(--foreground)">{greeting}</h1>
        <p className="text-sm text-(--muted-foreground) mt-0.5">{now}</p>
      </div>

      {/* ── Stat cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={t("dashboard.totalQuotes")}
          value={quoteStats.data?.total}
          sub={language === "ar" ? "معلقة" : "pending"}
          subValue={quoteStats.data?.pending}
          isLoading={quoteStats.isLoading}
          isError={quoteStats.isError}
          to={ROUTES.DASHBOARD_QUOTES}
          color="brand"
          icon={<IconDoc />}
        />
        <StatCard
          label={t("dashboard.totalServices")}
          value={serviceStats.data?.total}
          sub={language === "ar" ? "نشطة" : "active"}
          subValue={serviceStats.data?.active}
          isLoading={serviceStats.isLoading}
          isError={serviceStats.isError}
          to={ROUTES.DASHBOARD_SERVICES}
          color="blue"
          icon={<IconWrench />}
        />
        <StatCard
          label={t("dashboard.totalPortfolio")}
          value={portfolioStats.data?.total}
          sub={language === "ar" ? "مميزة" : "featured"}
          subValue={portfolioStats.data?.featured}
          isLoading={portfolioStats.isLoading}
          isError={portfolioStats.isError}
          to={ROUTES.DASHBOARD_PORTFOLIO}
          color="amber"
          icon={<IconImage />}
        />
        <StatCard
          label={language === "ar" ? "اللوحات الإعلانية" : "Signage"}
          value={signageStats.data?.total}
          sub={language === "ar" ? "نشطة" : "active"}
          subValue={signageStats.data?.active}
          isLoading={signageStats.isLoading}
          isError={signageStats.isError}
          to={ROUTES.DASHBOARD_SIGNAGE}
          color="violet"
          icon={<IconHome />}
        />
      </div>

      {/* ── Bottom grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent quotes — takes 2 cols */}
        <div className="lg:col-span-2">
          <RecentQuotes language={language} />
        </div>
        {/* Quick actions — takes 1 col */}
        <QuickActions language={language} />
      </div>
    </div>
  );
};

export default DashboardHome;