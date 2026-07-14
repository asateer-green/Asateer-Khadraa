// src/services/api/quotes.api.ts
import { supabase } from "../supabase/client";
import type { Quote, QuoteStatus } from "../../types/api.types";

export const quotesApi = {
  /** جلب كل الطلبات مرتبة من الأحدث */
  getAll: async (): Promise<Quote[]> => {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  /** إحصاءات سريعة للـ Dashboard */
  getStats: async () => {
    const { data, error } = await supabase
      .from("quotes")
      .select("status");
    if (error) throw error;
    const rows = data ?? [];
    return {
      total:    rows.length,
      pending:  rows.filter(r => r.status === "pending").length,
      reviewed: rows.filter(r => r.status === "reviewed").length,
      accepted: rows.filter(r => r.status === "accepted").length,
    };
  },

  /** تحديث حالة طلب */
  updateStatus: async (id: string, status: QuoteStatus): Promise<void> => {
    const { error } = await supabase
      .from("quotes")
      .update({ status })
      .eq("id", id);
    if (error) throw error;
  },
};