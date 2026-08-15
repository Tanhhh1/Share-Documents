import { authApi } from "./auth_api";
import { store } from "@/app/store/store";
import { setCredentials, logout } from "./auth_slice";
import { decodeAccessToken } from "./jwt";

let refreshPromise: Promise<string | null> | null = null;
const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("auth-sync") : null;

// Lắng nghe tab khác để đồng bộ trạng thái, tránh mỗi tab tự gọi refresh riêng
channel?.addEventListener("message", (event) => {
    if (event.data?.type === "TOKEN_REFRESHED") {
        store.dispatch(setCredentials({
            accessToken: event.data.accessToken,
            user: event.data.user,
        }));
    }
    if (event.data?.type === "LOGGED_OUT") {
        store.dispatch(logout());
    }
});

export function refreshToken(): Promise<string | null> {
    // Nếu đang có 1 lời gọi refresh chạy dở, mọi nơi khác dùng chung promise này
    // thay vì tự bắn thêm request mới -> loại bỏ race trong cùng 1 tab
    if (refreshPromise) return refreshPromise;

    refreshPromise = authApi
        .refresh()
        .then((data) => {
            if (!data.succeeded || !data.result) {
                store.dispatch(logout());
                channel?.postMessage({ type: "LOGGED_OUT" });
                return null;
            }
            const accessToken = data.result.accessToken;
            const user = decodeAccessToken(accessToken);
            store.dispatch(setCredentials({ accessToken, user }));

            // Báo các tab khác đã có access token mới, không cần tự gọi refresh nữa
            channel?.postMessage({ type: "TOKEN_REFRESHED", accessToken, user });

            return accessToken;
        })
        .catch(() => {
            store.dispatch(logout());
            channel?.postMessage({ type: "LOGGED_OUT" });
            return null;
        })
        .finally(() => {
            refreshPromise = null;
        });

    return refreshPromise;
}