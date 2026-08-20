import { useEffect, useState } from "react";

interface SuccessAlertProps {
    message?: string | null;
}

export function SuccessAlert({ message }: SuccessAlertProps) {
    const [isVisible, setIsVisible] = useState(Boolean(message));

    useEffect(() => {
        setIsVisible(Boolean(message));
    }, [message]);

    const displayMessage = message?.trim() || "Cập nhật dữ liệu thành công";

    if (!isVisible) return null;

    return (
        <div className="success-alert" role="alert">
            <p className="success-alert-message">{displayMessage}</p>
            <button type="button" className="alert-close-btn" aria-label="Đóng thông báo" onClick={() => setIsVisible(false)}>
                ×
            </button>
        </div>
    );
}