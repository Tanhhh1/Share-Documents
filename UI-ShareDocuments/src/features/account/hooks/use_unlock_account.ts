import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountApi } from "../account_api";

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