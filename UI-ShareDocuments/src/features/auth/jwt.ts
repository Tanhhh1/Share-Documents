import { jwtDecode } from "jwt-decode";
import type { CurrentUser, JwtPayload, UserRole } from "./auth_type";

export function decodeAccessToken(accessToken: string): CurrentUser {
    const payload = jwtDecode<JwtPayload>(accessToken);

    const rawRoles = payload.role;
    const roles = (Array.isArray(rawRoles) ? rawRoles : rawRoles ? [rawRoles] : []) as UserRole[];

    return {
        id: Number(payload.sub),
        username: payload.unique_name,
        fullName: payload.name,
        roles,
        isAdmin: roles.includes("Admin"),
        isModerator: roles.includes("Moderator"),
    };
}

export function isTokenExpired(accessToken: string): boolean {
    try {
        const { exp } = jwtDecode<JwtPayload>(accessToken);
        return Date.now() >= exp * 1000;
    } catch {
        return true;
    }
}