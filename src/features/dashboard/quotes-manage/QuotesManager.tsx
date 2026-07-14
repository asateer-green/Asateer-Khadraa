// src/features/dashboard/quotes-manage/QuotesManager.tsx
import { useState } from "react";
import { useQuotes, useUpdateQuoteStatus } from "../../../hooks/api/useQuotes";
import { useLanguage } from "../../../hooks/ui/useLanguage";
import type { Quote, QuoteStatus } from "../../../types/api.types";

// ── Constants ──────────────────────────────────────────────────────────────
const STATUS_TABS: { key: QuoteStatus | "all"; ar: string; en: string }[] = [
  { key: "all",      ar: "الكل",    en: "All"      },
  { key: "pending",  ar: "معلقة",   en: "Pending"  },
  { key: "reviewed", ar: "مراجعة",  en: "Reviewed" },
  { key: "accepted", ar: "مقبولة",  en: "Accepted" },
  { key: "rejected", ar: "مرفوضة", en: "Rejected" },
];

const STATUS_STYLE: Record<string, string> = {
  pending:  "bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-400",
  reviewed: "bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400",
  accepted: "bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400",
  rejected: "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400",
};

const STATUS_LABEL: Record<string, { ar: string; en: string }> = {
  pending:  { ar: "معلق",   en: "Pending"  },
  reviewed: { ar: "مراجعة", en: "Reviewed" },
  accepted: { ar: "مقبول",  en: "Accepted" },
  rejected: { ar: "مرفوض", en: "Rejected"  },
};

