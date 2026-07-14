// src/i18n/index.ts
import type { Language } from "../types/global.types";
import ar from "./ar";
import en from "./en";

// Record بيقبل أي object — بدون TranslationNamespace cast الذي كان يكسر الـ resolution
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const translations: Record<Language, Record<string, any>> = { ar, en };

/**
 * Resolves a dot-notation key from the translations object.
 * Fallback chain: requested lang → Arabic → raw key string.
 * NEVER throws, NEVER returns undefined.
 *
 * @example
 * getTranslation("ar", "nav.home")            // "الرئيسية"
 * getTranslation("en", "services.design.title") // "Design & Media"
 */
export function getTranslation(lang: Language, key: string): string {
  if (typeof key  !== "string" || key.trim()  === "") return "";
  if (typeof lang !== "string" || lang.trim() === "") lang = "ar";

  // Try requested language
  const direct = _resolve(translations[lang], key);
  if (direct !== null) return direct;

  // Fallback to Arabic
  if (lang !== "ar") {
    const fallback = _resolve(translations["ar"], key);
    if (fallback !== null) return fallback;
  }

  // Last resort: return the raw key (visible bug marker during dev)
  return key;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _resolve(obj: Record<string, any> | undefined | null, key: string): string | null {
  if (obj == null || typeof obj !== "object") return null;
  if (typeof key !== "string" || key.trim() === "") return null;

  const parts = key.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cur: any = obj;

  for (const part of parts) {
    if (cur == null || typeof cur !== "object") return null;
    cur = cur[part];
    if (cur === undefined || cur === null) return null;
  }

  return typeof cur === "string" ? cur : null;
}

export { ar, en };
export type { Language };