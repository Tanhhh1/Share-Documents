import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "./comment_api";
import type { CommentFilterParams } from "./comment_type";

export function useComments(filters: CommentFilterParams) {
    return useQuery({
        queryKey: ["comments", filters],
        queryFn: () => commentApi.getAll(filters),
    });
}

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