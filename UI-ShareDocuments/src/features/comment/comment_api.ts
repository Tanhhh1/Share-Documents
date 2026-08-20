import { api } from "@/common/api/axios";
import { endpoints } from "@/common/api/endpoints";
import type { ApiResult } from "@/common/types/api_result_type";
import type { PageList } from "@/common/types/page_list_type";
import type { ListCommentDto, CommentDto, CommentFilterParams, CreateCommentRequest } from "./comment_type";

export const commentApi = {
    getAll: async (params: CommentFilterParams) => {
        const { data } = await api.get<ApiResult<PageList<ListCommentDto>>>(endpoints.comment.list, { params });
        return data;
    },

    hide: async (id: number) => {
        const { data } = await api.patch<ApiResult<boolean>>(endpoints.comment.hide(id));
        return data;
    },

    unhide: async (id: number) => {
        const { data } = await api.patch<ApiResult<boolean>>(endpoints.comment.unhide(id));
        return data;
    },

    getByDocument: async (documentId: number, params: CommentFilterParams) => {
        const { data } = await api.get<ApiResult<PageList<CommentDto>>>(endpoints.comment.byDocument(documentId), { params });
        return data;
    },

    create: async (payload: CreateCommentRequest) => {
        const { data } = await api.post<ApiResult<CommentDto>>(endpoints.comment.create, payload);
        return data;
    },

    delete: async (id: number) => {
        const { data } = await api.delete<ApiResult<boolean>>(endpoints.comment.delete(id));
        return data;
    },
};