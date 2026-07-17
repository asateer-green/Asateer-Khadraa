// src/types/api.types.ts

// ── Quote (طلب عرض سعر) ───────────────────────────────────────────────────
export type QuoteStatus = "pending" | "reviewed" | "accepted" | "rejected";

export interface Quote {
  id:           string;
  name:         string;
  email:        string;
  phone?:       string;
  service_type: string;
  description:  string;
  budget?:      string;
  deadline?:    string;
  status:       QuoteStatus;
  created_at:   string;
}

// ── Service (خدمة) ────────────────────────────────────────────────────────
export interface Service {
  id:          string;
  title_ar:    string;
  title_en:    string;
  desc_ar?:    string;
  desc_en?:    string;
  image_url?:  string;
  is_active:   boolean;
  sort_order:  number;
  created_at:  string;
}

// ── Portfolio item (عمل) ──────────────────────────────────────────────────
export interface PortfolioItem {
  id:           string;
  title_ar:     string;
  title_en:     string;
  category_id?: string;
  image_url?:   string;
  is_featured:  boolean;
  created_at:   string;
  
}

// ── Signage item (لوحة إعلانية) ──────────────────────────────────────────
export interface SignageItem {
  id:          string;
  title_ar:    string;
  title_en:    string;
  location?:   string;
  image_url?:  string;
  is_active:   boolean;
  created_at:  string;
}

// ── Category (تصنيف) ─────────────────────────────────────────────────────
export interface Category {
  id:        string;
  name_ar:   string;
  name_en:   string;
  created_at: string;
  image_url?: string;
}

// ── Generic API response wrappers ─────────────────────────────────────────
export interface PaginatedResponse<T> {
  data:  T[];
  count: number;
}

// في types/api.types.ts
export interface Logo {
  id: number;
  title_ar: string;
  title_en: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}