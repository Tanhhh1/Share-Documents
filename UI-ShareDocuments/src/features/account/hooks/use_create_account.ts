import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountApi } from "../account_api";

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