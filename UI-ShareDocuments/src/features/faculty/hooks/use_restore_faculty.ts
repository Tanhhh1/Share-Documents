import { useMutation, useQueryClient } from "@tanstack/react-query";
import { facultyApi } from "../faculty_api";

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