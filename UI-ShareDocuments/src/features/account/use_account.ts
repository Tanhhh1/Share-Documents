import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountApi } from "./account_api";
import type { AccountFilterParams } from "./account_type";
import type { UpdateAccountRequest } from "./account_type";

export function useAccounts(params: AccountFilterParams) {
    return useQuery({
        queryKey: ["accounts", params],
        queryFn: () => accountApi.getAll(params),
        placeholderData: keepPreviousData,
    });
}

export function useCreateAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: accountApi.create,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
    });
}

export function useLockAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => accountApi.lock(id),
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
    });
}

export function useUnlockAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => accountApi.unlock(id),
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
    });
}

export function useUpdateAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: UpdateAccountRequest) => accountApi.update(payload.id, payload),
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
    });
}