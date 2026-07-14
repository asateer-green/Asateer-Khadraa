// src/features/dashboard/auth/Login.tsx
import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../../app/providers/AuthProvider";
import { useLanguage } from "../../../hooks/ui/useLanguage";

// ── Login Page ─────────────────────────────────────────────────────────────
const Login = () => {
  const { login } = useAuthContext();
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [error,      setError]      = useState<string | null>(null);
  const [isLoading,  setIsLoading]  = useState(false);
  const [showPass,   setShowPass]   = useState(false);

  // الرجوع للصفحة التي طلبها قبل إعادة التوجيه لـ login
  const from = (location.state as { from?: string })?.from ?? "/dashboard";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError(t("auth.invalidCredentials"));
      return;
    }

    setIsLoading(true);
    const { error: authError } = await login(email.trim(), password);
    setIsLoading(false);

    if (authError) {
      setError(t("auth.invalidCredentials"));
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div
      dir={direction}
      className="bg-(--card) border border-(--border) rounded-2xl p-8 shadow-sm"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-(--foreground) mb-1">
          {t("auth.login")}
        </h1>
        <p className="text-sm text-(--muted-foreground)">
          {direction === "rtl"
            ? "أدخل بيانات دخولك للمتابعة"
            : "Enter your credentials to continue"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-(--foreground)"
          >
            {t("auth.email")}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isLoading}
            placeholder={direction === "rtl" ? "example@email.com" : "example@email.com"}
            className="
              w-full px-4 py-2.5 rounded-xl text-sm
              bg-(--input) border border-(--border)
              text-(--foreground) placeholder:text-(--muted-foreground)
              focus:outline-none focus:ring-2 focus:ring-(--ring)
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-shadow
            "
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-(--foreground)"
            >
              {t("auth.password")}
            </label>
            <button
              type="button"
              className="text-xs text-(--muted-foreground) hover:text-(--foreground) transition-colors"
              onClick={() => {/* TODO: forgot password flow */}}
            >
              {t("auth.forgotPassword")}
            </button>
          </div>

          <div className="relative">
            <input
              id="password"
              type={showPass ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading}
              className="
                w-full px-4 py-2.5 rounded-xl text-sm
                bg-(--input) border border-(--border)
                text-(--foreground) placeholder:text-(--muted-foreground)
                focus:outline-none focus:ring-2 focus:ring-(--ring)
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-shadow
              "
            />
            {/* Show / hide password toggle */}
            <button
              type="button"
              aria-label={showPass ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              onClick={() => setShowPass(v => !v)}
              className="
                absolute inset-y-0 inset-e-3
                flex items-center text-(--muted-foreground)
                hover:text-(--foreground) transition-colors
              "
            >
              {showPass ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="shrink-0 text-red-500">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="
            w-full py-2.5 px-4 rounded-xl font-medium text-sm
            bg-(--primary) text-(--primary-foreground)
            hover:opacity-90 active:scale-[0.98]
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-all duration-150
            flex items-center justify-center gap-2
          "
        >
          {isLoading ? (
            <>
              <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
              <span>{direction === "rtl" ? "جاري الدخول..." : "Signing in..."}</span>
            </>
          ) : (
            t("auth.loginButton")
          )}
        </button>
      </form>
    </div>
  );
};

export default Login;