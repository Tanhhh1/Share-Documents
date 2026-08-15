import type { PageListParams } from "@/common/types/page_list_type";

export interface TagDto {
    id: number;
    name: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface TagFilterParams extends PageListParams {
    search?: string;
    isDeleted?: boolean;
}

export interface CreateTagRequest {
    name: string;
}

export interface UpdateTagRequest {
    id: number;
    name: string;
}