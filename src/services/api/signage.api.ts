// src/services/api/signage.api.ts
import { supabase } from "../supabase/client";
import type { SignageItem } from "../../types/api.types";

export const signageApi = {
  getAll: async (): Promise<SignageItem[]> => {
    const { data, error } = await supabase
      .from("signage")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  getStats: async () => {
    const { data, error } = await supabase.from("signage").select("is_active");
    if (error) throw error;
    const rows = data ?? [];
    return { total: rows.length, active: rows.filter(r => r.is_active).length };
  },

  create: async (payload: Omit<SignageItem, "id" | "created_at">): Promise<SignageItem> => {
    const { data, error } = await supabase.from("signage").insert(payload).select().single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, payload: Partial<Omit<SignageItem, "id" | "created_at">>): Promise<SignageItem> => {
    const { data, error } = await supabase.from("signage").update(payload).eq("id", id).select().single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from("signage").delete().eq("id", id);
    if (error) throw error;
  },
};