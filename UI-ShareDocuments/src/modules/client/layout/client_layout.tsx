import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";
import { useNotificationSocket } from "@/features/notification/use_notification_socket";

export default function ClientLayout() {
    useNotificationSocket();
    return (
        <div className="client-layout">
            <Header />
            <main className="client-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}