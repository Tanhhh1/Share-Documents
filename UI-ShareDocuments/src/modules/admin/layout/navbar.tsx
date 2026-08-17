import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/app/store/store";
import { useLogout } from "@/features/auth/use_auth";

interface NavbarProps {
    onToggleSidebar: () => void;
    onToggleCollapse: () => void;
}

export function Navbar({ onToggleSidebar, onToggleCollapse }: NavbarProps) {
    const user = useSelector((state: RootState) => state.auth.user);
    const logout = useLogout();
    const navigate = useNavigate();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNavigateProfile = () => {
        setMenuOpen(false);
        navigate("/admin/profile");
    };

    const handleNavigateMyDocument = () => {
        setMenuOpen(false);
        navigate("/admin/my-document");
    };

    return (
        <header className="admin-navbar">
            <div className="admin-navbar-left">
                <button type="button" className="admin-navbar-icon-btn admin-navbar-mobile-toggle" onClick={onToggleSidebar}>
                    <i className="bx bx-menu"></i>
                </button>
                <button type="button" className="admin-navbar-icon-btn admin-navbar-collapse-toggle" onClick={onToggleCollapse}>
                    <i className="bx bx-menu-alt-left"></i>
                </button>
            </div>

            <div className="admin-navbar-right" ref={menuRef}>
                <button type="button" className="admin-navbar-user" onClick={() => setMenuOpen((prev) => !prev)}>
                    <div className="admin-navbar-user-info">
                        <span className="admin-navbar-user-name">{user?.fullName ?? "Người dùng"}</span>
                        <span className="admin-navbar-user-role">{user?.username ?? ""}</span>
                    </div>
                    <div className="admin-navbar-avatar">{(user?.fullName ?? "U").charAt(0).toUpperCase()}</div>
                    <i className={`bx bx-chevron-down admin-navbar-caret ${isMenuOpen ? "is-open" : ""}`}></i>
                </button>

                {isMenuOpen && (
                    <div className="admin-navbar-dropdown">
                        <button type="button" className="admin-navbar-dropdown-item" onClick={handleNavigateProfile}>
                            <i className="bx bx-user"></i>
                            Hồ sơ của tôi
                        </button>
                        <button type="button" className="admin-navbar-dropdown-item" onClick={handleNavigateMyDocument}>
                            <i className="bx bx-file"></i>
                            Tài liệu của tôi
                        </button>
                        <button type="button" className="admin-navbar-dropdown-item admin-navbar-logout" onClick={() => logout.mutate()}>
                            <i className="bx bx-log-out"></i>
                            Đăng xuất
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}