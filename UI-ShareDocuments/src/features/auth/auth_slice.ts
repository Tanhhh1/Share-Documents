import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CurrentUser } from "./types/auth_type";

interface AuthState {
    accessToken: string | null;
    user: CurrentUser | null;
    isAuthenticated: boolean;
    isInitializing: boolean;
}

const initialState: AuthState = {
    accessToken: null,
    user: null,
    isAuthenticated: false,
    isInitializing: true,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: ( state, action: PayloadAction<{ accessToken: string; user: CurrentUser }> ) => {
            state.accessToken = action.payload.accessToken;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.accessToken = null;
            state.user = null;
            state.isAuthenticated = false;
        },
        setInitializing: (state, action: PayloadAction<boolean>) => {
            state.isInitializing = action.payload;
        },
    },
});

export const { setCredentials, logout, setInitializing } = authSlice.actions;
export default authSlice.reducer;