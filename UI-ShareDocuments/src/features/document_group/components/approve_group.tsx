import { Modal } from "@/common/components/modal";
import { Button } from "@/common/components/button";
import { ErrorAlert } from "@/common/components/error_alert";
import { getGeneralErrors } from "@/common/utils/api_error";
import { GroupInfoSummary } from "./group_info";
import type { GroupDto } from "../group_type";
import type { FieldError } from "@/common/types/api_result_type";

interface ApproveGroupDialogProps {
    isOpen: boolean;
    group?: GroupDto;
    isLoading?: boolean;
    apiErrors?: FieldError[] | null;
    onClose: () => void;
    onConfirm: () => void;
}

export function ApproveGroupDialog({ isOpen, group, isLoading = false, apiErrors, onClose, onConfirm }: ApproveGroupDialogProps) {
    if (!group) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm();
    };

    return (
        <Modal isOpen={isOpen} title="Duyệt nhóm chủ đề" onClose={onClose}>
            <form className="data-form" onSubmit={handleSubmit}>
                <ErrorAlert message={getGeneralErrors(apiErrors)} />

                <GroupInfoSummary group={group} />

                <p className="approve-note">
                    Duyệt nhóm chủ đề này sẽ đồng thời duyệt các tài liệu đang chờ duyệt thuộc nhóm.
                </p>

                <div className="data-form-actions">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Đang xử lý..." : "Duyệt"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}