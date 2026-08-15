import { api } from "@/common/api/axios";
import { endpoints } from "@/common/api/endpoints";
import type { ApiResult } from "@/common/types/api_result_type";
import type { PageList } from "@/common/types/page_list_type";
import type { FacultyDto, FacultyFilterParams, CreateFacultyRequest, UpdateFacultyRequest } from "./faculty_type";

export const facultyApi = {
    getAll: async (params: FacultyFilterParams) => {
        const { data } = await api.get<ApiResult<PageList<FacultyDto>>>(endpoints.faculty.list, { params });
        return data;
    },

    getById: async (id: number) => {
        const { data } = await api.get<ApiResult<FacultyDto>>(endpoints.faculty.detail(id));
        return data;
    },

    create: async (payload: CreateFacultyRequest) => {
        const { data } = await api.post<ApiResult<FacultyDto>>(endpoints.faculty.create, payload);
        return data;
    },

    update: async (payload: UpdateFacultyRequest) => {
        const { data } = await api.put<ApiResult<FacultyDto>>(endpoints.faculty.update(payload.id), payload);
        return data;
    },

    delete: async (id: number) => {
        const { data } = await api.patch<ApiResult<FacultyDto>>(endpoints.faculty.delete(id));
        return data;
    },

    restore: async (id: number) => {
        const { data } = await api.patch<ApiResult<FacultyDto>>(endpoints.faculty.restore(id));
        return data;
    },
};