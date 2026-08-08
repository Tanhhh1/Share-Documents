import { useSelector } from "react-redux";
import type { RootState } from "@/app/store/store";

export default function HomePage() {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <p>Xin chào {user?.fullName ?? user?.username}, bạn đã đăng nhập với vai trò {user?.roles.join(", ")}</p>
        </div>
    );
}