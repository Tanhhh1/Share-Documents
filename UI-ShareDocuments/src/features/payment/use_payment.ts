import { useMutation, useQuery } from "@tanstack/react-query";
import { paymentApi } from "./payment_api";

export const useCreatePayment = () => {
    return useMutation({
        mutationFn: paymentApi.createPayment,
    });
};

export const useCancelPayment = () => {
    return useMutation({
        mutationFn: paymentApi.cancelPayment,
    });
};

export const useGetCurrentMembership = () => {
    return useQuery({
        queryKey: ["current-membership"],
        queryFn: async () => {
            const res = await paymentApi.getCurrentMembership();
            return res.result;
        },
    });
};