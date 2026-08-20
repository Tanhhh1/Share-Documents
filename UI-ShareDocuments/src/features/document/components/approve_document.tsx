import { type FormEvent } from "react";
import { Modal } from "@/common/components/modal";
import { Button } from "@/common/components/button";
import { ErrorAlert } from "@/common/components/error_alert";
import { getGeneralErrors } from "@/common/utils/api_error";
import { DocumentInfo } from "./document_info";
import type { DocumentDetailDto } from "../document_type";
import type { FieldError } from "@/common/types/api_result_type";

interface ApproveDocumentDialogProps {
    isOpen: boolean;
    document?: DocumentDetailDto;
    isLoading?: boolean;
    apiErrors?: FieldError[] | null;
    onClose: () => void;
    onConfirm: () => void;
}

export function ApproveDocumentDialog({
    isOpen,
    document,
    isLoading = false,
    apiErrors,
    onClose,
    onConfirm,
}: ApproveDocumentDialogProps) {
    if (!document) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onConfirm();
    };

    return (
        <Modal isOpen={isOpen} title="Phê duyệt tài liệu" onClose={onClose}>
            <form className="data-form" onSubmit={handleSubmit}>
                <ErrorAlert message={getGeneralErrors(apiErrors)} />

                <DocumentInfo document={document} />

                <p className="approve-note">
                    Bạn có chắc chắn muốn phê duyệt tài liệu này không?
                </p>

                <div className="data-form-actions">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Đang xử lý..." : "Phê duyệt"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}