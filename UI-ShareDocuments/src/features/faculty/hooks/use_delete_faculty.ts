import { useMutation, useQueryClient } from "@tanstack/react-query";
import { facultyApi } from "../faculty_api";

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