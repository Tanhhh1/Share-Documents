import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layout/admin_layout";
import Dashboard from "./pages/dashboard";
import AccountPage from "./pages/account";
import ReportPage from "./pages/report";
import CommentPage from "./pages/comment";
import TagPage from "./pages/tag";
import GenSubjectPage from "./pages/subject_gen";
import FacultyPage from "./pages/faculty";
import MajorPage from "./pages/major";
import UniSubjectPage from "./pages/subject_uni";

import "@/styles/admin/page.css";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="account" element={<AccountPage />} />
        <Route path="report" element={<ReportPage />} />
        <Route path="comment" element={<CommentPage />} />
        <Route path="tag" element={<TagPage />} />

        <Route path="subject/general" element={<GenSubjectPage />} />
        <Route path="faculty" element={<FacultyPage />} />
        <Route path="faculty/:facultyId/major" element={<MajorPage />} />
        <Route path="major/:majorId/subject" element={<UniSubjectPage />} />

        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>
    </Routes>
  );
}