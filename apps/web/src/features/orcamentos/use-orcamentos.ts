
import { useQuery } from "@tanstack/react-query";
import { searchPriceBank } from "../../shared/api-client";
import { useEffect, useState } from "react";

export function usePriceBankSearch(query: string) {
    return useQuery({
        queryKey: ["price-bank-search", query],
        queryFn: () => searchPriceBank(query),
        enabled: query.length > 2,
        staleTime: 60000,
    });
}
