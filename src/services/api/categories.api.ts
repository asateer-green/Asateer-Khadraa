// src/services/api/categories.api.ts
import { supabase } from "../supabase/client";
import type { Category } from "../../types/api.types";

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const { data, error } = await supabase.from("categories").select("*").order("name_ar");
    if (error) throw error;
    return data ?? [];
  },

  create: async (payload: Omit<Category, "id" | "created_at">): Promise<Category> => {
    const { data, error } = await supabase.from("categories").insert(payload).select().single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, payload: Partial<Omit<Category, "id" | "created_at">>): Promise<Category> => {
    const { data, error } = await supabase.from("categories").update(payload).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw error;
  },
};