import { useState, useEffect, type FormEvent } from "react";
import { Input } from "@/common/components/input";
import { Button } from "@/common/components/button";
import { ErrorAlert } from "@/common/components/error_alert";
import { SuccessAlert } from "@/common/components/success_alert";
import { mapFieldErrors, getGeneralErrors } from "@/common/utils/api_error";
import type { FieldError } from "@/common/types/api_result_type";
import type { UpdatePasswordRequest } from "../profile_type";

interface ChangePasswordFormProps {
    isLoading?: boolean;
    apiErrors?: FieldError[] | null;
    apiSuccess?: string | null;
    onSubmit: (payload: UpdatePasswordRequest) => void;
}

interface FormState {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

export function ChangePasswordForm({ isLoading = false, apiErrors, apiSuccess, onSubmit }: ChangePasswordFormProps) {
    const [form, setForm] = useState<FormState>({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (apiErrors && apiErrors.length > 0) {
            setErrors((prev) => ({ ...prev, ...mapFieldErrors<keyof FormState>(apiErrors) }));
        }
    }, [apiErrors]);

    const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!form.currentPassword) newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
        if (!form.newPassword) newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
        if (!form.confirmNewPassword) {
            newErrors.confirmNewPassword = "Vui lòng xác nhận mật khẩu mới";
        } else if (form.newPassword !== form.confirmNewPassword) {
            newErrors.confirmNewPassword = "Mật khẩu xác nhận không khớp";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit(form);
    };

    return (
        <form className="page-form form-section-card" onSubmit={handleSubmit}>
            <div className="form-section-header">
                <i className="bx bx-lock-alt"></i>
                <h3>Đổi Mật Khẩu</h3>
            </div>
            <SuccessAlert message={apiSuccess} />
            <ErrorAlert message={getGeneralErrors(apiErrors)} />

            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">Mật khẩu hiện tại <span className="required">*</span></label>
                    <Input
                        type="password"
                        placeholder="Nhập mật khẩu hiện tại"
                        value={form.currentPassword}
                        onChange={handleChange("currentPassword")}
                        error={errors.currentPassword}
                    />
                </div>
                <div></div>
            </div>
            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">Xác nhận mật khẩu mới <span className="required">*</span></label>
                    <Input
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        value={form.confirmNewPassword}
                        onChange={handleChange("confirmNewPassword")}
                        error={errors.confirmNewPassword}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Mật khẩu mới <span className="required">*</span></label>
                    <Input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={form.newPassword}
                        onChange={handleChange("newPassword")}
                        error={errors.newPassword}
                    />
                </div>
            </div>

            <div className="page-form-actions">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Đang xử lý..." : "Lưu thay đổi"}
                </Button>
            </div>
        </form>
    );
}