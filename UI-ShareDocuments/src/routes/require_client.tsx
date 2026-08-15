import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store/store";

export default function RequireClient() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const user = useSelector((state: RootState) => state.auth.user);

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    const isPrivileged = user?.isAdmin || user?.isModerator;
    if (isPrivileged) {
        return <Navigate to="/admin/document" replace />;
    }

    return <Outlet />;
}