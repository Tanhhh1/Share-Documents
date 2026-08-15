import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useSignIn } from "@/features/auth/use_auth";
import { Input } from "@/common/components/input";
import { Button } from "@/common/components/button";
import { ErrorAlert } from "@/common/components/error_alert";
import { getGeneralErrors } from "@/common/utils/api_error";
import type { ApiResult, FieldError } from "@/common/types/api_result_type";
import "@/styles/client/auth.css";

const schema = z.object({
    username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
    password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type FormValues = z.infer<typeof schema>;

export default function SignInPage() {
    const [apiErrors, setApiErrors] = useState<FieldError[] | null>(null);
    const { register, handleSubmit, formState: { errors }} = useForm<FormValues>({ resolver: zodResolver(schema) });
    const signIn = useSignIn();

    const onSubmit = (values: FormValues) => {
        setApiErrors(null);
        signIn.mutate(values, {
            onSuccess: (result: ApiResult<unknown>) => {
                if (!result.succeeded)
                    setApiErrors(result.errors ?? null);
            },
            onError: (error) => {
                const responseData = (error as { response?: { data?: ApiResult<unknown> } })?.response?.data;
                if (responseData?.errors)
                    setApiErrors(responseData.errors);
            }
        });
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Đăng Nhập</h1>
                <ErrorAlert message={getGeneralErrors(apiErrors)} />
                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <Input {...register("username")} placeholder="Tên đăng nhập" error={errors.username?.message}/>
                    <Input {...register("password")} type="password" placeholder="Mật khẩu" error={errors.password?.message}/>
                    <Button type="submit" disabled={signIn.isPending}>
                        {signIn.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                    </Button>
                </form>

                <div className="auth-footer-text">
                    <div>
                        <Link to="/forgot-password" className="auth-link">
                            Quên mật khẩu?
                        </Link>
                    </div>
                    <div>
                        Chưa có tài khoản?{" "}
                        <Link to="/sign-up" className="auth-link">Đăng ký</Link>
                    </div>
                </div>

                <div className="auth-divider">Hoặc tiếp tục với</div>
                <div className="auth-social-row">
                    <Button type="button" className="custom-button-outline">
                        <i className="bx bxl-google"></i>Google
                    </Button>
                    <Button type="button" className="custom-button-outline">
                        <i className="bx bxl-facebook-circle"></i>Facebook
                    </Button>
                </div>
            </div>
        </div>
    );
}