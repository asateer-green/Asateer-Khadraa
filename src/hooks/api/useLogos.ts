// src/hooks/api/useLogos.ts
//
// LogosManager كان يتحدث مباشرة مع supabase داخل الـ component (fetch/insert/delete/upload)
// بينما كل الصفحات الأخرى (Categories, Signage, Portfolio, Quotes) تمر عبر hooks مبنية على
// React Query. هذا الملف يوحّد Logos مع نفس النمط: caching, invalidation, وفصل منطق
// الرفع لملف تخزين عن الـ UI.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../services/supabase/client";
import type { Logo } from "../../types/api.types";

const QUERY_KEY = ["logos"] as const;

async function uploadLogoFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const filePath = `designed-logos/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("logos").upload(filePath, file);
  if (error) throw new Error(error.message);
  return supabase.storage.from("logos").getPublicUrl(filePath).data.publicUrl;
}

export function useLogos() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<Logo[]> => {
      const { data, error } = await supabase
        .from("logo_designs")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
}

export interface CreateLogoInput {
  title_ar: string;
  title_en: string;
  sort_order: number;
  // إما ملف يُرفع لتخزين Supabase أو رابط خارجي جاهز — واحد منهما فقط
  imageFile?: File | null;
  imageUrl?: string;
}

export function useCreateLogo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateLogoInput) => {
      const image_url = input.imageFile ? await uploadLogoFile(input.imageFile) : (input.imageUrl ?? "").trim();
      if (!image_url) throw new Error("Missing image");

      const { error } = await supabase.from("logo_designs").insert([{
        title_ar: input.title_ar.trim(),
        title_en: input.title_en.trim(),
        image_url,
        sort_order: Number(input.sort_order) || 0,
        is_active: true,
      }]);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteLogo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("logo_designs").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export interface UpdateLogoInput {
  id: number;
  title_ar: string;
  title_en: string;
  sort_order: number;
  imageFile?: File | null;
  imageUrl?: string;
}

export function useUpdateLogo() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (input: UpdateLogoInput) => {
      // إذا قام المستخدم برفع ملف جديد، نقوم برفعه، وإلا نستخدم الرابط النصي المدخل
      const image_url = input.imageFile 
        ? await uploadLogoFile(input.imageFile) 
        : (input.imageUrl ?? "").trim();
        
      if (!image_url) throw new Error("Missing image");

      const { error } = await supabase
        .from("logo_designs")
        .update({
          title_ar: input.title_ar.trim(),
          title_en: input.title_en.trim(),
          image_url,
          sort_order: Number(input.sort_order) || 0,
        })
        .eq("id", input.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}