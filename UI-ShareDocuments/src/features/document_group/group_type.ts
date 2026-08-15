import type { PageListParams } from "@/common/types/page_list_type";
import { DocumentStatus } from "@/common/constants/document_status";

export function documentStatusBadgeClass(status: DocumentStatus): string {
    switch (status) {
        case DocumentStatus.Published:
            return "badge badge-active";
        case DocumentStatus.Rejected:
            return "badge badge-locked";
        default:
            return "badge badge-pending";
    }
}

export interface GroupDto {
    id: number;
    title: string;
    description: string | null;
    userId: number;
    userName: string;
    status: DocumentStatus;
    isDeleted: boolean;
    createdAt: string;
    deletedAt: string | null;
}

export interface GroupFilterParams extends PageListParams {
    search?: string;
    status?: DocumentStatus;
    isDeleted?: boolean;
}

export interface RejectGroupRequest {
    id: number;
    reason: string;
}