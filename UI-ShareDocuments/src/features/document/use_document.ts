import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { documentApi } from "./document_api";
import type { DocumentFilterParams, PublishedDocumentFilterParams } from "./document_type";

export function useDocuments(filters: DocumentFilterParams) {
    return useQuery({
        queryKey: ["documents", filters],
        queryFn: () => documentApi.getAll(filters),
    });
}

export function useDocumentDetail(id: number) {
    return useQuery({
        queryKey: ["document", id],
        queryFn: () => documentApi.getById(id),
        enabled: !!id && !isNaN(id),
    });
}

export function useCreateDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: documentApi.create,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["documents"] });
        },
    });
}

export function useDownloadDocument() {
    return useMutation({
        mutationFn: (id: number) => documentApi.download(id),
    });
}

export function useDocumentPreview(id: number) {
    return useQuery({
        queryKey: ["document-preview", id],
        queryFn: () => documentApi.getPreview(id),
        enabled: !!id && !isNaN(id),
        staleTime: 5 * 60 * 1000,
    });
}

export function useApproveDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: documentApi.approve,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["documents"] });
        },
    });
}

export function useRejectDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: documentApi.reject,
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["documents"] });
        },
    });
}

export function useMyDocuments(filters: DocumentFilterParams) {
    return useQuery({
        queryKey: ["my-documents", filters],
        queryFn: () => documentApi.getMy(filters),
    });
}

export function useDeleteDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: documentApi.delete,
        onSuccess: (data, id) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["my-documents"] });
            queryClient.invalidateQueries({ queryKey: ["document", id] });
        },
    });
}

export function useRestoreDocument() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: documentApi.restore,
        onSuccess: (data, id) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["my-documents"] });
            queryClient.invalidateQueries({ queryKey: ["document", id] });
        },
    });
}

export function usePublishedDocuments(filters: PublishedDocumentFilterParams) {
    return useQuery({
        queryKey: ["documents-published", filters],
        queryFn: () => documentApi.getPublished(filters),
        placeholderData: (prev) => prev,
    });
}

export function useUpdateDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: documentApi.update,
        onSuccess: (data, variables) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["documents"] });
            queryClient.invalidateQueries({ queryKey: ["my-documents"] });
            queryClient.invalidateQueries({ queryKey: ["document", variables.id] });
        },
    });
}