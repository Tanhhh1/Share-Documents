import { api } from "@/common/api/axios";
import { endpoints } from "@/common/api/endpoints";
import type { ApiResult } from "@/common/types/api_result_type";
import type { CreatePaymentRequest, CancelPaymentRequest, PaymentResultDto, MembershipDto } from "./payment_type";

export const paymentApi = {
    createPayment: async (payload: CreatePaymentRequest) => {
        const { data } = await api.post<ApiResult<PaymentResultDto>>(
            endpoints.payment.create,
            payload
        );
        return data;
    },

    cancelPayment: async (payload: CancelPaymentRequest) => {
        const { data } = await api.post<ApiResult<boolean>>(
            endpoints.payment.cancel,
            payload
        );
        return data;
    },

    getCurrentMembership: async () => {
        const { data } = await api.get<ApiResult<MembershipDto | null>>(
            endpoints.membership.getCurrent
        );
        return data;
    },
};