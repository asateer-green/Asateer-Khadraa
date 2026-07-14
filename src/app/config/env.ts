// src/app/config/env.ts
// كل متغيرات البيئة في مكان واحد — لا تستخدم import.meta.env مباشرة خارج هذا الملف

const env = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL as string,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  },
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;

// تحقق مبكر في وضع التطوير فقط
if (env.isDev) {
  const missing: string[] = [];
  if (!env.supabase.url)     missing.push('VITE_SUPABASE_URL');
  if (!env.supabase.anonKey) missing.push('VITE_SUPABASE_ANON_KEY');
  if (missing.length) {
    console.warn(
      `[env] متغيرات بيئة مفقودة:\n  ${missing.join('\n  ')}\n` +
      `  أضفها في ملف .env في جذر المشروع.`
    );
  }
}

export default env;