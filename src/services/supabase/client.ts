// src/services/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import env from '../../app/config/env';

if (!env.supabase.url || !env.supabase.anonKey) {
  throw new Error(
    'Supabase غير مهيأ. أضف VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في ملف .env'
  );
}

export const supabase = createClient(
  env.supabase.url,
  env.supabase.anonKey,
  {
    auth: {
      // يحتفظ بالجلسة في localStorage تلقائياً
      persistSession: true,
      // يجدد الـ token تلقائياً قبل انتهائه
      autoRefreshToken: true,
    },
  }
);

export default supabase;