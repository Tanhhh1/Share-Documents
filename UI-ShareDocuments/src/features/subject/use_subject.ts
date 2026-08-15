import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectApi } from "./subject_api";
import type { SubjectFilterParams } from "./subject_type";

export function useSubjects(filters: SubjectFilterParams) {
    return useQuery({
        queryKey: ["subjects", filters],
        queryFn: () => subjectApi.getAll(filters),
    });
}

export function useCreateSubject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: subjectApi.create,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
        },
    });
}

export function useUpdateSubject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: subjectApi.update,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
        },
    });
}

export function useDeleteSubject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: subjectApi.delete,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
        },
    });
}

export function useRestoreSubject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: subjectApi.restore,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["subjects"] });
        },
    });
}