import { useState } from "react";
import { Pagination } from "@/common/components/pagination";
import { useNotifications } from "@/features/notification/use_notifications";
import { useMarkNotificationAsRead } from "@/features/notification/use_notifications";
import type { GetNotificationsParams, NotificationDto } from "@/features/notification/notification_type";
import "@/styles/notification.css";

const DEFAULT_FILTERS: GetNotificationsParams = {
    pageIndex: 1,
    pageSize: 10,
};

export default function NotificationsPage() {
    const [filters, setFilters] = useState<GetNotificationsParams>(DEFAULT_FILTERS);

    const { data, isLoading, isError } = useNotifications(filters);
    const markAsRead = useMarkNotificationAsRead();
    const pageData = data?.result;

    const handleItemClick = (notification: NotificationDto) => {
        if (!notification.isRead) {
            markAsRead.mutate(notification.id);
        }
    };

    return (
        <div className="client-page">
            <div className="client-page-header">
                <h2>Thông báo</h2>
                <p>Danh sách các thông báo liên quan đến hoạt động của bạn</p>
            </div>

            {isLoading && <p className="card-empty">Đang tải thông báo...</p>}

            {isError && <p className="card-empty">Không thể tải danh sách thông báo. Vui lòng thử lại.</p>}

            <div className="notification-list">
                {pageData?.items.map((item) => (
                    <div
                        key={item.id}
                        className={`notification-item ${item.isRead ? "" : "notification-item--unread"}`}
                        onClick={() => handleItemClick(item)}
                    >
                        <div className="notification-item-title">{item.title}</div>
                        <div className="notification-item-content">{item.content}</div>
                        <div className="notification-item-time">
                            {new Date(item.createdAt).toLocaleString("vi-VN")}
                        </div>
                    </div>
                ))}
                {!isLoading && (!pageData?.items || pageData.items.length === 0) && (
                    <p className="card-empty">Bạn chưa có thông báo nào</p>
                )}
            </div>

            {pageData && (
                <Pagination
                    pageIndex={pageData.pageIndex}
                    totalPages={pageData.totalPages}
                    hasPrevious={pageData.hasPrevious}
                    hasNext={pageData.hasNext}
                    onPageChange={(pageIndex) => setFilters((prev) => ({ ...prev, pageIndex }))}
                />
            )}
        </div>
    );
}