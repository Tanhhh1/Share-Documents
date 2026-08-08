import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { api } from "./axios";
import { store } from "@/app/store/store";
import { endpoints } from "./endpoints";
import { refreshToken } from "@/features/auth/refresh_manager";
import type { ApiResult } from "@/common/types/api_result_type";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

api.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError<ApiResult<unknown>>) => {
        const status = error.response?.status;
        const data = error.response?.data;
        const originalRequest = error.config as RetryableRequestConfig | undefined;

        if ((status === 400 || status === 422) && data && typeof data.succeeded === "boolean") {
            return Promise.resolve({ ...error.response, data });
        }

        const isRefreshCall = originalRequest?.url === endpoints.auth.refresh;

        if (status === 401 && originalRequest && !originalRequest._retry && !isRefreshCall) {
            originalRequest._retry = true;

            const newToken = await refreshToken();
            if (!newToken) {
                window.location.href = "/sign-in";
                return Promise.reject(error);
            }

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
        }

        if (status === 401 && isRefreshCall) {
            window.location.href = "/sign-in";
            return Promise.reject(error);
        }

        if (status === 403) {
            if (data && typeof data.succeeded === "boolean") {
                return Promise.resolve({ ...error.response, data });
            }
            window.location.href = "/403";
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);