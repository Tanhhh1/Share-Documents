import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectApi } from "../subject_api";

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