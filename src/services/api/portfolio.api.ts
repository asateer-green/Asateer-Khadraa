// src/services/api/portfolio.api.ts
import { supabase } from "../supabase/client";
import type { PortfolioItem } from "../../types/api.types";

export const portfolioApi = {
  getAll: async (): Promise<PortfolioItem[]> => {
    const { data, error } = await supabase
      .from("portfolio")
      .select("*, categories(name_ar, name_en)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  getStats: async () => {
    const { data, error } = await supabase
      .from("portfolio")
      .select("is_featured");
    if (error) throw error;
    const rows = data ?? [];
    return { total: rows.length, featured: rows.filter(r => r.is_featured).length };
  },

  create: async (payload: Omit<PortfolioItem, "id" | "created_at">): Promise<PortfolioItem> => {
    const { data, error } = await supabase
      .from("portfolio")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, payload: Partial<Omit<PortfolioItem, "id" | "created_at">>): Promise<PortfolioItem> => {
    const { data, error } = await supabase
      .from("portfolio")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from("portfolio").delete().eq("id", id);
    if (error) throw error;
  },
};