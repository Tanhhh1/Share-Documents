import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "../comment_api";

export function useHideComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: commentApi.hide,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["comments"] });
        },
    });
}