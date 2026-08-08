import { Outlet } from "react-router-dom";

export default function ClientLayout() {
  return (
    <div>
      <header className="p-4 border-b">Client Layout</header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}