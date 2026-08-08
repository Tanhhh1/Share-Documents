import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "../comment_api";

export function useUnhideComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: commentApi.unhide,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["comments"] });
        },
    });
}