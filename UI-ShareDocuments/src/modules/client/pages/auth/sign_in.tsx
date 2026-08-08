import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useSignIn } from "@/features/auth/hooks/use_signin";
import type { ApiResult } from "@/common/types/api_result_type";
import { Input } from "@/common/components/input";
import { Button } from "@/common/components/button";
import "@/styles/client/auth.css";

const schema = z.object({
    username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
    password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type FormValues = z.infer<typeof schema>;

export default function SignInPage() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });
    const signIn = useSignIn();
    const onSubmit = (values: FormValues) => {
        signIn.mutate(values);
    };

    const apiErrors = (signIn.error as { response?: { data?: ApiResult<unknown> } })?.response?.data?.errors;

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Đăng Nhập</h1>
                {apiErrors?.map((err, i) => (
                    <p key={i} className="auth-api-error">
                        {err.errorMessage}
                    </p>
                ))}
                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <Input {...register("username")} placeholder="Tên đăng nhập" error={errors.username?.message} />
                    <Input {...register("password")} type="password" placeholder="Mật khẩu" error={errors.password?.message} />
                    <Button type="submit" disabled={signIn.isPending}>
                        {signIn.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                    </Button>
                </form>

                <p className="auth-footer-text">
                    Chưa có tài khoản?{" "}
                    <Link to="/sign-up" className="auth-link">Đăng ký</Link>
                </p>

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