import { useState, useEffect, type FormEvent } from "react";
import { Modal } from "@/common/components/modal";
import { Button } from "@/common/components/button";
import { ErrorAlert } from "@/common/components/error_alert";
import { getGeneralErrors } from "@/common/utils/api_error";
import { DocumentInfo } from "./document_info";
import type { DocumentDetailDto } from "../document_type";
import type { FieldError } from "@/common/types/api_result_type";

interface RejectDocumentDialogProps {
    isOpen: boolean;
    document?: DocumentDetailDto;
    isLoading?: boolean;
    apiErrors?: FieldError[] | null;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

export function RejectDocumentDialog({
    isOpen,
    document,
    isLoading = false,
    apiErrors,
    onClose,
    onConfirm,
}: RejectDocumentDialogProps) {
    const [reason, setReason] = useState("");
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        if (isOpen) {
            setReason("");
            setError(undefined);
        }
    }, [isOpen]);

    if (!document) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) {
            setError("Vui lòng nhập lý do từ chối");
            return;
        }
        onConfirm(reason.trim());
    };

    return (
        <Modal isOpen={isOpen} title="Từ chối tài liệu" onClose={onClose}>
            <form className="data-form" onSubmit={handleSubmit}>
                <ErrorAlert message={getGeneralErrors(apiErrors)} />

                <DocumentInfo document={document} />

                <div className="form-group" style={{ marginTop: "16px" }}>
                    <label className="form-label">
                        Lý do từ chối <span className="required">*</span>
                    </label>
                    <textarea className={`custom-input ${error ? "has-error" : ""}`}
                        rows={4} placeholder="Nhập lý do từ chối..." value={reason}
                        onChange={(e) => {
                            setReason(e.target.value);
                            setError(undefined);
                        }}
                    />
                    {error && <p className="input-error-message">{error}</p>}
                </div>

                <div className="data-form-actions">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Đang xử lý..." : "Từ chối"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}