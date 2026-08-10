import { useMutation, useQueryClient } from "@tanstack/react-query";
import { facultyApi } from "../faculty_api";

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