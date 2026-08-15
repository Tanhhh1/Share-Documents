import { api } from "@/common/api/axios";
import { endpoints } from "@/common/api/endpoints";
import type { ApiResult } from "@/common/types/api_result_type";
import type { ProfileDto, UpdateInformationRequest, UpdatePasswordRequest } from "./profile_type";

export const profileApi = {
    getProfile: async () => {
        const { data } = await api.get<ApiResult<ProfileDto>>(endpoints.profile.get);
        return data;
    },

    updateInformation: async (payload: UpdateInformationRequest) => {
        const { data } = await api.put<ApiResult<ProfileDto>>(endpoints.profile.updateInfo, payload);
        return data;
    },

    updatePassword: async (payload: UpdatePasswordRequest) => {
        const { data } = await api.put<ApiResult<boolean>>(endpoints.profile.updatePassword, payload);
        return data;
    },
};