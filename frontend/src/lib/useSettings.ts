import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import type { AppSettings } from "./types";

export function useSettings() {
  return useQuery<AppSettings>({
    queryKey: ["settings"],
    queryFn: () => api.get("/settings"),
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AppSettings>) => api.put("/settings", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
}
