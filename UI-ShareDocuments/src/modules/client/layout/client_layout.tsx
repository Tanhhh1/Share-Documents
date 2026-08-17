import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Footer } from "./footer";
import "@/styles/client/layout.css";

export default function ClientLayout() {
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