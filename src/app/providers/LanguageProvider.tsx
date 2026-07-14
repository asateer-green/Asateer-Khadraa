// src/app/providers/LanguageProvider.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Language, Direction, LanguageConfig } from "../../types/global.types";
import { getTranslation } from "../../i18n";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY   = "asateer-lang";
const DEFAULT_LANG: Language = "ar"; // always a valid Language literal

const VALID_LANGS = new Set<Language>(["ar", "en"]);

// ─────────────────────────────────────────────────────────────────────────────
// Language configs
// ─────────────────────────────────────────────────────────────────────────────
export const LANGUAGE_CONFIGS: Record<Language, LanguageConfig> = {
  ar: { code: "ar", dir: "rtl", label: "Arabic",  nativeLabel: "العربية" },
  en: { code: "en", dir: "ltr", label: "English", nativeLabel: "English" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Context type
// ─────────────────────────────────────────────────────────────────────────────
interface LanguageContextValue {
  language:       Language;
  direction:      Direction;
  config:         LanguageConfig;
  setLanguage:    (lang: Language) => void;
  toggleLanguage: () => void;
  /** Translate a dot-notation key. Never returns undefined. */
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Safe helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Always returns a valid Language — never undefined, never throws. */
function safeGetStoredLanguage(): Language {
  try {
    if (typeof window === "undefined") return DEFAULT_LANG;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && VALID_LANGS.has(raw as Language)) return raw as Language;
    const browser = (navigator?.language ?? "").split("-")[0].toLowerCase();
    return browser === "ar" ? "ar" : "en";
  } catch {
    return DEFAULT_LANG;
  }
}

function applyToDocument(lang: Language, dir: Direction): void {
  try {
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir",  dir);
  } catch {
    // noop — SSR / test environments
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────
interface LanguageProviderProps {
  children:         ReactNode;
  defaultLanguage?: Language;
}

export function LanguageProvider({
  children,
  defaultLanguage = DEFAULT_LANG,
}: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    // safeGetStoredLanguage() NEVER returns undefined
    const detected = safeGetStoredLanguage();
    // Extra guard: if somehow still not valid, fall back to prop or constant
    return VALID_LANGS.has(detected) ? detected : (defaultLanguage ?? DEFAULT_LANG);
  });

  // Derived — always valid because language is always "ar" | "en"
  const config    = LANGUAGE_CONFIGS[language] ?? LANGUAGE_CONFIGS[DEFAULT_LANG];
  const direction = config.dir;

  // Apply to DOM on mount
  useEffect(() => {
    applyToDocument(language, direction);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setLanguage = useCallback((lang: Language) => {
    if (!VALID_LANGS.has(lang)) return; // reject invalid input silently
    const cfg = LANGUAGE_CONFIGS[lang];
    setLanguageState(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* noop */ }
    applyToDocument(lang, cfg.dir);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "ar" ? "en" : "ar");
  }, [language, setLanguage]);

  /**
   * Translation function.
   * Guards against undefined/null/empty key — always returns a string.
   */
  const t = useCallback(
    (key: string): string => {
      // Hard guard: if key is not a non-empty string, return empty string
      if (typeof key !== "string" || key.trim() === "") return "";
      return getTranslation(language, key);
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{ language, direction, config, setLanguage, toggleLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────
export function useLanguageContext(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguageContext must be used within <LanguageProvider>");
  return ctx;
}

export default LanguageProvider;