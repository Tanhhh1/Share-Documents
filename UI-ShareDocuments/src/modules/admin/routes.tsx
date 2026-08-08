import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layout/admin_layout";
import Dashboard from "./pages/dashboard";
import AccountPage from "./pages/account";
import ReportPage from "./pages/report";
import CommentPage from "./pages/comment";
import TagPage from "./pages/tag";
  
export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="report" element={<ReportPage />} />
        <Route path="comment" element={<CommentPage />} />
        <Route path="tag" element={<TagPage />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>
    </Routes>
  );
}