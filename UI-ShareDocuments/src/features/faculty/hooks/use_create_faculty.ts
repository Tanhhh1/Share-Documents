import { useMutation, useQueryClient } from "@tanstack/react-query";
import { facultyApi } from "../faculty_api";

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