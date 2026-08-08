import { useQuery } from "@tanstack/react-query";
import { commentApi } from "../comment_api";
import type { CommentFilterParams } from "../types/comment_type";

export function useComments(filters: CommentFilterParams) {
    return useQuery({
        queryKey: ["comments", filters],
        queryFn: () => commentApi.getAll(filters),
    });
}