import { Routes, Route } from "react-router-dom";
import ClientLayout from "./layout/client_layout";

export default function ClientRoutes() {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
      </Route>
    </Routes>
  );
}