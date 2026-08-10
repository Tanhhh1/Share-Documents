import { useMutation, useQueryClient } from "@tanstack/react-query";
import { majorApi } from "../major_api";

export function useCreateMajor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: majorApi.create,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["majors"] });
        },
    });
}