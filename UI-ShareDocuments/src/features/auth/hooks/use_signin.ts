import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authApi } from "../auth_api";
import { setCredentials } from "../auth_slice";
import { decodeAccessToken } from "../utils/jwt";
import type { AppDispatch } from "@/app/store/store";

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