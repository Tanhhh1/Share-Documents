import "@/styles/component/error.css"

interface ErrorAlertProps {
    message?: string | null;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
    if (!message) return null;

    return (
        <div className="error-alert">
            <p className="error-alert-message">{message}</p>
        </div>
    );
}