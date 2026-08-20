import { useState, useEffect, type FormEvent } from "react";
import { Input } from "@/common/components/input";
import { Button } from "@/common/components/button";
import { ErrorAlert } from "@/common/components/error_alert";
import { SuccessAlert } from "@/common/components/success_alert";
import { mapFieldErrors, getGeneralErrors } from "@/common/utils/api_error";
import type { FieldError } from "@/common/types/api_result_type";
import type { ProfileDto, UpdateInformationRequest } from "../profile_type";

interface ProfileInfoFormProps {
    profile?: ProfileDto;
    isLoading?: boolean;
    apiErrors?: FieldError[] | null;
    apiSuccess?: string | null;
    onSubmit: (payload: UpdateInformationRequest) => void;
}

interface FormState {
    fullName: string;
    email: string;
    phoneNumber: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

export function ProfileInfoForm({
    profile,
    isLoading = false,
    apiErrors,
    apiSuccess,
    onSubmit,
}: ProfileInfoFormProps) {
    const [form, setForm] = useState<FormState>({ fullName: "", email: "", phoneNumber: "" });
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (profile) {
            setForm({
                fullName: profile.fullName ?? "",
                email: profile.email ?? "",
                phoneNumber: profile.phoneNumber ?? "",
            });
            setErrors({});
        }
    }, [profile]);

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
        if (!form.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
        if (!form.email.trim()) newErrors.email = "Vui lòng nhập email";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        onSubmit({
            fullName: form.fullName,
            email: form.email,
            phoneNumber: form.phoneNumber || undefined,
        });
    };

    return (
        <form className="data-form form-section-card" onSubmit={handleSubmit}>
            <div className="form-section-header">
                <i className="bx bx-id-card"></i>
                <h3>Thông Tin Cá Nhân</h3>
            </div>
            <SuccessAlert message={apiSuccess} />
            <ErrorAlert message={getGeneralErrors(apiErrors)} />

            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">Tên tài khoản</label>
                    <Input value={profile?.userName ?? ""} disabled readOnly />
                </div>

                <div className="form-group">
                    <label className="form-label">Họ tên <span className="required">*</span></label>
                    <Input
                        placeholder="Nhập họ và tên"
                        value={form.fullName}
                        onChange={handleChange("fullName")}
                        error={errors.fullName}
                    />
                </div>
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label className="form-label">Email <span className="required">*</span></label>
                    <Input
                        placeholder="Nhập địa chỉ email"
                        value={form.email}
                        onChange={handleChange("email")}
                        error={errors.email}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Số điện thoại</label>
                    <Input
                        placeholder="Nhập số điện thoại"
                        value={form.phoneNumber}
                        onChange={handleChange("phoneNumber")}
                        error={errors.phoneNumber}
                    />
                </div>
            </div>

            <div className="data-form-actions" style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
            </div>
        </form>
    );
}