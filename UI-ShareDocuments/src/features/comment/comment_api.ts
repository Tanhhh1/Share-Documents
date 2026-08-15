import { api } from "@/common/api/axios";
import { endpoints } from "@/common/api/endpoints";
import type { ApiResult } from "@/common/types/api_result_type";
import type { PageList } from "@/common/types/page_list_type";
import type { ListCommentDto, CommentFilterParams } from "./comment_type";

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
};