// src/hooks/api/useSignage.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { signageApi } from "../../services/api/signage.api";
import type { SignageItem } from "../../types/api.types";

export const SIGNAGE_KEYS = {
  all:   ["signage"]          as const,
  stats: ["signage", "stats"] as const,
};

export const useSignage      = () => useQuery({ queryKey: SIGNAGE_KEYS.all,   queryFn: signageApi.getAll });
export const useSignageStats = () => useQuery({ queryKey: SIGNAGE_KEYS.stats, queryFn: signageApi.getStats });

export const useCreateSignage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: Omit<SignageItem, "id" | "created_at">) => signageApi.create(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: SIGNAGE_KEYS.all }),
  });
};

export const useUpdateSignage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...p }: Partial<SignageItem> & { id: string }) => signageApi.update(id, p),
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