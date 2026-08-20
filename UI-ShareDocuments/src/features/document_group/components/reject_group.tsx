import { useState, useEffect, type FormEvent } from "react";
import { Modal } from "@/common/components/modal";
import { Button } from "@/common/components/button";
import { ErrorAlert } from "@/common/components/error_alert";
import { getGeneralErrors } from "@/common/utils/api_error";
import { GroupInfoSummary } from "./group_info";
import type { GroupDto } from "../group_type";
import type { FieldError } from "@/common/types/api_result_type";

interface RejectGroupDialogProps {
    isOpen: boolean;
    group?: GroupDto;
    isLoading?: boolean;
    apiErrors?: FieldError[] | null;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

export function RejectGroupDialog({ isOpen, group, isLoading = false, apiErrors, onClose, onConfirm }: RejectGroupDialogProps) {
    const [reason, setReason] = useState("");
    const [error, setError] = useState<string | undefined>();

    useEffect(() => {
        if (isOpen) {
            setReason("");
            setError(undefined);
        }
    }, [isOpen]);

    if (!group) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) {
            setError("Vui lòng nhập lý do từ chối");
            return;
        }
        onConfirm(reason.trim());
    };

    return (
        <Modal isOpen={isOpen} title="Từ chối nhóm chủ đề" onClose={onClose}>
            <form className="modal-form" onSubmit={handleSubmit}>
                <ErrorAlert message={getGeneralErrors(apiErrors)} />

                <GroupInfoSummary group={group} />

                <div className="form-group">
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