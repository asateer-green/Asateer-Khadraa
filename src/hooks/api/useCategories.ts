// src/hooks/api/useCategories.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../services/supabase/client";
import type { Category } from "../../types/api.types";

const QUERY_KEY = ["categories"] as const;

// دالة مساعدة لرفع ملف صورة التصنيف إلى مجلد الكاتيجوري في الـ Storage
async function uploadCategoryFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const filePath = `categories/${Date.now()}.${ext}`;
  
  // نقوم برفع الصورة إلى صندوق "categories" (تأكد من إنشاء هذا الصندوق في Supabase أو استخدم 'logos')
  const { error } = await supabase.storage.from("categories").upload(filePath, file);
  if (error) throw new Error(error.message);
  
  return supabase.storage.from("categories").getPublicUrl(filePath).data.publicUrl;
}

export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("categories") // تأكد من اسم الجدول لديك في قاعدة البيانات
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
}

export interface CreateCategoryInput {
  name_ar: string;
  name_en: string;
  imageFile?: File | null;
  image_url?: string;
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCategoryInput) => {
      // إذا تم اختيار ملف من الجهاز نرفعه، وإلا نستخدم الرابط النصي
      const image_url = input.imageFile 
        ? await uploadCategoryFile(input.imageFile) 
        : (input.image_url ?? "").trim();

      const { error } = await supabase.from("categories").insert([
        {
          name_ar: input.name_ar.trim(),
          name_en: input.name_en.trim(),
          image_url: image_url || null,
        },
      ]);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export interface UpdateCategoryInput extends CreateCategoryInput {
  id: string |number;
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateCategoryInput) => {
      const image_url = input.imageFile 
        ? await uploadCategoryFile(input.imageFile) 
        : (input.image_url ?? "").trim();

      const { error } = await supabase
        .from("categories")
        .update({
          name_ar: input.name_ar.trim(),
          name_en: input.name_en.trim(),
          image_url: image_url || null,
        })
        .eq("id", input.id);
        
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

