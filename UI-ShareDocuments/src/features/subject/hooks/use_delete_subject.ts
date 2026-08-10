import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectApi } from "../subject_api";

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