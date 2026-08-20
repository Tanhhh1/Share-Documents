import { api } from "@/common/api/axios";
import { endpoints } from "@/common/api/endpoints";
import type { ApiResult } from "@/common/types/api_result_type";
import type { PageList } from "@/common/types/page_list_type";
import type { BookmarkDto, BookmarkFilterParams } from "./bookmark_type";

export const bookmarkApi = {
    getMy: async (params: BookmarkFilterParams) => {
        const { data } = await api.get<ApiResult<PageList<BookmarkDto>>>(endpoints.bookmark.list, { params });
        return data;
    },

    save: async (documentId: number) => {
        const { data } = await api.post<ApiResult<boolean>>(endpoints.bookmark.save, { documentId });
        return data;
    },

    delete: async (documentId: number) => {
        const { data } = await api.delete<ApiResult<boolean>>(endpoints.bookmark.delete(documentId));
        return data;
    },
};