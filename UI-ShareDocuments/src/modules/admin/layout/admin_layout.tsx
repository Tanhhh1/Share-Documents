import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";

export default function AdminLayout() {
    const [isAppOpen, setAppOpen] = useState(false);
    const [isCollapsed, setCollapsed] = useState(false);

    return (
        <div className="admin-layout">
            <Sidebar isOpen={isAppOpen} isCollapsed={isCollapsed} onClose={() => setAppOpen(false)} />
            {isAppOpen && <div className="admin-overlay" onClick={() => setAppOpen(false)} />}

            <div className="admin-main">
                <Navbar onToggleSidebar={() => setAppOpen((prev) => !prev)} onToggleCollapse={() => setCollapsed((prev) => !prev)} />
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}