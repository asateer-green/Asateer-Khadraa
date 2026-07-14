import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Theme, ResolvedTheme } from "../../types/global.types";

// ── Constants ──────────────────────────────────────────────────────────────
const STORAGE_KEY = "asateer-theme";
const DARK_CLASS = "dark";

// ── Context types ──────────────────────────────────────────────────────────
interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// ── Context ────────────────────────────────────────────────────────────────
export const ThemeContext = createContext<ThemeContextValue | null>(null);

// ── Helpers ────────────────────────────────────────────────────────────────
function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

/**
 * Applies the resolved theme to <html> element.
 * Temporarily disables transitions to prevent the flicker on initial load.
 */
function applyTheme(resolved: ResolvedTheme, animate = true): void {
  const html = document.documentElement;

  if (!animate) {
    html.classList.add("no-transition");
  }

  if (resolved === "dark") {
    html.classList.add(DARK_CLASS);
  } else {
    html.classList.remove(DARK_CLASS);
  }

  if (!animate) {
    // Force reflow then re-enable transitions
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    html.offsetHeight;
    html.classList.remove("no-transition");
  }
}

// ── Provider ───────────────────────────────────────────────────────────────
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Runs on client only; SSR falls back to defaultTheme
    if (typeof window === "undefined") return defaultTheme;
    return getStoredTheme();
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(theme),
  );

  // Apply theme without animation on first paint to avoid FOUC
  useEffect(() => {
    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);
    applyTheme(resolved, false); // no animation on mount
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for system theme changes when theme = "system"
  useEffect(() => {
    if (theme !== "system") return;

    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      const resolved: ResolvedTheme = e.matches ? "dark" : "light";
      setResolvedTheme(resolved);
      applyTheme(resolved);
    };

    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    const resolved = resolveTheme(newTheme);
    setThemeState(newTheme);
    setResolvedTheme(resolved);
    localStorage.setItem(STORAGE_KEY, newTheme);
    applyTheme(resolved);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// ── Hook ───────────────────────────────────────────────────────────────────
export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within <ThemeProvider>");
  }
  return ctx;
}

export default ThemeProvider;
