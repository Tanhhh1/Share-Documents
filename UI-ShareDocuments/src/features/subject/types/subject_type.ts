import type { PageListParams } from "@/common/types/page_list_type";
import type { EducationLevel } from "@/common/constants/education_level";

export interface SubjectDto {
    id: number;
    educationLevel: EducationLevel;
    majorId: number | null;
    name: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface SubjectFilterParams extends PageListParams {
    educationLevel?: EducationLevel;
    majorId?: number;
    search?: string;
    isActive?: boolean;
}

export interface CreateSubjectRequest {
    educationLevel: EducationLevel;
    majorId?: number;
    name: string;
}

export interface UpdateSubjectRequest {
    id: number;
    educationLevel: EducationLevel;
    majorId?: number;
    name: string;
}