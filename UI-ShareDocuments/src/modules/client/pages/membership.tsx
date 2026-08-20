import { useState } from "react";
import { useCreatePayment, useGetCurrentMembership } from "@/features/payment/use_payment";
import { MEMBERSHIP_PLANS, type MembershipPlan } from "@/features/payment/payment_type";
import { ErrorAlert } from "@/common/components/error_alert";

const MembershipPage = () => {
    const [loadingPlan, setLoadingPlan] = useState<MembershipPlan | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { data: currentMembership, isLoading: isFetchingMembership } = useGetCurrentMembership();
    const createPaymentMutation = useCreatePayment();

    const handleSelectPlan = (plan: MembershipPlan) => {
        setLoadingPlan(plan);
        setErrorMessage(null);

        createPaymentMutation.mutate(
            { plan },
            {
                onSuccess: (data) => {
                    const checkoutUrl = data?.result?.checkoutUrl;
                    if (checkoutUrl) {
                        window.location.href = checkoutUrl;
                    } else {
                        setErrorMessage("Không thể khởi tạo thanh toán. Vui lòng thử lại.");
                        setLoadingPlan(null);
                    }
                },
                onError: (error: any) => {
                    const apiError =
                        error?.response?.data?.title ||
                        "Đã xảy ra lỗi khi tạo thanh toán. Vui lòng thử lại.";
                    setErrorMessage(apiError);
                    setLoadingPlan(null);
                },
            }
        );
    };

    return (
        <div className="client-page">
            <div className="client-page-header">
                <h2>Nâng Cấp Tài Khoản Premium</h2>
                <p>Chọn gói phù hợp với bạn để mở khóa toàn bộ tính năng.</p>
            </div>

            <ErrorAlert message={errorMessage} />

            {!isFetchingMembership && currentMembership && currentMembership.isActive && (
                <div className="current-membership-card">
                    <div className="badge-active">Đang hoạt động</div>
                    <h3>Gói hiện tại: {currentMembership.planCode}</h3>
                    <div className="membership-details">
                        <p>
                            <strong>Ngày bắt đầu:</strong>{" "}
                            {new Date(currentMembership.startDate).toLocaleDateString("vi-VN")}
                        </p>
                        <p>
                            <strong>Ngày hết hạn:</strong>{" "}
                            {new Date(currentMembership.endDate).toLocaleDateString("vi-VN")}
                        </p>
                        <p>
                            <strong>Thời hạn còn lại:</strong> {currentMembership.daysRemaining} ngày
                        </p>
                    </div>
                </div>
            )}

            <div className="plan-list">
                {MEMBERSHIP_PLANS.map((option) => {
                    const isLoading = loadingPlan === option.plan && createPaymentMutation.isPending;

                    return (
                        <button key={option.plan} type="button" disabled={createPaymentMutation.isPending} className={`plan-card ${option.highlighted ? "highlight" : ""}`} onClick={() => handleSelectPlan(option.plan)}>
                            {option.highlighted && <span className="member-badge">Tiết kiệm nhất</span>}
                            <h3>{option.title}</h3>
                            <div className="price">
                                <span className="amount">{option.price.toLocaleString("vi-VN")}đ</span>
                                <span className="period">{option.period}</span>
                            </div>
                            <p className="description">{option.description}</p>
                            {isLoading && (
                                <span className="loading-text-inline">Đang chuyển trang...</span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MembershipPage;