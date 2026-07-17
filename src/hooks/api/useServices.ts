// src/hooks/api/useServices.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesApi } from "../../services/api/services.api";
import { supabase } from "../../services/supabase/client"; // استيراد السوبابيس للرفع
import type { Service } from "../../types/api.types";

export const SERVICES_KEYS = {
  all:   ["services"]          as const,
  stats: ["services", "stats"] as const,
};

// ── دالة مساعدة لرفع صورة الخدمة إلى صندوق logos ──
async function uploadServiceFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const filePath = `services-images/${Date.now()}.${ext}`;
  
  const { error } = await supabase.storage.from("logos").upload(filePath, file);
  if (error) throw new Error(error.message);
  
  return supabase.storage.from("logos").getPublicUrl(filePath).data.publicUrl;
}

export const useServices     = () =>
  useQuery({ queryKey: SERVICES_KEYS.all,   queryFn: servicesApi.getAll });

export const useServiceStats = () =>
  useQuery({ queryKey: SERVICES_KEYS.stats, queryFn: servicesApi.getStats });

// ── بناء الـ Types للمدخلات لضمان التوافق التام ومنع الـ any ──
export interface CreateServicePayload extends Omit<Service, "id" | "created_at"> {
  imageFile?: File | null;
}

export interface UpdateServicePayload extends Partial<Service> {
  id: string;
  imageFile?: File | null;
}

export const useCreateService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ imageFile, image_url, ...payload }: CreateServicePayload) => {
      let finalImageUrl = image_url || "";
      
      if (imageFile) {
        finalImageUrl = await uploadServiceFile(imageFile);
      }
      
      return servicesApi.create({
        ...payload,
        image_url: finalImageUrl || undefined,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: SERVICES_KEYS.all }),
  });
};

export const useUpdateService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, imageFile, image_url, ...payload }: UpdateServicePayload) => {
      let finalImageUrl = image_url;
      
      if (imageFile) {
        finalImageUrl = await uploadServiceFile(imageFile);
      }
      
      return servicesApi.update(id, {
        ...payload,
        ...(finalImageUrl !== undefined ? { image_url: finalImageUrl || undefined } : {}),
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: SERVICES_KEYS.all }),
  });
};

export const useDeleteService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => servicesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SERVICES_KEYS.all }),
  });
};