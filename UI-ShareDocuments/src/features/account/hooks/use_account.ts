import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { accountApi } from "../account_api";
import type { AccountFilterParams } from "../types/account_type";

export function useAccounts(params: AccountFilterParams) {
    return useQuery({
        queryKey: ["accounts", params],
        queryFn: () => accountApi.getAll(params),
        placeholderData: keepPreviousData,
    });
}