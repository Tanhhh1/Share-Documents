import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useSignUp } from "@/features/auth/use_auth";
import { Input } from "@/common/components/input";
import { Button } from "@/common/components/button";
import { ErrorAlert } from "@/common/components/error_alert";
import { getGeneralErrors } from "@/common/utils/api_error";
import type { ApiResult, FieldError } from "@/common/types/api_result_type";

const schema = z
    .object({
        userName: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
        email: z.string().email("Email không hợp lệ"),
        fullName: z.string().min(1, "Vui lòng nhập họ tên"),
        password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
        confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });

type FormValues = z.infer<typeof schema>;

export default function SignUpPage() {
    const [apiErrors, setApiErrors] = useState<FieldError[] | null>(null);
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });
    const signUp = useSignUp();
    const navigate = useNavigate();

    const onSubmit = (values: FormValues) => {
        setApiErrors(null);
        signUp.mutate(values, {
            onSuccess: (data: ApiResult<unknown>) => {
                if (data.succeeded) {
                    navigate("/sign-in");
                } else {
                    setApiErrors(data.errors ?? null);
                }
            },
            onError: (error) => {
                const responseData = (error as { response?: { data?: ApiResult<unknown> } })?.response?.data;
                if (responseData?.errors) {
                    setApiErrors(responseData.errors);
                }
            },
        });
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Đăng Ký</h1>
                <ErrorAlert message={getGeneralErrors(apiErrors)} />

                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <Input {...register("userName")} placeholder="Tên đăng nhập" error={errors.userName?.message}/>
                    <Input {...register("email")} placeholder="Email" error={errors.email?.message}/>
                    <Input {...register("fullName")} placeholder="Họ tên" error={errors.fullName?.message}/>
                    <Input {...register("password")} type="password" placeholder="Mật khẩu" error={errors.password?.message}/>
                    <Input {...register("confirmPassword")} type="password" placeholder="Xác nhận mật khẩu" error={errors.confirmPassword?.message}/>
                    
                    <Button type="submit" disabled={signUp.isPending}>
                        {signUp.isPending ? "Đang đăng ký..." : "Đăng ký"}
                    </Button>
                </form>
                <p className="auth-footer-text">
                    Đã có tài khoản?{" "}
                    <Link to="/sign-in" className="auth-link">Đăng nhập</Link>
                </p>
                <div className="auth-divider">Hoặc tiếp tục với</div>
                <div className="auth-social-row">
                    <Button type="button" className="custom-button-outline">
                        <i className="bx bxl-google"></i>
                        Google
                    </Button>
                    <Button type="button" className="custom-button-outline">
                        <i className="bx bxl-facebook-circle"></i>
                        Facebook
                    </Button>
                </div>
            </div>
        </div>
    );
}