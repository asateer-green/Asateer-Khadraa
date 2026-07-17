// src/features/dashboard/auth/Login.tsx
import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useAuthContext } from "../../../app/providers/AuthProvider";
import { useLanguage } from "../../../hooks/ui/useLanguage";

const Login = () => {
  const { login } = useAuthContext();
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const ar = direction === "rtl";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // الرجوع للصفحة التي طلبها المستخدم قبل إعادة التوجيه لـ login
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
    <div dir={direction} className="bg-(--card) border border-(--border) rounded-2xl p-8 shadow-sm">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-(--foreground) mb-1">{t("auth.login")}</h1>
        <p className="text-sm text-(--muted-foreground)">
          {ar ? "أدخل بيانات دخولك للمتابعة" : "Enter your credentials to continue"}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-(--foreground)">
            {t("auth.email")}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isLoading}
            placeholder="example@email.com"
            className="w-full px-4 py-2.5 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring) disabled:opacity-50 disabled:cursor-not-allowed transition-shadow"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-(--foreground)">
              {t("auth.password")}
            </label>
            {/* معطّل مؤقتاً بدل زر بلا وظيفة (كان onClick فارغاً في النسخة الأصلية) */}
            <button
              type="button"
              disabled
              title={ar ? "قريباً" : "Coming soon"}
              className="text-xs text-(--muted-foreground) opacity-50 cursor-not-allowed"
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
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-(--input) border border-(--border) text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--ring) disabled:opacity-50 disabled:cursor-not-allowed transition-shadow"
            />
            <button
              type="button"
              aria-label={
                showPass
                  ? ar ? "إخفاء كلمة المرور" : "Hide password"
                  : ar ? "إظهار كلمة المرور" : "Show password"
              }
              onClick={() => setShowPass(v => !v)}
              className="absolute inset-y-0 inset-e-3 flex items-center text-(--muted-foreground) hover:text-(--foreground) transition-colors"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
          >
            <AlertCircle size={15} className="shrink-0 text-red-500" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl font-medium text-sm bg-(--primary) text-(--primary-foreground) hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>{ar ? "جاري الدخول..." : "Signing in..."}</span>
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