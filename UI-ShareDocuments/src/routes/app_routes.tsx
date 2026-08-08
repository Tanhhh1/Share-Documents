import { Routes, Route } from "react-router-dom";
import RequireAdmin from "./require_admin";
import RequireClient from "./require_client";
import SignInPage from "@/modules/client/pages/auth/sign_in";
import SignUpPage from "@/modules/client/pages/auth/sign_up";
import Homepage from "@/modules/client/pages/homepage";
import AdminRoutes from "@/modules/admin/routes";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />

      <Route element={<RequireClient />}>
        <Route path="/" element={<Homepage />} />
      </Route>

      <Route element={<RequireAdmin />}>
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Route>
    </Routes>
  );
}