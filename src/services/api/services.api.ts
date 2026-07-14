import { supabase } from "../supabase/client";
import type { Service } from "../../types/api.types";

export const servicesApi = {
  getAll: async (): Promise<Service[]> => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  getStats: async () => {
    const { data, error } = await supabase
      .from("services")
      .select("is_active");
    if (error) throw error;
    const rows = data ?? [];
    return { total: rows.length, active: rows.filter(r => r.is_active).length };
  },

  create: async (payload: Omit<Service, "id" | "created_at">): Promise<Service> => {
    const { data, error } = await supabase
      .from("services")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, payload: Partial<Omit<Service, "id" | "created_at">>): Promise<Service> => {
    const { data, error } = await supabase
      .from("services")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw error;
  },

  reorder: async (ids: string[]): Promise<void> => {
    const updates = ids.map((id, index) =>
      supabase.from("services").update({ sort_order: index }).eq("id", id)
    );
    await Promise.all(updates);
  },
};