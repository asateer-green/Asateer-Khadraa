// src/features/dashboard/quotes-manage/QuotesManager.tsx
import { useState } from "react";
import { Search } from "lucide-react";
import { useQuotes, useUpdateQuoteStatus } from "../../../hooks/api/useQuotes";
import { useLanguage } from "../../../hooks/ui/useLanguage";
import { Modal } from "../../../components/ui/Modal";
import { ListSkeleton } from "../../../components/ui/SafeImage";
import type { Quote, QuoteStatus } from "../../../types/api.types";

// ── Constants ──────────────────────────────────────────────────────────────
const STATUS_TABS: { key: QuoteStatus | "all"; ar: string; en: string }[] = [
  { key: "all", ar: "الكل", en: "All" },
  { key: "pending", ar: "معلقة", en: "Pending" },
  { key: "reviewed", ar: "مراجعة", en: "Reviewed" },
  { key: "accepted", ar: "مقبولة", en: "Accepted" },
  { key: "rejected", ar: "مرفوضة", en: "Rejected" },
];

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  reviewed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  accepted: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const STATUS_LABEL: Record<string, { ar: string; en: string }> = {
  pending: { ar: "معلق", en: "Pending" },
  reviewed: { ar: "مراجعة", en: "Reviewed" },
  accepted: { ar: "مقبول", en: "Accepted" },
  rejected: { ar: "مرفوض", en: "Rejected" },
};

const NEXT_STATUSES: { status: QuoteStatus; ar: string; en: string; color: string }[] = [
  { status: "reviewed", ar: "تعيين: مراجعة", en: "Mark: Reviewed", color: "bg-blue-500 hover:bg-blue-600" },
  { status: "accepted", ar: "تعيين: مقبول", en: "Mark: Accepted", color: "bg-green-600 hover:bg-green-700" },
  { status: "rejected", ar: "تعيين: مرفوض", en: "Mark: Rejected", color: "bg-red-500 hover:bg-red-600" },
];

// ── Quote detail modal ─────────────────────────────────────────────────────
function QuoteModal({
  quote,
  language,
  onClose,
  onUpdateStatus,
  isUpdating,
}: {
  quote: Quote;
  language: string;
  onClose: () => void;
  onUpdateStatus: (status: QuoteStatus) => void;
  isUpdating: boolean;
}) {
  const ar = language === "ar";

  const fields = [
    { label: ar ? "الاسم" : "Name", value: quote.name },
    { label: ar ? "البريد" : "Email", value: quote.email },
    { label: ar ? "الهاتف" : "Phone", value: quote.phone || "—" },
    { label: ar ? "الخدمة" : "Service", value: quote.service_type },
    { label: ar ? "الميزانية" : "Budget", value: quote.budget || "—" },
    { label: ar ? "الموعد" : "Deadline", value: quote.deadline || "—" },
    {
      label: ar ? "التاريخ" : "Date",
      value: new Date(quote.created_at).toLocaleDateString(ar ? "ar-SA" : "en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  ];

  const availableActions = NEXT_STATUSES.filter(s => s.status !== quote.status);

  return (
    <Modal
      title={ar ? "تفاصيل الطلب" : "Quote Details"}
      closeLabel={ar ? "إغلاق" : "Close"}
      onClose={onClose}
      footer={
        <div className="flex flex-wrap gap-2 w-full">
          {availableActions.map(s => (
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
      }
    >
      <div className="p-6 space-y-3">
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${STATUS_STYLE[quote.status]}`}>
          {STATUS_LABEL[quote.status][language as "ar" | "en"]}
        </span>

        {fields.map(f => (
          <div key={f.label} className="flex gap-3">
            <span className="text-sm text-(--muted-foreground) w-24 shrink-0">{f.label}</span>
            <span className="text-sm text-(--foreground) font-medium break-all">{f.value}</span>
          </div>
        ))}

        <div className="flex flex-col gap-1.5 pt-1">
          <span className="text-sm text-(--muted-foreground)">{ar ? "الوصف" : "Description"}</span>
          <p className="text-sm text-(--foreground) bg-(--muted)/50 rounded-xl p-3 leading-relaxed">
            {quote.description}
          </p>
        </div>
      </div>
    </Modal>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
const QuotesManager = () => {
  const { language } = useLanguage();
  const ar = language === "ar";

  const { data: quotes = [], isLoading, isError } = useQuotes();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateQuoteStatus();

  const [activeTab, setActiveTab] = useState<QuoteStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const filtered = quotes.filter(q => {
    const matchTab = activeTab === "all" || q.status === activeTab;
    const term = search.trim().toLowerCase();
    const matchSearch = !term || [q.name, q.email, q.service_type].some(v => v.toLowerCase().includes(term));
    return matchTab && matchSearch;
  });

  const handleUpdateStatus = (status: QuoteStatus) => {
    if (!selectedQuote) return;
    updateStatus({ id: selectedQuote.id, status }, { onSuccess: () => setSelectedQuote(null) });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-(--foreground)">{ar ? "إدارة الطلبات" : "Quotes Manager"}</h1>
          <p className="text-sm text-(--muted-foreground) mt-0.5">
            {ar ? `${quotes.length} طلب إجمالاً` : `${quotes.length} total quotes`}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute inset-y-0 inset-s-3 my-auto text-(--muted-foreground)" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={ar ? "بحث بالاسم أو الإيميل أو الخدمة..." : "Search by name, email, service..."}
          className="w-full ps-9 pe-4 py-2.5 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
        />
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-(--muted)/50 rounded-xl w-full sm:w-fit">
        {STATUS_TABS.map(tab => {
          const count = tab.key === "all" ? quotes.length : quotes.filter(q => q.status === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                activeTab === tab.key ? "bg-(--card) text-(--foreground) shadow-sm" : "text-(--muted-foreground) hover:text-(--foreground)"
              }`}
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
          <ListSkeleton count={5} />
        ) : isError ? (
          <div className="p-12 text-center text-(--muted-foreground)">{ar ? "تعذّر تحميل الطلبات" : "Could not load quotes"}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-(--muted-foreground) text-sm">{ar ? "لا توجد طلبات مطابقة" : "No matching quotes"}</p>
          </div>
        ) : (
          <>
            {/* Mobile: stacked cards */}
            <div className="sm:hidden divide-y divide-(--border)">
              {filtered.map(q => (
                <button key={q.id} onClick={() => setSelectedQuote(q)} className="w-full text-start p-4 space-y-2 hover:bg-(--muted)/30 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-(--foreground) truncate">{q.name}</p>
                    <span className={`shrink-0 inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[q.status]}`}>
                      {STATUS_LABEL[q.status][language as "ar" | "en"]}
                    </span>
                  </div>
                  <p className="text-xs text-(--muted-foreground) truncate">{q.email}</p>
                  <div className="flex items-center justify-between text-xs text-(--muted-foreground)">
                    <span>{q.service_type}</span>
                    <span>{new Date(q.created_at).toLocaleDateString(ar ? "ar-SA" : "en-GB")}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Desktop / tablet: table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-(--border)">
                    {[ar ? "الاسم" : "Name", ar ? "الخدمة" : "Service", ar ? "الهاتف" : "Phone", ar ? "التاريخ" : "Date", ar ? "الحالة" : "Status", ar ? "إجراء" : "Action"].map(h => (
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
          </>
        )}
      </div>

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