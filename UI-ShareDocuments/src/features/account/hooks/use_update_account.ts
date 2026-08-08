import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountApi } from "../account_api";
import type { UpdateAccountRequest } from "../types/account_type";

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