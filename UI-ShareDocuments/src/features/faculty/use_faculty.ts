import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { facultyApi } from "./faculty_api";
import type { FacultyFilterParams } from "./faculty_type";

export function useFaculties(filters: FacultyFilterParams) {
    return useQuery({
        queryKey: ["faculties", filters],
        queryFn: () => facultyApi.getAll(filters),
    });
}

export function useCreateFaculty() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: facultyApi.create,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["faculties"] });
        },
    });
}

export function useUpdateFaculty() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: facultyApi.update,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["faculties"] });
        },
    });
}

export function useDeleteFaculty() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: facultyApi.delete,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["faculties"] });
        },
    });
}

export function useRestoreFaculty() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: facultyApi.restore,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["faculties"] });
        },
    });
}