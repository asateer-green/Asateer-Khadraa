
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
// import "./styles/animations.css";
import App from "./App";

/**
 * ANTI-FLICKER SCRIPT – runs synchronously before React mounts.
 * Applies theme class and lang/dir to <html> before first paint.
 */
(function applyInitialThemeAndLang() {
  try {
    // ── Theme ──
    const storedTheme = localStorage.getItem("asateer-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark =
      storedTheme === "dark" ||
      (storedTheme !== "light" && prefersDark);

    if (isDark) {
      document.documentElement.classList.add("dark");
    }

    // ── Language / Direction ──
    const storedLang = localStorage.getItem("asateer-lang");
    const browserLang = navigator.language.split("-")[0];
    const lang = storedLang === "ar" || storedLang === "en"
      ? storedLang
      : browserLang === "ar" ? "ar" : "en";

    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  } catch {
    // localStorage might be unavailable (private browsing, etc.)
  }
})();

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element #root not found in document.");
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);