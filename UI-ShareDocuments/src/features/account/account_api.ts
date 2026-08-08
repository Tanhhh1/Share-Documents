import { api } from "@/common/api/axios";
import { endpoints } from "@/common/api/endpoints";
import type { ApiResult } from "@/common/types/api_result_type";
import type { PageList } from "@/common/types/page_list_type";
import type { AccountDto, AccountFilterParams, CreateAccountRequest, UpdateAccountRequest } from "./types/account_type";

export const accountApi = {
    getAll: async (params: AccountFilterParams) => {
        const { data } = await api.get<ApiResult<PageList<AccountDto>>>(endpoints.account.list, { params });
        return data;
    },

    getById: async (id: number) => {
        const { data } = await api.get<ApiResult<AccountDto>>(endpoints.account.detail(id));
        return data;
    },

    create: async (payload: CreateAccountRequest) => {
        const { data } = await api.post<ApiResult<AccountDto>>(endpoints.account.create, payload);
        return data;
    },

    update: async (id: number, payload: UpdateAccountRequest) => {
        const { data } = await api.put<ApiResult<AccountDto>>(endpoints.account.update(id), payload);
        return data;
    },

    lock: async (id: number) => {
        const { data } = await api.patch<ApiResult<boolean>>(endpoints.account.lock(id));
        return data;
    },

    unlock: async (id: number) => {
        const { data } = await api.patch<ApiResult<boolean>>(endpoints.account.unlock(id));
        return data;
    },
};