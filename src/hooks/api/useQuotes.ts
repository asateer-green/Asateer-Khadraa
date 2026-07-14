// src/hooks/api/useQuotes.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quotesApi } from "../../services/api/quotes.api";
import type { QuoteStatus } from "../../types/api.types";

export const QUOTES_KEYS = {
  all:   ["quotes"]         as const,
  stats: ["quotes", "stats"] as const,
};

export const useQuotes = () =>
  useQuery({ queryKey: QUOTES_KEYS.all, queryFn: quotesApi.getAll });

export const useQuoteStats = () =>
  useQuery({ queryKey: QUOTES_KEYS.stats, queryFn: quotesApi.getStats });

export const useUpdateQuoteStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: QuoteStatus }) =>
      quotesApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUOTES_KEYS.all }),
  });
};