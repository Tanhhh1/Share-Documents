import type { PageListParams } from "@/common/types/page_list_type";

export interface ListCommentDto {
    id: number;
    documentId: number;
    documentTitle: string;
    userId: number;
    userName: string;
    parentCommentId: number | null;
    content: string;
    isDeleted: boolean;
    createdAt: string;
}

export interface CommentFilterParams extends PageListParams {
    keyword?: string;
    userId?: number;
    isDeleted?: boolean;
    fromDate?: string; 
    toDate?: string;
}