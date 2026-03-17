import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import type { Invoice } from "./types";

export function useInvoices() {
  return useQuery<Invoice[]>({
    queryKey: ["invoices"],
    queryFn: () => api.get("/invoices"),
  });
}

export function useInvoice(id: string) {
  return useQuery<Invoice>({
    queryKey: ["invoices", id],
    queryFn: () => api.get(`/invoices/${id}`),
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: never) => api.post("/invoices", data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useUpdateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: string } & Record<string, never>) => {
      const { id, ...rest } = data;
      return api.put(`/invoices/${id}`, rest);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}

export function useDeleteInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/invoices/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] }),
  });
}

export function useMarkInvoicePaid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.post(`/invoices/${id}/mark-paid`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["receipts"] });
    },
  });
}
