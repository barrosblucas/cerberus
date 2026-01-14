import { useQuery } from "@tanstack/react-query";
import { listOrcamentosByObra, searchPriceBank } from "../../shared/api-client";

export function usePriceBankSearch(query: string) {
  return useQuery({
    queryKey: ["price-bank-search", query],
    queryFn: () => searchPriceBank(query),
    enabled: query.length > 2,
    staleTime: 60000,
  });
}

export function useOrcamentosByObra(obraId: string) {
  return useQuery({
    queryKey: ["orcamentos", "obra", obraId],
    queryFn: () => listOrcamentosByObra(obraId),
    enabled: !!obraId,
  });
}
