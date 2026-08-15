import { useState, useEffect, type FormEvent } from "react";
import { Modal } from "@/common/components/modal";
import { Input } from "@/common/components/input";
import { Button } from "@/common/components/button";
import { ErrorAlert } from "@/common/components/error_alert";
import { mapFieldErrors, getGeneralErrors } from "@/common/utils/api_error";
import { EDUCATION_LEVEL_LABEL, GENERAL_EDUCATION_LEVELS, type EducationLevel } from "@/common/constants/education_level";
import type { FieldError } from "@/common/types/api_result_type";
import type { SubjectDto, CreateSubjectRequest, UpdateSubjectRequest } from "../subject_type";

type SubjectFormMode = "create" | "update";

interface SubjectFormModalProps {
    isOpen: boolean;
    mode: SubjectFormMode;
    educationLevel: EducationLevel;
    majorId?: number;
    initialValues?: SubjectDto;
    isLoading?: boolean;
    apiErrors?: FieldError[] | null;
    onClose: () => void;
    onSubmit: (payload: CreateSubjectRequest | UpdateSubjectRequest) => void;
}

interface FormState {
    name: string;
    educationLevel: EducationLevel;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

export function SubjectFormModal({
    isOpen,
    mode,
    educationLevel,
    majorId,
    initialValues,
    isLoading = false,
    apiErrors,
    onClose,
    onSubmit,
}: SubjectFormModalProps) {
    const isUniversityBranch = majorId !== undefined;

    const [form, setForm] = useState<FormState>({ name: "", educationLevel });
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (isOpen) {
            setForm({
                name: initialValues?.name ?? "",
                educationLevel: initialValues?.educationLevel ?? educationLevel,
            });
            setErrors({});
        }
    }, [isOpen, initialValues, educationLevel]);

    useEffect(() => {
        if (apiErrors && apiErrors.length > 0) {
            setErrors((prev) => ({ ...prev, ...mapFieldErrors<keyof FormState>(apiErrors) }));
        }
    }, [apiErrors]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, name: e.target.value }));
        setErrors((prev) => ({ ...prev, name: undefined }));
    };

    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, educationLevel: e.target.value as EducationLevel }));
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!form.name.trim()) newErrors.name = "Vui lòng nhập tên môn học";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        if (mode === "create") {
            onSubmit({ educationLevel: form.educationLevel, majorId, name: form.name } as CreateSubjectRequest);
        } else {
            onSubmit({
                id: initialValues!.id,
                educationLevel: form.educationLevel,
                majorId,
                name: form.name,
            } as UpdateSubjectRequest);
        }
    };

    return (
        <Modal isOpen={isOpen} title={mode === "create" ? "Tạo môn học" : "Cập nhật môn học"} onClose={onClose}>
            <form className="page-form" onSubmit={handleSubmit}>
                <ErrorAlert message={getGeneralErrors(apiErrors)} />

                {!isUniversityBranch && (
                    <div className="form-group">
                        <label className="form-label">
                            Cấp học <span className="required">*</span>
                        </label>
                        <select className="custom-input" value={form.educationLevel} onChange={handleLevelChange}>
                            {GENERAL_EDUCATION_LEVELS.map((level) => (
                                <option key={level} value={level}>
                                    {EDUCATION_LEVEL_LABEL[level]}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="form-group">
                    <label className="form-label">
                        Tên môn học <span className="required">*</span>
                    </label>
                    <Input
                        placeholder="Nhập tên môn học"
                        value={form.name}
                        onChange={handleNameChange}
                        error={errors.name}
                    />
                </div>

                <div className="page-form-actions">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Đang lưu..." : mode === "create" ? "Tạo môn học" : "Cập nhật"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}