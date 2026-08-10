import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "@/styles/admin/sidebar.css";

interface MenuChildItem {
    key: string;
    label: string;
    path: string;
}

interface MenuItem {
    key: string;
    label: string;
    icon: string;
    path?: string;
    children?: MenuChildItem[];
}

const MENU: MenuItem[] = [
    {
        key: "users",
        label: "Quản lý Tài khoản",
        icon: "bx-user-pin",
        path: "/admin/account",
    },
    {
        key: "education-levels",
        label: "Quản lý Danh mục",
        icon: "bx-book-bookmark",
        children: [
            { key: "general", label: "Phổ thông", path: "/admin/subject/general" },
            { key: "university", label: "Đại học", path: "/admin/faculty" },
        ],
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
    const location = useLocation();

    const [expandedKey, setExpandedKey] = useState<string | null>(() => {
        const activeParent = MENU.find((item) => item.children?.some((child) => location.pathname.startsWith(child.path)));
        return activeParent?.key ?? null;
    });

    const toggleExpand = (key: string) => {
        setExpandedKey((prev) => (prev === key ? null : key));
    };

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
                {MENU.map((item) => {
                    if (item.children) {
                        const isExpanded = expandedKey === item.key;
                        const isChildActive = item.children.some((child) => location.pathname.startsWith(child.path));

                        return (
                            <div key={item.key} className="admin-menu-group">
                                <button type="button" className={`admin-menu-item ${isChildActive ? "active" : ""}`} onClick={() => toggleExpand(item.key)} >
                                    <i className={`bx ${item.icon} admin-menu-icon`}></i>
                                    <span className="admin-menu-label">{item.label}</span>
                                    <i className={`bx bx-chevron-down admin-menu-chevron ${isExpanded ? "expanded" : ""}`}></i>
                                </button>

                                {isExpanded && !isCollapsed && (
                                    <div className="admin-submenu">
                                        {item.children.map((child) => (
                                            <NavLink
                                                key={child.key}
                                                to={child.path}
                                                onClick={onClose}
                                                className={({ isActive }) => `admin-submenu-item ${isActive ? "active" : ""}`}
                                            >
                                                {child.label}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <NavLink
                            key={item.key}
                            to={item.path!}
                            onClick={onClose}
                            className={({ isActive }) => `admin-menu-item ${isActive ? "active" : ""}`}
                        >
                            <i className={`bx ${item.icon} admin-menu-icon`}></i>
                            <span className="admin-menu-label">{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
}