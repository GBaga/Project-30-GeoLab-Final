import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./i18n.js";

import "./index.css";
import Home from "./pages/Home.jsx";
import MainLayout from "./components/MainLayout.jsx";
import History from "./pages/History.jsx";
import DetailedHistory from "./pages/DetailedHistory.jsx";
import Forecast from "./pages/Forecast.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/forecast/:city" element={<Forecast />} />
            <Route path="/history" element={<History />} />
            <Route path="/detailed-history" element={<DetailedHistory />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
