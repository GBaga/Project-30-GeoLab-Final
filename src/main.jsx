import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import Geocode from "./components/Geocode.jsx";
import CurrentWeather from "./pages/CurrentWeather.jsx";
import MainLayout from "./components/MainLayout.jsx";
import History from "./pages/History.jsx";
import DailyTemp from "./pages/DailyTemp.jsx";
import Forecast from "./pages/Forecast.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<CurrentWeather />} />
          <Route path="/geocode" element={<Geocode />} />
          <Route path="/forecast" element={<Forecast />} />
          <Route path="/history" element={<History />} />
          <Route path="/detailed-history" element={<DailyTemp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
