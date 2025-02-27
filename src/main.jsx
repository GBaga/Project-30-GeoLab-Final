import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./index.css";
import Geocode from "./components/Geocode.jsx";
import CurrentWeather from "./pages/CurrentWeather.jsx";
import MainLayout from "./components/MainLayout.jsx";
import History from "./pages/History.jsx";
import DailyTemp from "./pages/DailyTemp.jsx";
import Forecast from "./pages/Forecast.jsx";
import Geocodetest from "./components/Geocodetest.jsx";

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
            <Route path="/" element={<CurrentWeather />} />
            <Route path="/geocode" element={<Geocode />} />
            <Route path="/geocodetest" element={<Geocodetest />} />

            <Route path="/forecast/:city" element={<Forecast />} />
            <Route path="/history" element={<History />} />
            <Route path="/detailed-history" element={<DailyTemp />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
