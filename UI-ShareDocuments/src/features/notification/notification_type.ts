// TODO: điền đúng giá trị theo Domain.Enums.NotificationType và Domain.Enums.EntityType ở BE
export const NotificationType = {
    Comment: 0,
    Reply: 1,
    DocumentApproved: 2,
    DocumentRejected: 3,
    // ... bổ sung theo enum thật ở BE
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

export const EntityType = {
    Document: 0,
    DocumentGroup: 1,
    Comment: 2,
} as const;
export type EntityType = (typeof EntityType)[keyof typeof EntityType];

export interface NotificationDto {
    id: number;
    type: NotificationType;
    title: string;
    content: string;
    relatedEntityType: EntityType;
    relatedEntityId: number;
    isRead: boolean;
    createdAt: string;
}

export interface GetNotificationsParams {
    pageIndex: number;
    pageSize: number;
    isRead?: boolean;
}