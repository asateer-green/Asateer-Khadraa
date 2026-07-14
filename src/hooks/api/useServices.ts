// src/hooks/api/useServices.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesApi } from "../../services/api/services.api";
import type { Service } from "../../types/api.types";

export const SERVICES_KEYS = {
  all:   ["services"]          as const,
  stats: ["services", "stats"] as const,
};

export const useServices     = () =>
  useQuery({ queryKey: SERVICES_KEYS.all,   queryFn: servicesApi.getAll });

export const useServiceStats = () =>
  useQuery({ queryKey: SERVICES_KEYS.stats, queryFn: servicesApi.getStats });

export const useCreateService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Service, "id" | "created_at">) =>
      servicesApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: SERVICES_KEYS.all }),
  });
};

export const useUpdateService = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<Service> & { id: string }) =>
      servicesApi.update(id, payload),
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