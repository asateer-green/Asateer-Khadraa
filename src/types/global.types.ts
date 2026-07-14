export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";
export type Language = "ar" | "en";
export type Direction = "ltr" | "rtl";
export interface LanguageConfig {
  code: Language;
  dir: Direction;
  label: string;
  nativeLabel: string;
}
export type T = (key: string) => string;
export type Languages = {} & Record<Language, LanguageConfig>;
export type LanguagesMap = {} & Record<Language, LanguageConfig>;
export type TranslationNamespace = { [key: string]: string | TranslationNamespace };