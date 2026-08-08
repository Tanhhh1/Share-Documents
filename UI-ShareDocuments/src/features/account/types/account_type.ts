import type { PageListParams } from "@/common/types/page_list_type";

export interface AccountDto {
    id: number;
    userName: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string | null;
    roles: string[];
    isActive: boolean;
}

export interface AccountFilterParams extends PageListParams {
    search?: string;
    role?: string;
    isActive?: boolean;
}

export interface CreateAccountRequest {
    userName: string;
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;
}

export interface UpdateAccountRequest {
    id: number;
    userName: string;
    email: string;
    fullName: string;
    phoneNumber?: string;
}