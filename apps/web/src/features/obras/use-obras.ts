import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createObra, deleteObra, getObra, listObras, updateObra } from "../../shared/api-client";

export function useObras() {
  return useQuery({
    queryKey: ["obras"],
    queryFn: listObras,
  });
}

export function useObra(id: string) {
  return useQuery({
    queryKey: ["obras", id],
    queryFn: () => getObra(id),
    enabled: !!id,
  });
}

export function useCreateObra() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createObra,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obras"] });
    },
  });
}

export function useUpdateObra(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: unknown) => updateObra(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obras"] });
      queryClient.invalidateQueries({ queryKey: ["obras", id] });
    },
  });
}

export function useDeleteObra() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteObra,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["obras"] });
    },
  });
}
