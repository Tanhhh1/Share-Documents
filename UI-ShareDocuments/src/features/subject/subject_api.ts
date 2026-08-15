import { api } from "@/common/api/axios";
import { endpoints } from "@/common/api/endpoints";
import type { ApiResult } from "@/common/types/api_result_type";
import type { PageList } from "@/common/types/page_list_type";
import type { SubjectDto, SubjectFilterParams, CreateSubjectRequest, UpdateSubjectRequest } from "./subject_type";

export const subjectApi = {
    getAll: async (params: SubjectFilterParams) => {
        const { data } = await api.get<ApiResult<PageList<SubjectDto>>>(endpoints.subject.list, { params });
        return data;
    },

    getById: async (id: number) => {
        const { data } = await api.get<ApiResult<SubjectDto>>(endpoints.subject.detail(id));
        return data;
    },

    create: async (payload: CreateSubjectRequest) => {
        const { data } = await api.post<ApiResult<SubjectDto>>(endpoints.subject.create, payload);
        return data;
    },

    update: async (payload: UpdateSubjectRequest) => {
        const { data } = await api.put<ApiResult<SubjectDto>>(endpoints.subject.update(payload.id), payload);
        return data;
    },

    delete: async (id: number) => {
        const { data } = await api.patch<ApiResult<SubjectDto>>(endpoints.subject.delete(id));
        return data;
    },

    restore: async (id: number) => {
        const { data } = await api.patch<ApiResult<SubjectDto>>(endpoints.subject.restore(id));
        return data;
    },
};