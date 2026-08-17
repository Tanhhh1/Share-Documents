import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { RootState } from "@/app/store/store";
import { useLogout } from "@/features/auth/use_auth";

export function Header() {
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
        navigate("/profile");
    };

    const handleNavigateMyDocument = () => {
        setMenuOpen(false);
        navigate("/my-document");
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
                    <button type="button" className="client-header-action-btn" onClick={() => navigate("/upload")}>
                        <i className="bx bx-upload"></i>
                        <span>Upload</span>
                    </button>

                    <button type="button" className="client-header-action-btn" onClick={() => navigate("/bookmark")}>
                        <i className="bx bx-bookmark"></i>
                        <span>Save</span>
                    </button>

                    <button type="button" className="client-header-upgrade-btn" onClick={() => navigate("/membership")}>
                        <i className="bx bx-crown"></i>
                        <span>Nâng cấp Member</span>
                    </button>

                    {user ? (
                        <div className="client-header-user" ref={menuRef}>
                            <button type="button" className="client-header-user-btn" onClick={() => setMenuOpen((prev) => !prev)}>
                                <div className="client-header-avatar">{(user?.fullName ?? "U").charAt(0).toUpperCase()}</div>
                                <span className="client-header-user-name">{user?.fullName ?? "Người dùng"}</span>
                                <i className={`bx bx-chevron-down client-header-caret ${isMenuOpen ? "is-open" : ""}`}></i>
                            </button>

                            {isMenuOpen && (
                                <div className="client-header-dropdown">
                                    <button type="button" className="client-header-dropdown-item" onClick={handleNavigateProfile}>
                                        <i className="bx bx-user"></i>
                                        Hồ sơ của tôi
                                    </button>
                                    <button type="button" className="client-header-dropdown-item" onClick={handleNavigateMyDocument}>
                                        <i className="bx bx-file"></i>
                                        Tài liệu của tôi
                                    </button>
                                    <button
                                        type="button"
                                        className="client-header-dropdown-item client-header-logout"
                                        onClick={() => logout.mutate()}
                                    >
                                        <i className="bx bx-log-out"></i>
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button type="button" className="client-header-login-btn" onClick={() => navigate("/login")}>
                            <i className="bx bx-log-in"></i>
                            <span>Đăng nhập</span>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}