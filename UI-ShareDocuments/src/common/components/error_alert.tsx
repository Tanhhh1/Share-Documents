import { useEffect, useState } from "react";

interface ErrorAlertProps {
    message?: string | null;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
    const [isVisible, setIsVisible] = useState(Boolean(message));

    useEffect(() => {
        setIsVisible(Boolean(message));
    }, [message]);

    if (!isVisible || !message) return null;

    return (
        <div className="error-alert" role="alert">
            <p className="error-alert-message">{message}</p>
            <button type="button" className="alert-close-btn" aria-label="Đóng thông báo" onClick={() => setIsVisible(false)} >
                ×
            </button>
        </div>
    );
}