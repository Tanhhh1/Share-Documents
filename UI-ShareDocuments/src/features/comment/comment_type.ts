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
    createdDate?: string;
}

export interface CommentDto {
    id: number;
    documentId: number;
    parentCommentId: number | null;
    userId: number;
    userName: string;
    content: string;
    isDeleted: boolean;
    createdAt: string;
    replies: CommentDto[];
}

export interface CommentFilterParams extends PageListParams {}

export interface CreateCommentRequest {
    documentId: number;
    parentCommentId?: number;
    content: string;
}