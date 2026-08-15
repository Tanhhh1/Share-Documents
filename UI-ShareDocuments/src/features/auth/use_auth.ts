import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authApi } from "./auth_api";
import { setCredentials } from "./auth_slice";
import { decodeAccessToken } from "./jwt";
import type { AppDispatch } from "@/app/store/store";
import type { ResetPasswordRequest } from "./auth_type";
import { logout as logoutAction } from "./auth_slice";

export function useSignIn() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authApi.signIn,
        onSuccess: (data) => {
            if (!data.succeeded || !data.result) return;

            const user = decodeAccessToken(data.result.accessToken);
            dispatch(setCredentials({ accessToken: data.result.accessToken, user }));

            navigate(user.isAdmin || user.isModerator ? "/admin" : "/");
        },
    });
}

export function useSignUp() {
    return useMutation({
        mutationFn: authApi.signUp,
    });
}

export function useVerifyOtp() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authApi.verify,
        onSuccess: (data, variables) => {
            if (!data.succeeded || !data.result) return;
            navigate("/reset-password", { state: { email: variables.email, token: data.result } });
        },
    });
}

export function useResetPassword() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (payload: ResetPasswordRequest) => authApi.reset(payload),
        onSuccess: (data) => {
            if (!data.succeeded) return;
            navigate("/sign-in");
        },
    });
}

export function useLogout() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authApi.revoke,
        onSettled: () => {
            dispatch(logoutAction());
            navigate("/sign-in");
        },
    });
}

export function useForgotPassword() {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: authApi.forgot,
        onSuccess: (data, variables) => {
            if (!data.succeeded) return;
            navigate("/verify-otp", { state: { email: variables.email } });
        },
    });
}