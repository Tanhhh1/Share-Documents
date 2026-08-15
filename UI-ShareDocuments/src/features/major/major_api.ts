import { api } from "@/common/api/axios";
import { endpoints } from "@/common/api/endpoints";
import type { ApiResult } from "@/common/types/api_result_type";
import type { PageList } from "@/common/types/page_list_type";
import type { MajorDto, MajorFilterParams, CreateMajorRequest, UpdateMajorRequest } from "./major_type";

export const majorApi = {
    getAll: async (params: MajorFilterParams) => {
        const { data } = await api.get<ApiResult<PageList<MajorDto>>>(endpoints.major.list, { params });
        return data;
    },

    getById: async (id: number) => {
        const { data } = await api.get<ApiResult<MajorDto>>(endpoints.major.detail(id));
        return data;
    },

    create: async (payload: CreateMajorRequest) => {
        const { data } = await api.post<ApiResult<MajorDto>>(endpoints.major.create, payload);
        return data;
    },

    update: async (payload: UpdateMajorRequest) => {
        const { data } = await api.put<ApiResult<MajorDto>>(endpoints.major.update(payload.id), payload);
        return data;
    },

    delete: async (id: number) => {
        const { data } = await api.patch<ApiResult<MajorDto>>(endpoints.major.delete(id));
        return data;
    },

    restore: async (id: number) => {
        const { data } = await api.patch<ApiResult<MajorDto>>(endpoints.major.restore(id));
        return data;
    },
};