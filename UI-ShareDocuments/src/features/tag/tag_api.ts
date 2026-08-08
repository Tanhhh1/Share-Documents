import { api } from "@/common/api/axios";
import { endpoints } from "@/common/api/endpoints";
import type { ApiResult } from "@/common/types/api_result_type";
import type { PageList } from "@/common/types/page_list_type";
import type { TagDto, TagFilterParams, CreateTagRequest, UpdateTagRequest } from "./types/tag_type";

export const tagApi = {
    getAll: async (params: TagFilterParams) => {
        const { data } = await api.get<ApiResult<PageList<TagDto>>>(endpoints.tag.list, { params });
        return data;
    },

    getById: async (id: number) => {
        const { data } = await api.get<ApiResult<TagDto>>(endpoints.tag.detail(id));
        return data;
    },

    create: async (payload: CreateTagRequest) => {
        const { data } = await api.post<ApiResult<TagDto>>(endpoints.tag.create, payload);
        return data;
    },

    update: async (payload: UpdateTagRequest) => {
        const { data } = await api.put<ApiResult<TagDto>>(endpoints.tag.update(payload.id), payload);
        return data;
    },

    delete: async (id: number) => {
        const { data } = await api.patch<ApiResult<TagDto>>(endpoints.tag.delete(id));
        return data;
    },

    restore: async (id: number) => {
        const { data } = await api.patch<ApiResult<TagDto>>(endpoints.tag.restore(id));
        return data;
    },
};