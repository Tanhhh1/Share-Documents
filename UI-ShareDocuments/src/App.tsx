import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store/store";
import { setInitializing } from "@/features/auth/auth_slice";
import { refreshToken } from "@/features/auth/refresh_manager";
import { AppRoutes } from "@/routes/app_routes";

import "@/styles/auth.css"
import "@/styles/components.css"
import "@/styles/page.css"
import "@/styles/form.css"
import "@/styles/document.css"
import "@/styles/detail.css"
import "@/styles/profile.css"

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const isInitializing = useSelector((state: RootState) => state.auth.isInitializing);

  useEffect(() => {
    refreshToken().finally(() => {
      dispatch(setInitializing(false));
    });
  }, [dispatch]);

  if (isInitializing) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p className="loading-text">Đang tải...</p>
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;