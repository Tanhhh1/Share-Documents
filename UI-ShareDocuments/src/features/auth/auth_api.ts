import { api } from "@/common/api/axios";
import { endpoints } from "@/common/api/endpoints";
import type { ApiResult } from "@/common/types/api_result_type";
import type { AuthTokenResponse, SignInRequest, SignUpRequest } from "./types/auth_type";

export const authApi = {
    signIn: async (payload: SignInRequest) => {
        const { data } = await api.post<ApiResult<AuthTokenResponse>>(endpoints.auth.signIn, payload);
        return data;
    },

    signUp: async (payload: SignUpRequest) => {
        const { data } = await api.post<ApiResult<boolean>>(endpoints.auth.signUp, payload);
        return data;
    },

    refresh: async () => {
        const { data } = await api.post<ApiResult<AuthTokenResponse>>(endpoints.auth.refresh);
        return data;
    },

    revoke: async () => {
        const { data } = await api.post<ApiResult<boolean>>(endpoints.auth.revoke);
        return data;
    },
};