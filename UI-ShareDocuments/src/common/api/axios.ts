import axios from "axios";
import { env } from "@/config/env";

export const api = axios.create({
    baseURL: env.apiUrl,
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});