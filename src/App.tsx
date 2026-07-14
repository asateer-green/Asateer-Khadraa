import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./app/providers/ThemeProvider";
import { LanguageProvider } from "./app/providers/LanguageProvider";
import { QueryProvider } from "./app/providers/QueryProvider";
import { AuthProvider } from "./app/providers/AuthProvider";
import { router } from "./app/router";

/**
 * Provider order (outer → inner):
 * QueryProvider → ThemeProvider → LanguageProvider → AuthProvider → RouterProvider
 *
 * ThemeProvider & LanguageProvider must be outermost UI providers
 * so their effects (dark class, dir attr) run before any layout paint.
 */
export default function App() {
  return (
    <QueryProvider>
      <ThemeProvider defaultTheme="system">
        <LanguageProvider defaultLanguage="ar">
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
