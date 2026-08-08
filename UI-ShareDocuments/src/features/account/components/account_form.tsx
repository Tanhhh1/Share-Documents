import { useState, useEffect, type FormEvent } from "react";
import { Modal } from "@/common/components/modal";
import { Input } from "@/common/components/input";
import { Button } from "@/common/components/button";
import { ErrorAlert } from "@/common/components/error_alert";
import { mapFieldErrors, getGeneralErrors } from "@/common/utils/api_error";
import type { FieldError } from "@/common/types/api_result_type";
import type { AccountDto, CreateAccountRequest, UpdateAccountRequest } from "../types/account_type";

type AccountFormMode = "create" | "update";

interface AccountFormModalProps {
    isOpen: boolean;
    mode: AccountFormMode;
    initialValues?: AccountDto;
    isLoading?: boolean;
    apiErrors?: FieldError[] | null;
    onClose: () => void;
    onSubmit: (payload: CreateAccountRequest | UpdateAccountRequest) => void;
}

interface FormState {
    userName: string;
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

export function AccountFormModal({ isOpen, mode, initialValues, isLoading = false, apiErrors, onClose, onSubmit }: AccountFormModalProps) {
    const [form, setForm] = useState<FormState>({ userName: "", email: "", password: "", fullName: "", phoneNumber: "" });
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (isOpen) {
            setForm({
                userName: initialValues?.userName ?? "",
                email: initialValues?.email ?? "",
                password: "",
                fullName: initialValues?.fullName ?? "",
                phoneNumber: initialValues?.phoneNumber ?? "",
            });
            setErrors({});
        }
    }, [isOpen, initialValues]);

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

        if (!form.userName.trim()) newErrors.userName = "Vui lòng nhập tên tài khoản";
        if (!form.email.trim()) newErrors.email = "Vui lòng nhập email";
        if (!form.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
        if (mode === "create" && !form.password.trim()) newErrors.password = "Vui lòng nhập mật khẩu";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        if (mode === "create") {
            const payload: CreateAccountRequest = {
                userName: form.userName,
                email: form.email,
                password: form.password,
                fullName: form.fullName,
                phoneNumber: form.phoneNumber || undefined,
            };
            onSubmit(payload);
        } else {
            const payload: UpdateAccountRequest = {
                id: initialValues!.id,
                userName: form.userName,
                email: form.email,
                fullName: form.fullName,
                phoneNumber: form.phoneNumber || undefined,
            };
            onSubmit(payload);
        }
    };

    return (
        <Modal isOpen={isOpen} title={mode === "create" ? "Tạo tài khoản" : "Cập nhật tài khoản"} onClose={onClose}>
            <form className="page-form" onSubmit={handleSubmit}>
                <ErrorAlert message={getGeneralErrors(apiErrors)} />

                <div className="form-group">
                    <label className="form-label">Tên tài khoản <span className="required">*</span></label>
                    <Input
                        placeholder="Nhập tên tài khoản (ví dụ: johndoe)"
                        value={form.userName}
                        onChange={handleChange("userName")}
                        error={errors.userName}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label"> Email <span className="required">*</span></label>
                    <Input
                        placeholder="Nhập địa chỉ email (ví dụ: example@gmail.com)"
                        value={form.email}
                        onChange={handleChange("email")}
                        error={errors.email}
                    />
                </div>

                {mode === "create" && (
                    <div className="form-group">
                        <label className="form-label">Mật khẩu <span className="required">*</span></label>
                        <Input
                            placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                            type="password"
                            value={form.password}
                            onChange={handleChange("password")}
                            error={errors.password}
                        />
                    </div>
                )}

                <div className="form-group">
                    <label className="form-label">Họ tên <span className="required">*</span></label>
                    <Input
                        placeholder="Nhập họ và tên đầy đủ"
                        value={form.fullName}
                        onChange={handleChange("fullName")}
                        error={errors.fullName}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Số điện thoại</label>
                    <Input
                        placeholder="Nhập số điện thoại (ví dụ: 0987654321)"
                        value={form.phoneNumber}
                        onChange={handleChange("phoneNumber")}
                        error={errors.phoneNumber}
                    />
                </div>

                <div className="page-form-actions">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Đang lưu..." : mode === "create" ? "Tạo tài khoản" : "Cập nhật"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}