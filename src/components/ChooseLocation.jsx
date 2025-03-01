import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import WeatherLoader from "./weatherLoader/WeatherLoader";

const API_KEY = "8d62b5015264a920a27dbd465a9a6273";

const fetchCoordinates = async (city) => {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
  const response = await axios.get(url);
  if (response.data.length === 0) throw new Error("City not found");
  return response.data[0];
};

const fetchWeather = async ({ queryKey }) => {
  const [, city] = queryKey;
  const { lat, lon } = await fetchCoordinates(city);
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
};

const ChooseLocation = () => {
  const [city, setCity] = useState("Telavi");
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["weather", city],
    queryFn: fetchWeather,
    refetchOnMount: true, // Forces the data to refetch when component mounts
    refetchOnWindowFocus: false, // Disable refetching when the window is focused
  });

  const { t } = useTranslation();

  useEffect(() => {
    // Optionally, refetch data whenever city changes
    refetch();
  }, [city, refetch]);

  if (isLoading) return <WeatherLoader />;
  if (error)
    return (
      <p className="text-red-500">
        {t("error")}: {error.message}
      </p>
    );

  // Add a guard to ensure data is available
  const weatherData = data?.weather?.[0];
  const temperature = data?.main?.temp;
  const feelsLike = data?.main?.feels_like;
  const windSpeed = data?.wind?.speed;
  const humidity = data?.main?.humidity;
  const visibility = data?.visibility;

  if (!weatherData || temperature === undefined || feelsLike === undefined) {
    return <p className="text-red-500">{t("incomplete-data")}</p>;
  }

  return (
    <div className="flex flex-col bg-white rounded p-4 w-full max-w-[1024px] shadow-lg">
      <h2 className=" mb-2 text-xl text-center">{t("choose-city")}</h2>

      <select
        className="font-bold text-xl bg-slate-100 py-2"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      >
        <option value="Tbilisi">{t("Tbilisi")}</option>
        <option value="Batumi">{t("Batumi")}</option>
        <option value="Kutaisi">{t("Kutaisi")}</option>
        <option value="Zugdidi">{t("Zugdidi")}</option>
        <option value="Rustavi">{t("Rustavi")}</option>
        <option value="Vani">{t("Vani")}</option>
        <option value="Telavi">{t("Telavi")}</option>
        <option value="Mtskheta">{t("Mtskheta")}</option>
        <option value="Gori">{t("Gori")}</option>
        <option value="Khashuri">{t("Khashuri")}</option>
        <option value="Sighnaghi">{t("Sighnaghi")}</option>
        <option value="Mestia">{t("Mestia")}</option>
        <option value="Borjomi">{t("Borjomi")}</option>
        <option value="Poti">{t("Poti")}</option>
        <option value="Akhaltsikhe">{t("Akhaltsikhe")}</option>
        <option value="Ambrolauri">{t("Ambrolauri")}</option>
        <option value="Kobuleti">{t("Kobuleti")}</option>
        <option value="Zestafoni">{t("Zestafoni")}</option>
        <option value="Chkhorotsku">{t("Chkhorotsku")}</option>
      </select>

      <div className="mt-6 text-6xl self-center inline-flex items-center justify-center rounded-lg text-indigo-400 h-24 w-fit">
        <img
          className="w-40"
          src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
          alt={weatherData.description}
        />
      </div>

      <div className="flex flex-row items-center justify-center mt-6">
        <div className="font-medium text-6xl">{temperature.toFixed(1)}°C</div>
        <div className="flex flex-col items-center ml-6">
          <div>{weatherData.description}</div>
        </div>
      </div>

      <div className="flex flex-row justify-between mt-6 text-sm text-gray-500">
        <div className="flex flex-col items-center"></div>
        <div className="flex flex-col items-center">
          <div className="font-medium">{t("feels-like")}</div>
          <div>{feelsLike.toFixed(1)}°C</div>
        </div>
      </div>

      <div className="flex flex-row justify-between mt-6 text-sm text-gray-500">
        <div className="flex flex-col items-center">
          <div className="font-medium">{t("wind")}</div>
          <div>{windSpeed} km/h</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-medium">{t("humidity")}</div>
          <div>{humidity}%</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-medium">{t("visibility")}</div>
          <div>
            {(visibility / 1000).toFixed(1)}
            {t("km")}
          </div>
        </div>
      </div>

      <Link
        to={`/forecast/${encodeURIComponent(city)}`}
        className="text-white text-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-6"
      >
        {t("forecast-next-days")}{" "}
      </Link>
    </div>
  );
};

export default ChooseLocation;
