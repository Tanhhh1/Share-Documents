import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectApi } from "../subject_api";

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