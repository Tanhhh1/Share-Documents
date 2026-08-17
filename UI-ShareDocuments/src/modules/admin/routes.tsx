import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layout/admin_layout";
import AccountPage from "./pages/account";
import CommentPage from "./pages/comment";
import TagPage from "./pages/tag";
import GenSubjectPage from "./pages/category/subject_gen";
import FacultyPage from "./pages/category/faculty";
import MajorPage from "./pages/category/major";
import UniSubjectPage from "./pages/category/subject_uni";
import ProfilePage from "./pages/profile";
import DocumentGroupPage from "./pages/group";
import DocumentPage from "./pages/document/list_document";
import DocumentDetailPage from "./pages/document/detail_document";
import CreateDocumentPage from "./pages/document/create_document";
import MyDocumentPage from "./pages/document/my_document"
import GroupDocumentPage from "./pages/document/group_document";
import EditDocumentPage from "./pages/document/edit_document";

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
        <Route path="document/create" element={<CreateDocumentPage />} />
        <Route path="document/:id/edit" element={<EditDocumentPage />} />
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