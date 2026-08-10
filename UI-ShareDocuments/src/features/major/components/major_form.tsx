import { useState, useEffect, type FormEvent } from "react";
import { Modal } from "@/common/components/modal";
import { Input } from "@/common/components/input";
import { Button } from "@/common/components/button";
import { ErrorAlert } from "@/common/components/error_alert";
import { mapFieldErrors, getGeneralErrors } from "@/common/utils/api_error";
import type { FieldError } from "@/common/types/api_result_type";
import type { MajorDto, CreateMajorRequest, UpdateMajorRequest } from "../types/major_type";

type MajorFormMode = "create" | "update";

interface MajorFormModalProps {
    isOpen: boolean;
    mode: MajorFormMode;
    facultyId: number;
    initialValues?: MajorDto;
    isLoading?: boolean;
    apiErrors?: FieldError[] | null;
    onClose: () => void;
    onSubmit: (payload: CreateMajorRequest | UpdateMajorRequest) => void;
}

interface FormState {
    name: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

export function MajorFormModal({ isOpen, mode, facultyId, initialValues, isLoading = false, apiErrors, onClose, onSubmit }: MajorFormModalProps) {
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
        if (!form.name.trim()) newErrors.name = "Vui lòng nhập tên ngành";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        if (mode === "create") {
            onSubmit({ facultyId, name: form.name } as CreateMajorRequest);
        } else {
            onSubmit({ id: initialValues!.id, facultyId, name: form.name } as UpdateMajorRequest);
        }
    };

    return (
        <Modal isOpen={isOpen} title={mode === "create" ? "Tạo ngành" : "Cập nhật ngành"} onClose={onClose}>
            <form className="page-form" onSubmit={handleSubmit}>
                <ErrorAlert message={getGeneralErrors(apiErrors)} />

                <div className="form-group">
                    <label className="form-label">
                        Tên ngành <span className="required">*</span>
                    </label>
                    <Input
                        placeholder="Nhập tên ngành"
                        value={form.name}
                        onChange={handleChange}
                        error={errors.name}
                    />
                </div>

                <div className="page-form-actions">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Đang lưu..." : mode === "create" ? "Tạo ngành" : "Cập nhật"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}