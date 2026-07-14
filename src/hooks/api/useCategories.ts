// src/hooks/api/useCategories.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "../../services/api/categories.api";
import type { Category } from "../../types/api.types";

export const CATEGORIES_KEYS = { all: ["categories"] as const };

export const useCategories = () => useQuery({ queryKey: CATEGORIES_KEYS.all, queryFn: categoriesApi.getAll });

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: Omit<Category, "id" | "created_at">) => categoriesApi.create(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEYS.all }),
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...p }: Partial<Category> & { id: string }) => categoriesApi.update(id, p),
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEYS.all }),
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEYS.all }),
  });
};