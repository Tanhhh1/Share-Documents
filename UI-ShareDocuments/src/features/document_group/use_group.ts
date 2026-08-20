import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groupApi } from "./group_api";
import type { GroupFilterParams, GetPublishedGroupParams, CreateGroupRequest, UpdateGroupRequest } from "./group_type";

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

export function useMyDocumentGroups(filters: GroupFilterParams) {
    return useQuery({
        queryKey: ["my-document-groups", filters],
        queryFn: () => groupApi.getMyGroups(filters),
    });
}

export function usePublishedDocumentGroups(filters: GetPublishedGroupParams) {
    return useQuery({
        queryKey: ["published-document-groups", filters],
        queryFn: () => groupApi.getPublished(filters),
    });
}

export function useCreateGroup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateGroupRequest) => groupApi.create(payload),
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["my-document-groups"] });
        },
    });
}

export function useUpdateGroup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdateGroupRequest) => groupApi.update(payload),
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["my-document-groups"] });
        },
    });
}

export function useDeleteGroup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => groupApi.delete(id),
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["my-document-groups"] });
        },
    });
}

export function useRestoreGroup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => groupApi.restore(id),
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["my-document-groups"] });
        },
    });
}