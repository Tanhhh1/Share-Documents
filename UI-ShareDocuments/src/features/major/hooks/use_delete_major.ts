import { useMutation, useQueryClient } from "@tanstack/react-query";
import { majorApi } from "../major_api";

export function useDeleteMajor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: majorApi.delete,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["majors"] });
        },
    });
}