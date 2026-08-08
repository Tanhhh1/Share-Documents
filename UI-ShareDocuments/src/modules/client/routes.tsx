import { Routes, Route } from "react-router-dom";
import ClientLayout from "./layout/client_layout";
import HomePage from "./pages/homepage";

export default function ClientRoutes() {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route index element={<HomePage />} />
      </Route>
    </Routes>
  );
}