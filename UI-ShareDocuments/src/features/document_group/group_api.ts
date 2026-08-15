import { api } from "@/common/api/axios";
import { endpoints } from "@/common/api/endpoints";
import type { ApiResult } from "@/common/types/api_result_type";
import type { PageList } from "@/common/types/page_list_type";
import type { GroupDto, GroupFilterParams, RejectGroupRequest  } from "./group_type";

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
};