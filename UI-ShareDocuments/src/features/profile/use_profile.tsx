import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "./profile_api";

export function useProfile() {
    return useQuery({
        queryKey: ["profile"],
        queryFn: profileApi.getProfile,
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: profileApi.updatePassword,
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: profileApi.updateInformation,
        onSuccess: (data) => {
            if (!data.succeeded) return;

            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
}