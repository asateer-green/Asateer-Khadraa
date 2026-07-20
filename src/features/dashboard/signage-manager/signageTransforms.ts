// src/features/dashboard/signage-manager/signageTransforms.ts
//
// نفس فكرة portfolioTransforms.ts بالحرف: منطق "نص مفصول بفواصل" ↔ "مصفوفة"
// وتوثيق الحقول الموسّعة (gallery, description, client, year, scope) اللي
// SignageItem الرسمي في types/api.types.ts لسه ما بيعرفهاش، لحد ما نحدّثه هناك.
import type { SignageItem } from "../../../types/api.types";

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

// نفس أسلوب PortfolioItemExtended: type محلي مؤقت يوثّق الحقول الإضافية
// (الوصف، العميل، السنة، نطاق العمل، معرض الصور) اللي أضفناها للوحات عشان
// تتصرف بنفس منطق إدارة الأعمال. الحل الجذري: تحديث SignageItem نفسه في
// types/api.types.ts وحذف هذا الـ extended type بعدين.
export interface SignageItemExtended extends SignageItem {
  description_ar?: string;
  description_en?: string;
  client?: string;
  year?: string;
  scope_ar?: string[] | string;
  scope_en?: string[] | string;
  gallery?: string[] | string;
  // ملحوظة: "images" مش متعرّفة هنا لأنها أصلاً موجودة في SignageItem نفسه
  // (في api.types.ts). لو أعدنا تعريفها هنا بنوع مختلف/أوسع، TypeScript بيرفض
  // الـ extends لأن الخاصية الموروثة لازم تفضل متوافقة مع الأصل.
}