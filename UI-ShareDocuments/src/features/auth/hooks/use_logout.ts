import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authApi } from "../auth_api";
import { logout as logoutAction } from "../auth_slice";
import type { AppDispatch } from "@/app/store/store";

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