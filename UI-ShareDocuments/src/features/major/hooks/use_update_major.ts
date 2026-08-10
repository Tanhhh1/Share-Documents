import { useMutation, useQueryClient } from "@tanstack/react-query";
import { majorApi } from "../major_api";

export function useUpdateMajor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: majorApi.update,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["majors"] });
        },
    });
}