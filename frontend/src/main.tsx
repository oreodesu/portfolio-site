import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { UnauthorizedError } from "./pages/ExpenseApp/auth";
import "./styles/global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 認証切れはリトライしても結果が変わらないため、即座に失敗させてログイン画面へ戻す
      retry: (failureCount, error) => !(error instanceof UnauthorizedError) && failureCount < 2,
      staleTime: 30_000,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
