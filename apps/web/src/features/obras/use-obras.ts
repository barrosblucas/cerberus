import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createObra, getObra, listObras } from "../../shared/api-client";

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
