import { useState, useEffect, type FormEvent } from "react";
import { Modal } from "@/common/components/modal";
import { Input } from "@/common/components/input";
import { Button } from "@/common/components/button";
import { ErrorAlert } from "@/common/components/error_alert";
import { mapFieldErrors, getGeneralErrors } from "@/common/utils/api_error";
import type { FieldError } from "@/common/types/api_result_type";
import type { GroupDto, CreateGroupRequest, UpdateGroupRequest } from "../group_type";

type GroupFormMode = "create" | "update";

interface GroupFormModalProps {
    isOpen: boolean;
    mode: GroupFormMode;
    initialValues?: GroupDto;
    isLoading?: boolean;
    apiErrors?: FieldError[] | null;
    onClose: () => void;
    onSubmit: (payload: CreateGroupRequest | UpdateGroupRequest) => void;
}

interface FormState {
    title: string;
    description: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

export function GroupFormModal({ isOpen, mode, initialValues, isLoading = false, apiErrors, onClose, onSubmit }: GroupFormModalProps) {
    const [form, setForm] = useState<FormState>({ title: "", description: "" });
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (isOpen) {
            setForm({
                title: initialValues?.title ?? "",
                description: initialValues?.description ?? "",
            });
            setErrors({});
        }
    }, [isOpen, initialValues]);

    useEffect(() => {
        if (apiErrors && apiErrors.length > 0) {
            setErrors((prev) => ({ ...prev, ...mapFieldErrors<keyof FormState>(apiErrors) }));
        }
    }, [apiErrors]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, title: e.target.value }));
        setErrors((prev) => ({ ...prev, title: undefined }));
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, description: e.target.value }));
        setErrors((prev) => ({ ...prev, description: undefined }));
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!form.title.trim()) newErrors.title = "Vui lòng nhập tiêu đề";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const description = form.description.trim() || undefined;

        if (mode === "create") {
            onSubmit({ title: form.title, description } as CreateGroupRequest);
        } else {
            onSubmit({ id: initialValues!.id, title: form.title, description } as UpdateGroupRequest);
        }
    };

    return (
        <Modal isOpen={isOpen} title={mode === "create" ? "Tạo nhóm chủ đề" : "Cập nhật nhóm chủ đề"} onClose={onClose}>
            <form className="data-form" onSubmit={handleSubmit}>
                <ErrorAlert message={getGeneralErrors(apiErrors)} />

                <div className="form-group">
                    <label className="form-label">
                        Tiêu đề <span className="required">*</span>
                    </label>
                    <Input
                        placeholder="Nhập tiêu đề nhóm"
                        value={form.title}
                        onChange={handleTitleChange}
                        error={errors.title}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Mô tả</label>
                    <textarea
                        className={`custom-input ${errors.description ? "has-error" : ""}`}
                        rows={4}
                        placeholder="Nhập mô tả (không bắt buộc)"
                        value={form.description}
                        onChange={handleDescriptionChange}
                    />
                    {errors.description && <p className="input-error-message">{errors.description}</p>}
                </div>

                <div className="data-form-actions">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Đang lưu..." : mode === "create" ? "Tạo nhóm" : "Cập nhật"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}