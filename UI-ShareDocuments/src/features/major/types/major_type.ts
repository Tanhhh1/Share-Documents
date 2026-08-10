import type { PageListParams } from "@/common/types/page_list_type";

export interface MajorDto {
    id: number;
    facultyId: number;
    name: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface MajorFilterParams extends PageListParams {
    facultyId?: number;
    search?: string;
    isActive?: boolean;
}

export interface CreateMajorRequest {
    facultyId: number;
    name: string;
}

export interface UpdateMajorRequest {
    id: number;
    facultyId: number;
    name: string;
}