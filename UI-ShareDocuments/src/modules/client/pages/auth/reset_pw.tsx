import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "react-router-dom";
import { useResetPassword } from "@/features/auth/use_auth";
import type { ApiResult } from "@/common/types/api_result_type";
import { Input } from "@/common/components/input";
import { Button } from "@/common/components/button";

const schema = z.object({
    newPassword: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

type FormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
    const location = useLocation();
    const email = location.state?.email || "";
    const token = location.state?.token || "";

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });
    const resetPassword = useResetPassword();

    const onSubmit = (values: FormValues) => {
        resetPassword.mutate({
            email,
            token,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
        });
    };

    const apiErrors = (resetPassword.error as { response?: { data?: ApiResult<unknown> } })?.response?.data?.errors;

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Đặt Lai Mật Khẩu</h1>
                {apiErrors?.map((err, i) => (
                    <p key={i} className="auth-api-error">
                        {err.errorMessage}
                    </p>
                ))}
                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <Input 
                        {...register("newPassword")} 
                        type="password" 
                        placeholder="Mật khẩu mới" 
                        error={errors.newPassword?.message} 
                    />
                    <Input 
                        {...register("confirmPassword")} 
                        type="password" 
                        placeholder="Xác nhận mật khẩu mới" 
                        error={errors.confirmPassword?.message} 
                    />
                    <Button type="submit" disabled={resetPassword.isPending}>
                        {resetPassword.isPending ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
                    </Button>
                </form>
            </div>
        </div>
    );
}