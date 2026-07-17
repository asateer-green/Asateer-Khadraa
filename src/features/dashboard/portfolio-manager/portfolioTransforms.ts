// src/features/dashboard/portfolio-manager/portfolioTransforms.ts
//
// منطق تحويل "نص مفصول بفواصل" ↔ "مصفوفة" كان مكرراً حرفياً في 3 أماكن مختلفة
// داخل PortfolioManager.tsx الأصلي (تهيئة الفورم، handleSave، handleOpenPreview).
// كل ده بقى دالتين هنا يُستدعوا من كل مكان.
import type { PortfolioItem } from "../../../types/api.types";

/** يحوّل "أ, ب, ج" أو مصفوفة جاهزة إلى مصفوفة نصوص نظيفة بدون فراغات */
export function toList(raw: string[] | string | null | undefined): string[] {
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === "string") {
    return raw.split(",").map(s => s.trim()).filter(Boolean);
  }
  return [];
}

/** يحوّل مصفوفة إلى نص مفصول بفواصل، جاهز للحفظ كحقل نصي */
export function toCsv(list: string[]): string {
  return list.filter(Boolean).join(", ");
}

// النوع الحقيقي المستخدم من الواجهة يحمل حقولاً إضافية (description_ar, client, year,
// scope_ar/en, gallery) لا يزال PortfolioItem الرسمي في types/api.types.ts لا يعرّفها.
// هذا type محلي مؤقت يوثّق الحقول الفعلية بدل تشتيت `as any` في كل مكان — الحل الجذري
// هو تحديث PortfolioItem نفسه في types/api.types.ts وحذف هذا الملف.
export interface PortfolioItemExtended extends PortfolioItem {
  description_ar?: string;
  description_en?: string;
  client?: string;
  year?: string;
  scope_ar?: string[] | string;
  scope_en?: string[] | string;
  gallery?: string[] | string;
  images?: string[] | string;
}