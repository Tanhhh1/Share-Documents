export type MembershipPlan = "Monthly" | "Yearly";

export interface CreatePaymentRequest {
    plan: MembershipPlan;
}

export interface CancelPaymentRequest {
    orderCode: number;
}

export interface PaymentResultDto {
    orderCode: number;
    checkoutUrl: string;
}

export interface MembershipPlanOption {
    plan: MembershipPlan;
    title: string;
    price: number;
    period: string;
    description: string;
    highlighted?: boolean;
}

export interface MembershipDto {
    id: number;
    planCode: string;
    price: number;
    startDate: string;
    endDate: string;
    status: string;
    isActive: boolean;
    daysRemaining: number;
}

export const MEMBERSHIP_PLANS: MembershipPlanOption[] = [
    {
        plan: "Monthly",
        title: "Gói Tháng",
        price: 49000,
        period: "/ tháng",
        description: "Phù hợp nếu bạn muốn dùng thử các tính năng Premium.",
    },
    {
        plan: "Yearly",
        title: "Gói Năm",
        price: 499000,
        period: "/ năm",
        description: "Tiết kiệm hơn so với đăng ký theo tháng.",
        highlighted: true,
    },
];