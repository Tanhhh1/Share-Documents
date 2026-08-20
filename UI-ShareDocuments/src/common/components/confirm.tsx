import { Button } from "@/common/components/button";
import { ErrorAlert } from "@/common/components/error_alert";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    error?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    isLoading = false,
    error,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="confirm-dialog-overlay" onClick={onCancel}>
            <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                <h3 className="confirm-dialog-title">{title}</h3>
                <p className="confirm-dialog-message">{message}</p>
                <ErrorAlert message={error} />
                <div className="confirm-dialog-actions">
                    <Button className="confirm-dialog-cancel" onClick={onCancel} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button className="confirm-dialog-confirm" onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? "Đang xử lý..." : confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}