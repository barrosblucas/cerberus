import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { searchPriceBank } from "../../shared/api-client";

export function usePriceBankSearch(query: string) {
  return useQuery({
    queryKey: ["price-bank-search", query],
    queryFn: () => searchPriceBank(query),
    enabled: query.length > 2,
    staleTime: 60000,
  });
}
