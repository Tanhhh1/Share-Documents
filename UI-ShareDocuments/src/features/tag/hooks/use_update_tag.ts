import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tagApi } from "../tag_api";

export function useUpdateTag() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: tagApi.update,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["tags"] });
        },
    });
}