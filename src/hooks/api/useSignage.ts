// src/hooks/api/useSignage.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { signageApi } from "../../services/api/signage.api";
import { supabase } from "../../services/supabase/client"; // استيراد السوبابيس للرفع
import type { SignageItem } from "../../types/api.types";

export const SIGNAGE_KEYS = {
  all:   ["signage"]          as const,
  stats: ["signage", "stats"] as const,
};

// ── دالة مساعدة لرفع صورة اللوحة الإعلانية إلى صندوق logos المضمون ──
async function uploadSignageFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const filePath = `signage-images/${Date.now()}.${ext}`;
  
  const { error } = await supabase.storage.from("logos").upload(filePath, file);
  if (error) throw new Error(error.message);
  
  return supabase.storage.from("logos").getPublicUrl(filePath).data.publicUrl;
}

export const useSignage      = () => useQuery({ queryKey: SIGNAGE_KEYS.all,   queryFn: signageApi.getAll });
export const useSignageStats = () => useQuery({ queryKey: SIGNAGE_KEYS.stats, queryFn: signageApi.getStats });

// ── بناء الـ Types للمدخلات لضمان التوافق التام بدون any ──
export interface CreateSignagePayload extends Omit<SignageItem, "id" | "created_at"> {
  imageFile?: File | null;
}

export interface UpdateSignagePayload extends Partial<SignageItem> {
  id: string;
  imageFile?: File | null;
}

export const useCreateSignage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ imageFile, image_url, ...payload }: CreateSignagePayload) => {
      let finalImageUrl = image_url || "";
      
      if (imageFile) {
        finalImageUrl = await uploadSignageFile(imageFile);
      }
      
      return signageApi.create({
        ...payload,
        image_url: finalImageUrl || undefined,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: SIGNAGE_KEYS.all }),
  });
};

export const useUpdateSignage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, imageFile, image_url, ...payload }: UpdateSignagePayload) => {
      let finalImageUrl = image_url;
      
      if (imageFile) {
        finalImageUrl = await uploadSignageFile(imageFile);
      }
      
      return signageApi.update(id, {
        ...payload,
        ...(finalImageUrl !== undefined ? { image_url: finalImageUrl || undefined } : {}),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: SIGNAGE_KEYS.all }),
  });
};

export const useDeleteSignage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => signageApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SIGNAGE_KEYS.all }),
  });
};