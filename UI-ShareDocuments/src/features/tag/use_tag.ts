import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tagApi } from "./tag_api";
import type { TagFilterParams } from "./tag_type";

export function useTags(filters: TagFilterParams) {
    return useQuery({
        queryKey: ["tags", filters],
        queryFn: () => tagApi.getAll(filters),
    });
}

export function useCreateTag() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: tagApi.create,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["tags"] });
        },
    });
}

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

export function useDeleteTag() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: tagApi.delete,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["tags"] });
        },
    });
}