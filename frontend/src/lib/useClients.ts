import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import type { Client } from "./types";

export function useClients() {
  return useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: () => api.get("/clients"),
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Client, "id" | "createdAt">) => api.post("/clients", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Client) => api.put(`/clients/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/clients/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}
