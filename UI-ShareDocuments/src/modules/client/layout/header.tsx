import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import type { RootState } from "@/app/store/store";
import { useLogout } from "@/features/auth/use_auth";

export function Header() {
    const user = useSelector((state: RootState) => state.auth.user);
    const logout = useLogout();
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

    const handleLogout = () => {
        setMenuOpen(false);
        logout.mutate();
    };

    return (
        <header className="client-header">
            <div className="client-header-inner">
                <Link to="/" className="client-header-brand">
                    <span className="client-header-logo-box">
                        <i className="bx bx-folder"></i>
                    </span>
                    <span className="client-header-title">DocxBase</span>
                </Link>

                <div className="client-header-actions">
                    <NavLink to="/upload" className={({ isActive }) => `client-header-action-btn ${isActive ? "active" : ""}`}>
                        <i className="bx bx-upload"></i>
                        <span>Upload</span>
                    </NavLink>

                    <NavLink to="/group" className={({ isActive }) => `client-header-action-btn ${isActive ? "active" : ""}`}>
                        <i className="bx bx-folder"></i>
                        <span>Nhóm tài liệu</span>
                    </NavLink>

                    <NavLink to="/membership" className={({ isActive }) => `client-header-upgrade-btn ${isActive ? "active" : ""}`}>
                        <i className="bx bx-crown"></i>
                        <span>Nâng cấp Member</span>
                    </NavLink>

                    {user ? (
                        <div className="client-header-user" ref={menuRef}>
                            <button type="button" className="client-header-user-btn" onClick={() => setMenuOpen((prev) => !prev)}>
                                <div className="client-header-avatar">{(user?.fullName ?? "U").charAt(0).toUpperCase()}</div>
                                <span className="client-header-user-name">{user?.fullName ?? "Người dùng"}</span>
                                <i className={`bx bx-chevron-down client-header-caret ${isMenuOpen ? "is-open" : ""}`}></i>
                            </button>

                            {isMenuOpen && (
                                <div className="client-header-dropdown">
                                    <Link to="/profile" className="client-header-dropdown-item" onClick={() => setMenuOpen(false)}>
                                        <i className="bx bx-user"></i>
                                        Hồ sơ của tôi
                                    </Link>

                                    <Link to="/my-group" className="client-header-dropdown-item" onClick={() => setMenuOpen(false)}>
                                        <i className="bx bx-folder-open"></i>
                                        Nhóm của tôi
                                    </Link>

                                    <Link to="/my-document" className="client-header-dropdown-item" onClick={() => setMenuOpen(false)}>
                                        <i className="bx bx-file"></i>
                                        Tài liệu của tôi
                                    </Link>

                                    <Link to="/bookmark" className="client-header-dropdown-item" onClick={() => setMenuOpen(false)}>
                                        <i className="bx bx-bookmark"></i>
                                        Tài liệu đã lưu
                                    </Link>

                                    <Link to="/notifications" className="client-header-dropdown-item" onClick={() => setMenuOpen(false)}>
                                        <i className="bx bx-bell"></i>
                                        Thông báo
                                    </Link>

                                    <button type="button" className="client-header-dropdown-item client-header-logout" onClick={handleLogout}>
                                        <i className="bx bx-log-out"></i>
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="client-header-login-btn">
                            <i className="bx bx-log-in"></i>
                            <span>Đăng nhập</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}