// ── Quote detail modal ─────────────────────────────────────────────────────
function QuoteModal({
  quote, language, onClose, onUpdateStatus, isUpdating,
}: {
  quote: Quote;
  language: string;
  onClose: () => void;
  onUpdateStatus: (status: QuoteStatus) => void;
  isUpdating: boolean;
}) {
  const ar = language === "ar";

  const fields = [
    { label: ar ? "الاسم"       : "Name",         value: quote.name         },
    { label: ar ? "البريد"      : "Email",        value: quote.email        },
    { label: ar ? "الهاتف"      : "Phone",        value: quote.phone || "—" },
    { label: ar ? "الخدمة"      : "Service",      value: quote.service_type },
    { label: ar ? "الميزانية"   : "Budget",       value: quote.budget || "—" },
    { label: ar ? "الموعد"      : "Deadline",     value: quote.deadline || "—" },
    { label: ar ? "التاريخ"     : "Date",
      value: new Date(quote.created_at).toLocaleDateString(ar ? "ar-SA" : "en-GB", {
        year: "numeric", month: "long", day: "numeric",
      })
    },
  ];

  const nextStatuses = [
    { status: "reviewed" as QuoteStatus, ar: "تعيين: مراجعة", en: "Mark: Reviewed", color: "bg-blue-500 hover:bg-blue-600" },
    { status: "accepted" as QuoteStatus, ar: "تعيين: مقبول",  en: "Mark: Accepted", color: "bg-green-600 hover:bg-green-700" },
    { status: "rejected" as QuoteStatus, ar: "تعيين: مرفوض",  en: "Mark: Rejected", color: "bg-red-500 hover:bg-red-600"   },
  ].filter(s => s.status !== (quote.status as QuoteStatus));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-2xl bg-(--card) border border-(--border) shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--border)">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-(--foreground)">
              {ar ? "تفاصيل الطلب" : "Quote Details"}
            </h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[quote.status]}`}>
              {STATUS_LABEL[quote.status][language as "ar" | "en"]}
            </span>
          </div>
          <button onClick={onClose} aria-label="إغلاق" className="w-8 h-8 rounded-lg flex items-center justify-center text-(--muted-foreground) hover:bg-(--muted) hover:text-(--foreground) transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Fields */}
        <div className="p-6 space-y-3">
          {fields.map(f => (
            <div key={f.label} className="flex gap-3">
              <span className="text-sm text-(--muted-foreground) w-24 shrink-0">{f.label}</span>
              <span className="text-sm text-(--foreground) font-medium break-all">{f.value}</span>
            </div>
          ))}

          {/* Description */}
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-sm text-(--muted-foreground)">{ar ? "الوصف" : "Description"}</span>
            <p className="text-sm text-(--foreground) bg-(--muted)/50 rounded-xl p-3 leading-relaxed">
              {quote.description}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex flex-wrap gap-2">
          {nextStatuses.map(s => (
            <button
              key={s.status}
              onClick={() => onUpdateStatus(s.status)}
              disabled={isUpdating}
              className={`px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50 ${s.color}`}
            >
              {isUpdating ? "..." : s[language as "ar" | "en"]}
            </button>
          ))}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-(--muted-foreground) hover:bg-(--muted) transition-colors ms-auto"
          >
            {ar ? "إغلاق" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
const QuotesManager = () => {
  const { language } = useLanguage();
  const ar = language === "ar";

  const { data: quotes = [], isLoading, isError } = useQuotes();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateQuoteStatus();

  const [activeTab,    setActiveTab]    = useState<QuoteStatus | "all">("all");
  const [search,       setSearch]       = useState("");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // Filter
  const filtered = quotes.filter(q => {
    const matchTab    = activeTab === "all" || q.status === activeTab;
    const matchSearch = !search || [q.name, q.email, q.service_type]
      .some(v => v.toLowerCase().includes(search.toLowerCase()));
    return matchTab && matchSearch;
  });

  const handleUpdateStatus = (status: QuoteStatus) => {
    if (!selectedQuote) return;
    updateStatus(
      { id: selectedQuote.id, status },
      { onSuccess: () => setSelectedQuote(null) }
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-(--foreground)">
            {ar ? "إدارة الطلبات" : "Quotes Manager"}
          </h1>
          <p className="text-sm text-(--muted-foreground) mt-0.5">
            {ar ? `${quotes.length} طلب إجمالاً` : `${quotes.length} total quotes`}
          </p>
        </div>
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="absolute inset-y-0 start-3 my-auto text-(--muted-foreground)">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={ar ? "بحث بالاسم أو الإيميل أو الخدمة..." : "Search by name, email, service..."}
            className="w-full ps-9 pe-4 py-2.5 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
          />
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 p-1 bg-(--muted)/50 rounded-xl w-fit">
        {STATUS_TABS.map(tab => {
          const count = tab.key === "all"
            ? quotes.length
            : quotes.filter(q => q.status === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5
                ${activeTab === tab.key
                  ? "bg-(--card) text-(--foreground) shadow-sm"
                  : "text-(--muted-foreground) hover:text-(--foreground)"
                }
              `}
            >
              {tab[language as "ar" | "en"]}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? "bg-(--muted)" : "bg-(--muted)/50"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-(--card) border border-(--border) overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-(--muted) animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-(--muted-foreground)">
            {ar ? "تعذّر تحميل الطلبات" : "Could not load quotes"}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-(--muted-foreground) text-sm">
              {ar ? "لا توجد طلبات مطابقة" : "No matching quotes"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-(--border)">
                  {[
                    ar ? "الاسم"    : "Name",
                    ar ? "الخدمة"   : "Service",
                    ar ? "الهاتف"   : "Phone",
                    ar ? "التاريخ"  : "Date",
                    ar ? "الحالة"   : "Status",
                    ar ? "إجراء"    : "Action",
                  ].map(h => (
                    <th key={h} className="text-start px-5 py-3 text-xs font-medium text-(--muted-foreground) whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-(--border)">
                {filtered.map(q => (
                  <tr key={q.id} className="hover:bg-(--muted)/40 transition-colors group">
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="font-medium text-(--foreground)">{q.name}</p>
                        <p className="text-xs text-(--muted-foreground)">{q.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-(--muted-foreground) whitespace-nowrap">{q.service_type}</td>
                    <td className="px-5 py-3.5 text-(--muted-foreground)">{q.phone || "—"}</td>
                    <td className="px-5 py-3.5 text-(--muted-foreground) whitespace-nowrap">
                      {new Date(q.created_at).toLocaleDateString(ar ? "ar-SA" : "en-GB")}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[q.status]}`}>
                        {STATUS_LABEL[q.status][language as "ar" | "en"]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setSelectedQuote(q)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-(--muted) hover:bg-(--primary) hover:text-(--primary-foreground) text-(--muted-foreground) transition-colors font-medium"
                      >
                        {ar ? "عرض" : "View"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedQuote && (
        <QuoteModal
          quote={selectedQuote}
          language={language}
          onClose={() => setSelectedQuote(null)}
          onUpdateStatus={handleUpdateStatus}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
};

export default QuotesManager;