import { Routes, Route } from "react-router-dom";
import ClientLayout from "./layout/client_layout";
import HomePage from "./pages/homepage";
import DocumentSearchPage from "./pages/document/document";

export default function ClientRoutes() {
    return (
        <Routes>
            <Route element={<ClientLayout />}>
                <Route index element={<HomePage />} />
                <Route path="document" element={<DocumentSearchPage />} />
            </Route>
        </Routes>
    );
}