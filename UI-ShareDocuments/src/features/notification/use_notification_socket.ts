import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { HubConnectionBuilder, LogLevel, type HubConnection } from "@microsoft/signalr";
import { toast } from "sonner";
import { store } from "@/app/store/store";
import { env } from "@/config/env";
import type { RootState } from "@/app/store/store";
import type { NotificationDto } from "./notification_type";

export const useNotificationSocket = () => {
    const queryClient = useQueryClient();
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    const userId = useSelector((state: RootState) => state.auth.user?.id);
    const connectionRef = useRef<HubConnection | null>(null);

    useEffect(() => {
        if (!accessToken || !userId) return;

        const connection = new HubConnectionBuilder()
            .withUrl(env.signalRUrl, {
                accessTokenFactory: () => store.getState().auth.accessToken ?? "",
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Warning)
            .build();

        connection.on("ReceiveNotification", (notification: NotificationDto) => {
            toast(notification.title, {
                description: notification.content,
                duration: 5000,
            });

            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        });

        connection.start().catch((err) => {
            console.error("SignalR connection error:", err);
        });

        connectionRef.current = connection;

        return () => {
            connection.stop();
        };
    }, [accessToken, userId, queryClient]);
};