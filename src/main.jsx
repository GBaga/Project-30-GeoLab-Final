import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.jsx";
import Geocode from "./components/Geocode.jsx";
import CurrentWeather from "./pages/currentWeather/CurrentWeather.jsx";
import MainLayout from "./components/MainLayout.jsx";
import History from "./pages/history/History.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<App />} />
          <Route path="/geocode" element={<Geocode />} />
          <Route path="/currentWeather" element={<CurrentWeather />} />
          <Route path="/history" element={<History />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
