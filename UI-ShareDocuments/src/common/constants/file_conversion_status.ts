export const FileConversionStatus = {
    Pending: "Pending",
    Completed: "Completed",
    Failed: "Failed",
} as const;

export type FileConversionStatus = (typeof FileConversionStatus)[keyof typeof FileConversionStatus];

export const FILE_CONVERSION_STATUS_LABEL: Record<FileConversionStatus, string> = {
    Pending: "Đang xử lý",
    Completed: "Đã xử lý",
    Failed: "Xử lý thất bại",
};

export const FILE_CONVERSION_STATUSES: FileConversionStatus[] = [
    FileConversionStatus.Pending,
    FileConversionStatus.Completed,
    FileConversionStatus.Failed,
];

export function isCompletedStatus(status: FileConversionStatus): boolean {
    return status === FileConversionStatus.Completed;
}