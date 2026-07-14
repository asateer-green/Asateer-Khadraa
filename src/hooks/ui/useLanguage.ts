import { useLanguageContext } from "../../app/providers/LanguageProvider"; // اتأكدي من مسار الـ Provider عندك

export const useLanguage = () => {
  const context = useLanguageContext();
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
