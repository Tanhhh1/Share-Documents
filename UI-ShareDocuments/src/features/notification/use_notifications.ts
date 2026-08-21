import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getNotifications, markNotificationAsRead } from "./notification_api";
import type { GetNotificationsParams } from "./notification_type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useNotifications = (params: GetNotificationsParams) => {
    return useQuery({
        queryKey: ["notifications", params],
        queryFn: () => getNotifications(params),
        placeholderData: keepPreviousData,
    });
};

export const useMarkNotificationAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => markNotificationAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
};