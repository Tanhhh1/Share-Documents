import type { PageListParams } from "@/common/types/page_list_type";

export interface BookmarkDto {
    id: number;
    documentId: number;
    documentTitle: string;
    documentDescription?: string;
    thumbnailUrl?: string;
    createdAt: string;
}

export interface BookmarkFilterParams extends PageListParams {}