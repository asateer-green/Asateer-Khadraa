// src/hooks/api/usePortfolio.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { portfolioApi } from "../../services/api/portfolio.api";
import { supabase } from "../../services/supabase/client";
import type { PortfolioItem } from "../../types/api.types";

export const PORTFOLIO_KEYS = {
  all:   ["portfolio"]          as const,
  stats: ["portfolio", "stats"] as const,
};

// دالة مساعدة لرفع أي ملف إلى مجلد محدد داخل صندوق logos المضمون
async function uploadPortfolioFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const filePath = `portfolio-images/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
  
  const { error } = await supabase.storage.from("logos").upload(filePath, file);
  if (error) throw new Error(error.message);
  
  return supabase.storage.from("logos").getPublicUrl(filePath).data.publicUrl;
}

// دالة لمعالجة ورفع مصفوفة المعرض بالكامل (ملفات وروابط) وتحويلها لنص CSV
async function processGalleryItems(items: any[] = []): Promise<string> {
  const urls: string[] = [];
  
  for (const item of items) {
    if (item.mode === "file" && item.file) {
      const url = await uploadPortfolioFile(item.file);
      urls.push(url);
    } else if (item.mode === "url" && item.url?.trim()) {
      urls.push(item.url.trim());
    }
  }
  
  return urls.filter(Boolean).join(", ");
}

export const usePortfolio      = () => useQuery({ queryKey: PORTFOLIO_KEYS.all, queryFn: portfolioApi.getAll });
export const usePortfolioStats = () => useQuery({ queryKey: PORTFOLIO_KEYS.stats, queryFn: portfolioApi.getStats });

export interface CreatePortfolioPayload extends Omit<PortfolioItem, "id" | "created_at"> {
  imageFile?: File | null;
  galleryItems?: any[];
}

export interface UpdatePortfolioPayload extends Partial<PortfolioItem> {
  id: string;
  imageFile?: File | null;
  galleryItems?: any[];
}

export const useCreatePortfolio = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ imageFile, image_url, galleryItems, ...payload }: CreatePortfolioPayload) => {
      let finalImageUrl = image_url || "";
      if (imageFile) finalImageUrl = await uploadPortfolioFile(imageFile);

      // رفع صور المعرض الإضافية
      const finalGallery = await processGalleryItems(galleryItems);
      
      return portfolioApi.create({
        ...payload,
        image_url: finalImageUrl || undefined,
        gallery: finalGallery || undefined,
      } as any);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PORTFOLIO_KEYS.all }),
  });
};

export const useUpdatePortfolio = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, imageFile, image_url, galleryItems, ...payload }: UpdatePortfolioPayload) => {
      let finalImageUrl = image_url;
      if (imageFile) finalImageUrl = await uploadPortfolioFile(imageFile);

      // معالجة تعديل ورفع صور المعرض الإضافية
      const finalGallery = await processGalleryItems(galleryItems);
      
      return portfolioApi.update(id, {
        ...payload,
        ...(finalImageUrl !== undefined ? { image_url: finalImageUrl || undefined } : {}),
        ...(galleryItems !== undefined ? { gallery: finalGallery || undefined } : {}),
      } as any);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: PORTFOLIO_KEYS.all }),
  });
};

export const useDeletePortfolio = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => portfolioApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PORTFOLIO_KEYS.all }),
  });
};