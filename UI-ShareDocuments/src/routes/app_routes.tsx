import { Routes, Route } from "react-router-dom";
import RequireAdmin from "./require_admin";
import RequireClient from "./require_client";
import SignInPage from "@/modules/client/pages/auth/sign_in";
import SignUpPage from "@/modules/client/pages/auth/sign_up";
import ForgotPasswordPage from "@/modules/client/pages/auth/forgot_pw";
import VerifyOtpPage from "@/modules/client/pages/auth/verify_otp";
import ResetPasswordPage from "@/modules/client/pages/auth/reset_pw";
import AdminRoutes from "@/modules/admin/routes";
import ClientRoutes from "@/modules/client/routes";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<RequireClient />}>
        <Route path="/*" element={<ClientRoutes />} />
      </Route>

      <Route element={<RequireAdmin />}>
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Route>
    </Routes>
  );
}