export const endpoints = {
    auth: {
        signIn: "/auth/sign-in",
        signUp: "/auth/sign-up",
        refresh: "/auth/refresh",
        revoke: "/auth/revoke",
    },
    account: {
        list: "/admin/account",
        create: "/admin/account",
        detail: (id: number) => `/admin/account/${id}`,
        update: (id: number) => `/admin/account/${id}`,
        lock: (id: number) => `/admin/account/lock/${id}`,
        unlock: (id: number) => `/admin/account/unlock/${id}`,
    },
    report: {
        list: "/admin/report",
    },
    comment: {
        list: "/admin/comment",
        hide: (id: number) => `/admin/comment/hide/${id}`,
        unhide: (id: number) => `/admin/comment/unhide/${id}`,
    },
    tag: {
        list: "/admin/tag",
        detail: (id: number) => `/admin/tag/${id}`,
        create: "/admin/tag",
        update: (id: number) => `/admin/tag/${id}`,
        delete: (id: number) => `/admin/tag/delete/${id}`,
        restore: (id: number) => `/admin/tag/restore/${id}`,
    },
};  