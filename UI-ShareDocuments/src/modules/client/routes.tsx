import { Routes, Route } from "react-router-dom";
import ClientLayout from "./layout/client_layout";
import HomePage from "./pages/homepage";
import DocumentSearchPage from "./pages/document/result_document";
import DocumentDetailPage from "./pages/document/detail_document";
import BookmarkPage from "./pages/document/bookmark";
import CreateDocumentPage from "./pages/document/create_document";
import EditDocumentPage from "./pages/document/edit_document";
import MembershipPage from "./pages/membership";
import MyDocumentPage from "./pages/document/my_document";
import PublishedGroupPage from "./pages/group/list_group"
import MyGroupPage from "./pages/group/my_group";
import ProfilePage from "./pages/profile";
import NotificationsPage from "./pages/notification";

import "@/styles/home.css"
import "@/styles/client_layout.css"
import "@/styles/membership.css"
import "@/styles/notification.css"

export default function ClientRoutes() {
    return (
        <Routes>
            <Route element={<ClientLayout />}>
                <Route index element={<HomePage />} />
                <Route path="document" element={<DocumentSearchPage />} />
                <Route path="document/:id" element={<DocumentDetailPage />} />
                <Route path="bookmark" element={<BookmarkPage />} />
                <Route path="upload" element={<CreateDocumentPage />} />
                <Route path="document/:id/edit" element={<EditDocumentPage />} />
                <Route path="membership" element={<MembershipPage />} />
                <Route path="my-document" element={<MyDocumentPage />} />
                <Route path="group" element={<PublishedGroupPage />} />
                <Route path="my-group" element={<MyGroupPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="notifications" element={<NotificationsPage />} />
            </Route>
        </Routes>
    );
}