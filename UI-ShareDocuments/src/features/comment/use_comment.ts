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

export function useDocumentComments(documentId: number, params: CommentFilterParams) {
    return useQuery({
        queryKey: ["comments-document", documentId, params],
        queryFn: () => commentApi.getByDocument(documentId, params),
        enabled: !!documentId && !isNaN(documentId),
        placeholderData: (prev) => prev,
    });
}

export function useCreateComment(documentId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: commentApi.create,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["comments-document", documentId] });
        },
    });
}

export function useDeleteComment(documentId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: commentApi.delete,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["comments-document", documentId] });
        },
    });
}