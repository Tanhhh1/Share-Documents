import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tagApi } from "../tag_api";

export function useDeleteTag() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: tagApi.delete,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["tags"] });
        },
    });
}