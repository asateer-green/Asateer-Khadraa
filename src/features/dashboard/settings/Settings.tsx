// src/features/dashboard/settings/Settings.tsx
import { useState } from "react";
import { useLanguage } from "../../../hooks/ui/useLanguage";
import { useTheme } from "../../../hooks/ui/useTheme";
import { useAuthContext } from "../../../app/providers/AuthProvider";
import { supabase } from "../../../services/supabase/client";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../app/config/routes";

// ── Section wrapper ────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-(--card) border border-(--border) overflow-hidden">
      <div className="px-5 py-4 border-b border-(--border)">
        <h2 className="text-sm font-semibold text-(--foreground)">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

// ── Row ────────────────────────────────────────────────────────────────────
function Row({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-(--foreground)">{label}</p>
        {sub && <p className="text-xs text-(--muted-foreground) mt-0.5">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

// ── Toggle ─────────────────────────────────────────────────────────────────
function Toggle({ value, onChange, label }: { value: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value ? "true" : "false"}
      aria-label={label}
      onClick={onChange}
      className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${value ? "bg-(--primary)" : "bg-(--muted)"}`}
    >
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${value ? "inset-s-5" : "inset-s-1"}`} />
    </button>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
const Settings = () => {
  const { language, toggleLanguage }    = useLanguage();
  const { resolvedTheme, toggleTheme }  = useTheme();
  const { user, logout }                = useAuthContext();
  const navigate                        = useNavigate();
  const ar = language === "ar";

  // ── Change password ────────────────────────────────────────────────────
  const [pwForm,    setPwForm]    = useState({ current: "", next: "", confirm: "" });
  const [pwStatus,  setPwStatus]  = useState<"idle" | "loading" | "success" | "error">("idle");
  const [pwError,   setPwError]   = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    if (pwForm.next.length < 6) {
      setPwError(ar ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError(ar ? "كلمتا المرور غير متطابقتين" : "Passwords do not match");
      return;
    }
    setPwStatus("loading");
    const { error } = await supabase.auth.updateUser({ password: pwForm.next });
    if (error) {
      setPwError(error.message);
      setPwStatus("error");
    } else {
      setPwStatus("success");
      setPwForm({ current: "", next: "", confirm: "" });
      setTimeout(() => setPwStatus("idle"), 3000);
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      <div>
        <h1 className="text-xl font-bold text-(--foreground)">{ar ? "الإعدادات" : "Settings"}</h1>
        <p className="text-sm text-(--muted-foreground) mt-0.5">
          {ar ? "إعدادات الحساب والمظهر" : "Account and appearance settings"}
        </p>
      </div>

      {/* ── Account ──────────────────────────────────────────────────── */}
      <Section title={ar ? "الحساب" : "Account"}>
        <Row
          label={ar ? "البريد الإلكتروني" : "Email"}
          sub={ar ? "لا يمكن تغييره" : "Cannot be changed"}
        >
          <span className="text-sm text-(--muted-foreground) bg-(--muted) px-3 py-1.5 rounded-lg max-w-full truncate">
            {user?.email ?? "—"}
          </span>
        </Row>
      </Section>

      {/* ── Change password ───────────────────────────────────────────── */}
      <Section title={ar ? "تغيير كلمة المرور" : "Change Password"}>
        <form onSubmit={handleChangePassword} className="space-y-3">
          {[
            { key: "next",    label: ar ? "كلمة المرور الجديدة"    : "New Password",     ph: "••••••••" },
            { key: "confirm", label: ar ? "تأكيد كلمة المرور"      : "Confirm Password",  ph: "••••••••" },
          ].map(f => (
            <div key={f.key} className="space-y-1.5">
              <label className="text-sm font-medium text-(--foreground)">{f.label}</label>
              <input
                type="password"
                value={pwForm[f.key as keyof typeof pwForm]}
                onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.ph}
                title={f.label}
                className="w-full px-3 py-2 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring)"
              />
            </div>
          ))}

          {pwError && (
            <p className="text-sm text-red-500 dark:text-red-400">{pwError}</p>
          )}
          {pwStatus === "success" && (
            <p className="text-sm text-green-600 dark:text-green-400">
              {ar ? "✓ تم تغيير كلمة المرور بنجاح" : "✓ Password changed successfully"}
            </p>
          )}

          <button
            type="submit"
            disabled={pwStatus === "loading"}
            className="px-5 py-2 rounded-xl text-sm font-medium bg-(--primary) text-(--primary-foreground) hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {pwStatus === "loading"
              ? (ar ? "جاري الحفظ..." : "Saving...")
              : (ar ? "تغيير كلمة المرور" : "Change Password")}
          </button>
        </form>
      </Section>

      {/* ── Appearance ───────────────────────────────────────────────── */}
      <Section title={ar ? "المظهر" : "Appearance"}>
        <Row
          label={ar ? "الوضع الليلي" : "Dark Mode"}
          sub={ar ? "تبديل بين الفاتح والداكن" : "Toggle light and dark theme"}
        >
          <Toggle
            value={resolvedTheme === "dark"}
            onChange={toggleTheme}
            label={ar ? "تبديل الوضع الليلي" : "Toggle dark mode"}
          />
        </Row>

        <div className="border-t border-(--border)" />

        <Row
          label={ar ? "اللغة" : "Language"}
          sub={ar ? "لغة واجهة لوحة التحكم" : "Dashboard interface language"}
        >
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium bg-(--muted) text-(--foreground) hover:bg-(--primary) hover:text-(--primary-foreground) transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
            </svg>
            {language === "ar" ? "English" : "عربي"}
          </button>
        </Row>
      </Section>

      {/* ── Danger zone ───────────────────────────────────────────────── */}
      <Section title={ar ? "منطقة الخطر" : "Danger Zone"}>
        <Row
          label={ar ? "تسجيل الخروج" : "Sign Out"}
          sub={ar ? "ستحتاج لإعادة تسجيل الدخول" : "You will need to sign in again"}
        >
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {ar ? "تسجيل الخروج" : "Sign Out"}
          </button>
        </Row>
      </Section>

    </div>
  );
};

export default Settings;