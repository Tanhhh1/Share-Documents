import { useState, useEffect, type FormEvent } from "react";
import { Modal } from "@/common/components/modal";
import { Input } from "@/common/components/input";
import { Button } from "@/common/components/button";
import { ErrorAlert } from "@/common/components/error_alert";
import { mapFieldErrors, getGeneralErrors } from "@/common/utils/api_error";
import type { FieldError } from "@/common/types/api_result_type";
import type { TagDto, CreateTagRequest, UpdateTagRequest } from "../tag_type";

type TagFormMode = "create" | "update";

interface TagFormModalProps {
    isOpen: boolean;
    mode: TagFormMode;
    initialValues?: TagDto;
    isLoading?: boolean;
    apiErrors?: FieldError[] | null;
    onClose: () => void;
    onSubmit: (payload: CreateTagRequest | UpdateTagRequest) => void;
}

interface FormState {
    name: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

export function TagFormModal({ isOpen, mode, initialValues, isLoading = false, apiErrors, onClose, onSubmit }: TagFormModalProps) {
    const [form, setForm] = useState<FormState>({ name: "" });
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (isOpen) {
            setForm({ name: initialValues?.name ?? "" });
            setErrors({});
        }
    }, [isOpen, initialValues]);

    useEffect(() => {
        if (apiErrors && apiErrors.length > 0) {
            setErrors((prev) => ({ ...prev, ...mapFieldErrors<keyof FormState>(apiErrors) }));
        }
    }, [apiErrors]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ name: e.target.value });
        setErrors((prev) => ({ ...prev, name: undefined }));
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!form.name.trim()) newErrors.name = "Vui lòng nhập tên tag";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        if (mode === "create") {
            const payload: CreateTagRequest = { name: form.name };
            onSubmit(payload);
        } else {
            const payload: UpdateTagRequest = { id: initialValues!.id, name: form.name };
            onSubmit(payload);
        }
    };

    return (
        <Modal isOpen={isOpen} title={mode === "create" ? "Tạo thẻ phân loại" : "Cập nhật thẻ phân loại"} onClose={onClose}>
            <form className="page-form" onSubmit={handleSubmit}>
                <ErrorAlert message={getGeneralErrors(apiErrors)} />
                <div className="form-group">
                    <label className="form-label">Tên thẻ phân loại <span className="required">*</span></label>
                    <Input
                        placeholder="Nhập tên thẻ phân loại"
                        value={form.name}
                        onChange={handleChange}
                        error={errors.name}
                    />
                </div>

                <div className="page-form-actions">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Đang lưu..." : mode === "create" ? "Tạo thẻ" : "Cập nhật thẻ"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}