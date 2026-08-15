export interface ProfileDto {
    id: number;
    userName: string;
    email: string;
    fullName: string;
    phoneNumber?: string | null;
    updatedAt: string;
}

export interface UpdateInformationRequest {
    fullName: string;
    email: string;
    phoneNumber?: string;
}

export interface UpdatePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}