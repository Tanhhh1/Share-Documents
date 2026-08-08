import { NavLink } from "react-router-dom";
import "@/styles/admin/sidebar.css";

interface MenuItem {
    key: string;
    label: string;
    icon: string;
    path: string;
}

const MENU: MenuItem[] = [
    {
        key: "users",
        label: "Quản lý Tài khoản",
        icon: "bx-user-pin",
        path: "/admin/account",
    },
    {
        key: "education-categories",
        label: "Quản lý Danh mục giáo dục",
        icon: "bx-book-bookmark",
        path: "/admin/education-categories",
    },
    {
        key: "documents",
        label: "Quản lý Tài liệu",
        icon: "bx-file",
        path: "/admin/documents",
    },
    {
        key: "document-groups",
        label: "Quản lý Nhóm tài liệu",
        icon: "bx-folder",
        path: "/admin/document-groups",
    },
    {
        key: "tags",
        label: "Quản lý Thẻ phân loại",
        icon: "bx-tag-alt",
        path: "/admin/tag",
    },
    {
        key: "comments",
        label: "Quản lý Bình luận",
        icon: "bx-comment-detail",
        path: "/admin/comment",
    },
    {
        key: "reports",
        label: "Quản lý Báo cáo",
        icon: "bx-flag",
        path: "/admin/report",
    },
];

interface SidebarProps {
    isOpen: boolean;
    isCollapsed: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, isCollapsed, onClose }: SidebarProps) {
    return (
        <aside className={`admin-sidebar ${isOpen ? "is-open" : ""} ${isCollapsed ? "is-collapsed" : ""}`}>
            <div className="admin-sidebar-brand">
                <span className="admin-sidebar-logo-box">
                    <i className="bx bx-folder"></i>
                </span>
                <span className="admin-sidebar-title">DocxBase</span>
            </div>

            <div className="admin-sidebar-section-label">Danh Mục</div>

            <nav className="admin-sidebar-menu">
                {MENU.map((item) => (
                    <NavLink
                        key={item.key}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) => `admin-menu-item ${isActive ? "active" : ""}`}
                    >
                        <i className={`bx ${item.icon} admin-menu-icon`}></i>
                        <span className="admin-menu-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}