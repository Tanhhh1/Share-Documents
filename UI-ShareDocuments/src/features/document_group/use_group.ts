import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groupApi } from "./group_api";
import type { GroupFilterParams } from "./group_type";

export function useDocumentGroups(filters: GroupFilterParams) {
    return useQuery({
        queryKey: ["document-groups", filters],
        queryFn: () => groupApi.getAll(filters),
    });
}

export function useApproveGroup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: groupApi.approve,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["document-groups"] });
        },
    });
}

export function useRejectGroup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: groupApi.reject,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["document-groups"] });
        },
    });
}