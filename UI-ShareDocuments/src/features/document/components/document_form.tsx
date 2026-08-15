import { useState, useEffect, useRef, type FormEvent, type DragEvent } from "react";
import { Modal } from "@/common/components/modal";
import { Input } from "@/common/components/input";
import { Button } from "@/common/components/button";
import { ErrorAlert } from "@/common/components/error_alert";
import { mapFieldErrors, getGeneralErrors } from "@/common/utils/api_error";
import type { FieldError } from "@/common/types/api_result_type";
import { AccessLevel, ACCESS_LEVELS, ACCESS_LEVEL_LABEL } from "@/common/constants/access_level";
import { SubjectSelect } from "@/features/subject/components/subject_select";
import { TagMultiSelect } from "@/features/tag/components/tag_select";
import type { CreateDocumentRequest } from "../document_type";
import "@/styles/admin/form.css";

interface FormState {
    title: string;
    description: string;
    subjectId: number | undefined;
    accessLevel: AccessLevel;
    tagIds: number[];
    file: File | null;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_FORM: FormState = {
    title: "",
    description: "",
    subjectId: undefined,
    accessLevel: AccessLevel.Free,
    tagIds: [],
    file: null,
};

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(fileName: string): string {
    return fileName.split(".").pop()?.toLowerCase() ?? "";
}

interface DocumentFormProps {
    isLoading?: boolean;
    apiErrors?: FieldError[] | null;
    onSubmit: (payload: CreateDocumentRequest) => void;
    submitLabel?: string;
}

export function DocumentForm({ isLoading = false, apiErrors, onSubmit, submitLabel = "Tạo tài liệu" }: DocumentFormProps) {
    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (apiErrors && apiErrors.length > 0) {
            setErrors((prev) => ({ ...prev, ...mapFieldErrors<keyof FormState>(apiErrors) }));
        }
    }, [apiErrors]);

    const handleFileSelect = (file: File | null) => {
        setForm((prev) => ({ ...prev, file }));
        setErrors((prev) => ({ ...prev, file: undefined }));
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileSelect(file);
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!form.title.trim()) newErrors.title = "Vui lòng nhập tiêu đề";
        if (!form.subjectId) newErrors.subjectId = "Vui lòng chọn môn học";
        if (!form.file) newErrors.file = "Vui lòng chọn tệp tài liệu";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        onSubmit({
            title: form.title,
            description: form.description || undefined,
            subjectId: form.subjectId!,
            accessLevel: form.accessLevel,
            tagIds: form.tagIds,
            file: form.file!,
        });
    };

    const fileExtension = form.file ? getFileExtension(form.file.name) : "";

    return (
        <form className="doc-form" onSubmit={handleSubmit}>
            <ErrorAlert message={getGeneralErrors(apiErrors)} />

            <div className="doc-form-section">
                <p className="doc-form-section-title">Thông tin cơ bản</p>

                <div className="form-group">
                    <label className="form-label">
                        Tiêu đề <span className="required">*</span>
                    </label>
                    <Input
                        placeholder="Nhập tiêu đề tài liệu"
                        value={form.title}
                        onChange={(e) => { setForm((prev) => ({ ...prev, title: e.target.value })); setErrors((prev) => ({ ...prev, title: undefined })); }}
                        error={errors.title}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Mô tả</label>
                    <textarea
                        className="doc-form-textarea"
                        placeholder="Mô tả ngắn về nội dung tài liệu..."
                        rows={3}
                        value={form.description}
                        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    />
                </div>
            </div>

            <div className="doc-form-section">
                <p className="doc-form-section-title">Phân loại</p>

                <div className="doc-form-row">
                    <div className="form-group">
                        <label className="form-label">
                            Môn học <span className="required">*</span>
                        </label>
                        <SubjectSelect
                            value={form.subjectId}
                            onChange={(subjectId) => { setForm((prev) => ({ ...prev, subjectId })); setErrors((prev) => ({ ...prev, subjectId: undefined })); }}
                        />
                        {errors.subjectId && <p className="input-error-message">{errors.subjectId}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Quyền truy cập <span className="required">*</span>
                        </label>
                        <select className="custom-input" value={form.accessLevel} onChange={(e) => setForm((prev) => ({ ...prev, accessLevel: e.target.value as AccessLevel }))}>
                            {ACCESS_LEVELS.map((level) => (
                                <option key={level} value={level}>
                                    {ACCESS_LEVEL_LABEL[level]}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Thẻ phân loại</label>
                    <TagMultiSelect
                        value={form.tagIds}
                        onChange={(tagIds) => setForm((prev) => ({ ...prev, tagIds: tagIds ?? [] }))}
                    />
                </div>
            </div>

            <div className="doc-form-section">
                <p className="doc-form-section-title">
                    Tệp tài liệu <span className="required">*</span>
                </p>
                {!form.file ? (
                    <div
                        className={`doc-form-dropzone ${isDragging ? "dragging" : ""} ${errors.file ? "has-error" : ""}`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                    >
                        <p className="doc-form-dropzone-title">Kéo thả tệp vào đây hoặc bấm để chọn</p>
                        <p className="doc-form-dropzone-hint">Hỗ trợ định dạng PDF, DOCX, PPTX</p>
                        <input ref={fileInputRef} type="file" accept=".pdf,.docx,.pptx" hidden onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}/>
                    </div>
                ) : (
                    <div className="doc-form-file-card">
                        <span className={`doc-form-file-badge ext-${fileExtension}`}>
                            {fileExtension.toUpperCase()}
                        </span>
                        <div className="doc-form-file-info">
                            <p className="doc-form-file-name">{form.file.name}</p>
                            <p className="doc-form-file-size">{formatFileSize(form.file.size)}</p>
                        </div>
                        <button type="button" className="doc-form-file-remove" onClick={() => handleFileSelect(null)}>
                            ×
                        </button>
                    </div>
                )}
                {errors.file && <p className="input-error-message">{errors.file}</p>}
            </div>

            <div className="page-form-actions">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Đang tạo..." : submitLabel}
                </Button>
            </div>
        </form>
    );
}

interface DocumentFormModalProps {
    isOpen: boolean;
    isLoading?: boolean;
    apiErrors?: FieldError[] | null;
    onClose: () => void;
    onSubmit: (payload: CreateDocumentRequest) => void;
}

export function DocumentFormModal({ isOpen, isLoading, apiErrors, onClose, onSubmit }: DocumentFormModalProps) {
    return (
        <Modal isOpen={isOpen} title="Tạo tài liệu" onClose={onClose}>
            <DocumentForm isLoading={isLoading} apiErrors={apiErrors} onSubmit={onSubmit} />
        </Modal>
    );
}