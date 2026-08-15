export const DocumentStatus = {
    Pending: "Pending",
    Published: "Published",
    Rejected: "Rejected",
} as const;

export type DocumentStatus = (typeof DocumentStatus)[keyof typeof DocumentStatus];

export const DOCUMENT_STATUS_LABEL: Record<DocumentStatus, string> = {
    Pending: "Đang chờ",
    Published: "Đã xuất bản",
    Rejected: "Bị từ chối",
};

export const DOCUMENT_STATUSES: DocumentStatus[] = [
    DocumentStatus.Pending,
    DocumentStatus.Published,
    DocumentStatus.Rejected,
];

