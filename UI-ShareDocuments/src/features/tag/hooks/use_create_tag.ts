import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tagApi } from "../tag_api";

export function useCreateTag() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: tagApi.create,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["tags"] });
        },
    });
}