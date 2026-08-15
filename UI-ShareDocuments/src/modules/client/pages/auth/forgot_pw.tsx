import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useForgotPassword } from "@/features/auth/use_auth";
import type { ApiResult } from "@/common/types/api_result_type";
import { Input } from "@/common/components/input";
import { Button } from "@/common/components/button";
import "@/styles/client/auth.css";

const schema = z.object({
    email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });
    const forgotPassword = useForgotPassword();

    const onSubmit = (values: FormValues) => {
        forgotPassword.mutate(values);
    };

    const apiErrors = (forgotPassword.error as { response?: { data?: ApiResult<unknown> } })?.response?.data?.errors;

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Quên Mật Khẩu</h1>
                {apiErrors?.map((err, i) => (
                    <p key={i} className="auth-api-error">
                        {err.errorMessage}
                    </p>
                ))}
                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <Input {...register("email")} placeholder="Nhập email của bạn" error={errors.email?.message} />
                    <Button type="submit" disabled={forgotPassword.isPending}>
                        {forgotPassword.isPending ? "Đang gửi..." : "Gửi mã OTP"}
                    </Button>
                </form>

                <div className="auth-footer-text">
                    <div></div>
                    <Link to="/sign-in" className="auth-link">Quay lại Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
}