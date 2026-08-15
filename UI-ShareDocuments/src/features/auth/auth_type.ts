export interface SignInRequest {
    username: string;
    password: string;
}

export interface SignUpRequest {
    userName: string;
    email: string;
    password: string;
    fullName: string;
}

export interface AuthTokenResponse {
    accessToken: string;
    accessTokenExpires: string;
}

export type UserRole = "Admin" | "Moderator" | "User";

export interface JwtPayload {
    sub: string;
    jti: string;
    unique_name: string;
    name: string;
    role: string | string[];
    exp: number;
    iss?: string;
    aud?: string;
}

export interface CurrentUser {
    id: number;
    username: string;
    fullName: string;
    roles: UserRole[];
    isAdmin: boolean;
    isModerator: boolean;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface VerifyOtpRequest {
    email: string;
    otp: string;
}

export interface ResetPasswordRequest {
    email: string;
    token: string;
    newPassword: string;
    confirmPassword: string;
}