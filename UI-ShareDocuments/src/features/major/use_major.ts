import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { majorApi } from "./major_api";
import type { MajorFilterParams } from "./major_type";

export function useMajors(filters: MajorFilterParams) {
    return useQuery({
        queryKey: ["majors", filters],
        queryFn: () => majorApi.getAll(filters),
    });
}

export function useCreateMajor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: majorApi.create,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["majors"] });
        },
    });
}

export function useUpdateMajor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: majorApi.update,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["majors"] });
        },
    });
}

export function useDeleteMajor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: majorApi.delete,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["majors"] });
        },
    });
}

export function useRestoreMajor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: majorApi.restore,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["majors"] });
        },
    });
}