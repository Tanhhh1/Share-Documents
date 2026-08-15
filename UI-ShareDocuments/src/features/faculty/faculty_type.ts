import type { PageListParams } from "@/common/types/page_list_type";

export interface FacultyDto {
    id: number;
    name: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface FacultyFilterParams extends PageListParams {
    search?: string;
    isActive?: boolean;
}

export interface CreateFacultyRequest {
    name: string;
}

export interface UpdateFacultyRequest {
    id: number;
    name: string;
}