import type { PageListParams } from "@/common/types/page_list_type";

export interface ReportDto {
    id: number;
    documentId: number;
    documentTitle: string;
    userId: number;
    userName: string;
    reason: string;
    content: string;
    createdAt: string;
}

export interface ReportFilterParams extends PageListParams {
    keyword?: string;
}