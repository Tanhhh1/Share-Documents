import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tagApi } from "../tag_api";

export function useRestoreTag() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: tagApi.restore,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["tags"] });
        },
    });
}