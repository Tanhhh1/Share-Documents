import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookmarkApi } from "./bookmark_api";
import type { BookmarkFilterParams } from "./bookmark_type";

export function useMyBookmarks(params: BookmarkFilterParams) {
    return useQuery({
        queryKey: ["bookmarks", params],
        queryFn: () => bookmarkApi.getMy(params),
    });
}

export function useBookmarkStatus(documentId: number) {
    const { data, isLoading } = useQuery({
        queryKey: ["bookmarks", "all"],
        queryFn: () => bookmarkApi.getMy({ pageIndex: 1, pageSize: 1000 }),
        enabled: !!documentId && !isNaN(documentId),
        staleTime: 0, 
    });

    const isBookmarked = !!data?.result?.items.some((b) => b.documentId === documentId);
    return { isBookmarked, isLoading };
}

export function useToggleBookmark(documentId: number, isBookmarked: boolean) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => (isBookmarked ? bookmarkApi.delete(documentId) : bookmarkApi.save(documentId)),
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
        },
    });
}

export function useDeleteBookmark() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (documentId: number) => bookmarkApi.delete(documentId),
        onSuccess: (data) => {
            if (!data.succeeded) return;
            queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
        },
    });
}