import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from "./App";

import { store } from "@/app/store/store";
import QueryProvider from "@/app/providers/query_provider";
import ToastProvider from "@/app/providers/toast_provider";
import "@/common/api/interceptor";
import "./styles/common.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <Provider store={store}>
            <QueryProvider>
                <App />
                <ToastProvider />
            </QueryProvider>
        </Provider>
    </BrowserRouter>
);