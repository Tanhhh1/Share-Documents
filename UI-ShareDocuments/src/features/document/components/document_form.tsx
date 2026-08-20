import { useState, useEffect, useRef, type FormEvent, type DragEvent } from "react";
import { Button } from "@/common/components/button";
import { ErrorAlert } from "@/common/components/error_alert";
import { mapFieldErrors, getGeneralErrors } from "@/common/utils/api_error";
import type { FieldError } from "@/common/types/api_result_type";
import { AccessLevel, ACCESS_LEVELS, ACCESS_LEVEL_LABEL } from "@/common/constants/access_level";
import { SubjectSelect } from "@/features/subject/components/subject_select";
import { TagMultiSelect } from "@/features/tag/components/tag_select";
import type { CreateDocumentRequest, UpdateDocumentRequest, DocumentDetailDto } from "../document_type";

export type DocumentFormMode = "create" | "update";

interface DocumentFormProps {
    mode: DocumentFormMode;
    initialValues?: DocumentDetailDto;
    isLoading?: boolean;
    apiErrors?: FieldError[] | null;
    onSubmit: (payload: CreateDocumentRequest | UpdateDocumentRequest) => void;
    hideAccessLevel?: boolean;
}

interface FormState {
    title: string;
    description: string;
    subjectId: number | undefined;
    accessLevel: AccessLevel;
    tagIds: number[];
    file: File | null;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(fileName: string): string {
    return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function getFileBoxiconClass(ext: string): string {
    switch (ext) {
        case "pdf": return "bxs-file-pdf";
        case "doc":
        case "docx": return "bxs-file-doc";
        case "ppt":
        case "pptx": return "bxs-file-txt";
        default: return "bxs-file";
    }
}

export function DocumentForm({
    mode,
    initialValues,
    isLoading = false,
    apiErrors,
    onSubmit,
    hideAccessLevel = false,
}: DocumentFormProps) {
    const [form, setForm] = useState<FormState>({
        title: "",
        description: "",
        subjectId: undefined,
        accessLevel: AccessLevel.Free,
        tagIds: [],
        file: null,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setForm({
            title: initialValues?.title ?? "",
            description: initialValues?.description ?? "",
            subjectId: initialValues?.subjectId ?? undefined,
            accessLevel: initialValues?.accessLevel ?? AccessLevel.Free,
            tagIds: initialValues?.tags ? initialValues.tags.map((t) => t.id) : [],
            file: null,
        });
        setErrors({});
    }, [initialValues]);

    useEffect(() => {
        if (apiErrors && apiErrors.length > 0) {
            setErrors((prev) => ({ ...prev, ...mapFieldErrors<keyof FormState>(apiErrors) }));
        }
    }, [apiErrors]);

    const setFile = (file: File | null) => {
        setForm((prev) => ({ ...prev, file }));
        setErrors((prev) => ({ ...prev, file: undefined }));
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) setFile(file);
    };

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!form.title.trim()) newErrors.title = "Vui lòng nhập tiêu đề";
        if (!form.subjectId) newErrors.subjectId = "Vui lòng chọn môn học";
        if (mode === "create" && !form.file) newErrors.file = "Vui lòng chọn tệp tài liệu";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        if (mode === "create") {
            const payload: CreateDocumentRequest = {
                title: form.title,
                description: form.description || undefined,
                subjectId: form.subjectId!,
                accessLevel: hideAccessLevel ? AccessLevel.Free : form.accessLevel,
                tagIds: form.tagIds,
                file: form.file!,
            };
            onSubmit(payload);
        } else {
            const payload: UpdateDocumentRequest = {
                id: initialValues!.id,
                title: form.title,
                description: form.description || undefined,
                subjectId: form.subjectId!,
                accessLevel: hideAccessLevel ? AccessLevel.Free : form.accessLevel,
                tagIds: form.tagIds,
            };
            onSubmit(payload);
        }
    };

    const displayFileName = mode === "update" ? initialValues?.fileName : form.file?.name;
    const displayFileSize = mode === "update" ? initialValues?.fileSizeBytes : form.file?.size;
    const fileExt = displayFileName ? getFileExtension(displayFileName) : "";

    return (
        <form className="doc-upload-layout" onSubmit={handleSubmit}>
            <ErrorAlert message={getGeneralErrors(apiErrors)} />

            <div className="doc-upload-container">
                <div className="doc-preview-column">
                    {mode === "create" && !form.file ? (
                        <div className={`doc-dropzone-box ${isDragging ? "dragging" : ""} ${errors.file ? "has-error" : ""}`}
                            onClick={() => fileInputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}
                        >
                            <i className="bx bx-cloud-upload dropzone-icon"></i>
                            <p className="dropzone-title">Tải tệp lên</p>
                            <p className="dropzone-sub">Kéo thả hoặc bấm để chọn (PDF, DOCX, PPTX)</p>
                            <input ref={fileInputRef} type="file" accept=".pdf,.docx,.pptx" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                        </div>
                    ) : (
                        <div className="doc-preview-card">
                            <div className="doc-preview-header">
                                <span className={`doc-ext-badge ext-${fileExt}`}>
                                    {fileExt.toUpperCase()}
                                </span>
                                {mode === "create" && (
                                    <button type="button" className="doc-remove-btn" onClick={() => setFile(null)}>
                                        <i className="bx bx-x"></i>
                                    </button>
                                )}
                            </div>

                            <div className="doc-preview-body">
                                <i className={`bx ${getFileBoxiconClass(fileExt)} doc-boxicon-file ext-${fileExt}`}></i>
                            </div>

                            <div className="doc-preview-footer">
                                <p className="doc-file-name" title={displayFileName}>{displayFileName}</p>
                                {displayFileSize && <p className="doc-file-size">{formatFileSize(displayFileSize)}</p>}
                            </div>
                        </div>
                    )}
                    {errors.file && <p className="input-error-message text-center">{errors.file}</p>}
                </div>

                <div className="doc-fields-column">
                    <div className="doc-field-row">
                        <div className="doc-field-group">
                            <label className="doc-field-label">
                                Tiêu đề <span className="label-required">*</span>
                            </label>
                            <div className={`doc-input-wrapper ${errors.title ? "has-error" : ""}`}>
                                <input type="text" className="doc-custom-input" placeholder="Nhập tiêu đề tài liệu..." value={form.title}
                                    onChange={(e) => { setForm((prev) => ({ ...prev, title: e.target.value })); setErrors((prev) => ({ ...prev, title: undefined })) }}
                                />
                            </div>
                            {errors.title && <p className="input-error-message">{errors.title}</p>}
                        </div>
                        <div className="doc-field-group">
                            <label className="doc-field-label">
                                Môn học <span className="label-required">*</span>
                            </label>
                            <SubjectSelect
                                value={form.subjectId}
                                onChange={(subjectId) => {
                                    setForm((prev) => ({ ...prev, subjectId }));
                                    setErrors((prev) => ({ ...prev, subjectId: undefined }));
                                }}
                            />
                            {errors.subjectId && <p className="input-error-message">{errors.subjectId}</p>}
                        </div>
                    </div>
                    <div className="doc-field-row">
                        <div className="doc-field-group">
                            <label className="doc-field-label">Thẻ phân loại</label>
                            <TagMultiSelect
                                value={form.tagIds}
                                onChange={(tagIds) => setForm((prev) => ({ ...prev, tagIds: tagIds ?? [] }))}
                            />
                        </div>
                        {!hideAccessLevel && (
                            <div className="doc-field-group">
                                <label className="doc-field-label">
                                    Quyền truy cập <span className="label-required">*</span>
                                </label>
                                <select className="doc-custom-select" value={form.accessLevel}
                                    onChange={(e) => setForm((prev) => ({ ...prev, accessLevel: e.target.value as AccessLevel }))}
                                >
                                    {ACCESS_LEVELS.map((level) => (
                                        <option key={level} value={level}>
                                            {ACCESS_LEVEL_LABEL[level]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="doc-field-group">
                        <label className="doc-field-label">Mô tả</label>
                        <div className="doc-input-wrapper">
                            <textarea className="doc-custom-textarea" placeholder="Nhập mô tả ngắn về tài liệu..."
                                rows={8} value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="doc-form-submit-row">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Đang lưu..." : mode === "create" ? "Tạo tài liệu" : "Cập nhật"}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}