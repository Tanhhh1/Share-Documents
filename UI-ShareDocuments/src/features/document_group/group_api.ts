import { api } from "@/common/api/axios";
import { endpoints } from "@/common/api/endpoints";
import type { ApiResult } from "@/common/types/api_result_type";
import type { PageList } from "@/common/types/page_list_type";
import type { GroupDto, GroupFilterParams, GetPublishedGroupParams, RejectGroupRequest, CreateGroupRequest, UpdateGroupRequest } from "./group_type";

export const groupApi = {
    getAll: async (params: GroupFilterParams) => {
        const { data } = await api.get<ApiResult<PageList<GroupDto>>>(endpoints.group.list, { params });
        return data;
    },

    approve: async (id: number) => {
        const { data } = await api.post<ApiResult<GroupDto>>(endpoints.group.approve(id));
        return data;
    },

    reject: async (payload: RejectGroupRequest) => {
        const { data } = await api.post<ApiResult<GroupDto>>(endpoints.group.reject(payload.id), payload);
        return data;
    },

    getMyGroups: async (params: GroupFilterParams) => {
        const { data } = await api.get<ApiResult<PageList<GroupDto>>>(endpoints.group.myGroup, { params });
        return data;
    },

    getPublished: async (params: GetPublishedGroupParams) => {
        const { data } = await api.get<ApiResult<PageList<GroupDto>>>(endpoints.group.published, { params });
        return data;
    },

    create: async (payload: CreateGroupRequest) => {
        const { data } = await api.post<ApiResult<GroupDto>>(endpoints.group.create, payload);
        return data;
    },

    update: async (payload: UpdateGroupRequest) => {
        const { data } = await api.put<ApiResult<GroupDto>>(endpoints.group.update(payload.id), payload);
        return data;
    },

    delete: async (id: number) => {
        const { data } = await api.delete<ApiResult<GroupDto>>(endpoints.group.delete(id));
        return data;
    },

    restore: async (id: number) => {
        const { data } = await api.post<ApiResult<GroupDto>>(endpoints.group.restore(id));
        return data;
    },
};