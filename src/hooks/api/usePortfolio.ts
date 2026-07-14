// src/hooks/api/usePortfolio.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { portfolioApi } from "../../services/api/portfolio.api";
import type { PortfolioItem } from "../../types/api.types";

export const PORTFOLIO_KEYS = {
  all:   ["portfolio"]           as const,
  stats: ["portfolio", "stats"]  as const,
};

export const usePortfolio      = () =>
  useQuery({ queryKey: PORTFOLIO_KEYS.all,   queryFn: portfolioApi.getAll });

export const usePortfolioStats = () =>
  useQuery({ queryKey: PORTFOLIO_KEYS.stats, queryFn: portfolioApi.getStats });

export const useCreatePortfolio = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<PortfolioItem, "id" | "created_at">) =>
      portfolioApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: PORTFOLIO_KEYS.all }),
  });
};

export const useUpdatePortfolio = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: Partial<PortfolioItem> & { id: string }) =>
      portfolioApi.update(id, payload),
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