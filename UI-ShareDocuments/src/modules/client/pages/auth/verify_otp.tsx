import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, Link } from "react-router-dom";
import { useVerifyOtp } from "@/features/auth/use_auth";
import type { ApiResult } from "@/common/types/api_result_type";
import { Input } from "@/common/components/input";
import { Button } from "@/common/components/button";

const schema = z.object({
    otp: z.string().min(1, "Vui lòng nhập mã OTP"),
});

type FormValues = z.infer<typeof schema>;

export default function VerifyOtpPage() {
    const location = useLocation();
    const email = location.state?.email || "";

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });
    const verifyOtp = useVerifyOtp();

    const onSubmit = (values: FormValues) => {
        verifyOtp.mutate({ email, otp: values.otp });
    };

    const apiErrors = (verifyOtp.error as { response?: { data?: ApiResult<unknown> } })?.response?.data?.errors;

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Xác Nhận OTP</h1>
                <p className="auth-noti">
                    Mã OTP đã được gửi tới: <strong>{email}</strong>
                </p>
                {apiErrors?.map((err, i) => (
                    <p key={i} className="auth-api-error">
                        {err.errorMessage}
                    </p>
                ))}
                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <Input {...register("otp")} placeholder="Nhập mã OTP" error={errors.otp?.message} />
                    <Button type="submit" disabled={verifyOtp.isPending}>
                        {verifyOtp.isPending ? "Đang xác thực..." : "Xác nhận"}
                    </Button>
                </form>

                <div className="auth-footer-text">
                    Quay lại{" "}
                    <Link to="/forgot-password" className="auth-link">Gửi lại OTP</Link>
                </div>
            </div>
        </div>
    );
}