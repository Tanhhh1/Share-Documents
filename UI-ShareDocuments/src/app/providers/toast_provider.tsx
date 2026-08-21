import { Toaster } from "sonner";

export default function ToastProvider() {
    return (
        <Toaster
            richColors
            position="top-right"
            toastOptions={{
                classNames: {
                    toast: "notification-toast",
                },
            }}
        />
    );
}