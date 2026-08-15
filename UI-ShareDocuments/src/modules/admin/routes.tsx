import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layout/admin_layout";
import AccountPage from "./pages/account";
import CommentPage from "./pages/comment";
import TagPage from "./pages/tag";
import GenSubjectPage from "./pages/subject_gen";
import FacultyPage from "./pages/faculty";
import MajorPage from "./pages/major";
import UniSubjectPage from "./pages/subject_uni";
import ProfilePage from "./pages/profile";
import DocumentGroupPage from "./pages/group";
import DocumentPage from "./pages/document";
import DocumentDetailPage from "./pages/detail";
import MyDocumentPage from "./pages/my_document"
import GroupDocumentPage from "./pages/group_document";

import "@/styles/admin/page.css";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="account" element={<AccountPage />} />
        <Route path="comment" element={<CommentPage />} />
        <Route path="tag" element={<TagPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="document-group" element={<DocumentGroupPage />} />
        <Route path="document-group/:groupId/document" element={<GroupDocumentPage />} />
        <Route path="document" element={<DocumentPage />} />
        <Route path="document/:id" element={<DocumentDetailPage />} />
        <Route path="my-document" element={<MyDocumentPage />} />

        <Route path="subject/general" element={<GenSubjectPage />} />
        <Route path="faculty" element={<FacultyPage />} />
        <Route path="faculty/:facultyId/major" element={<MajorPage />} />
        <Route path="major/:majorId/subject" element={<UniSubjectPage />} />

        <Route path="*" element={<Navigate to="/admin/document" replace />} />
      </Route>
    </Routes>
  );
}