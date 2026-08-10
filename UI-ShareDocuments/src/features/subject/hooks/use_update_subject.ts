import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectApi } from "../subject_api";

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