import { api } from "@/common/api/axios";
import { endpoints } from "@/common/api/endpoints";
import type { ApiResult } from "@/common/types/api_result_type";
import type { PageList } from "@/common/types/page_list_type";
import type { GetNotificationsParams, NotificationDto } from "./notification_type";

export const getNotifications = async (params: GetNotificationsParams) => {
    const { data } = await api.get<ApiResult<PageList<NotificationDto>>>(
        endpoints.notification.list,
        { params }
    );
    return data;
};

export const markNotificationAsRead = async (id: number) => {
    const { data } = await api.patch<ApiResult<boolean>>(
        endpoints.notification.markAsRead(id)
    );
    return data;
};