import { useQuery } from "@tanstack/react-query";
import { api } from "./api";
import type { Receipt } from "./types";

export function useReceipts() {
  return useQuery<Receipt[]>({
    queryKey: ["receipts"],
    queryFn: () => api.get("/receipts"),
  });
}

export function useReceipt(id: string) {
  return useQuery<Receipt>({
    queryKey: ["receipts", id],
    queryFn: () => api.get(`/receipts/${id}`),
    enabled: !!id,
  });
}
