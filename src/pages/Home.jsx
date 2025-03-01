import { useState, useEffect } from "react";
import axios from "axios";
import WeatherLoader from "../components/weatherLoader/WeatherLoader";
import { Link } from "react-router";
import ChooseLocation from "../components/ChooseLocation";
import { useTranslation } from "react-i18next";

const API_KEY = "cc0e6ec727472b3e6b3b3f227a8e69c5";
const locations = [
  { name: "Matani, GE", lat: "42.07", lon: "45.20" },
  { name: "Tbilisi", lat: "41.6941", lon: "44.8337" },
];

const Home = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const dataPromises = locations.map(async (location) => {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather`,
            {
              params: {
                lat: location.lat,
                lon: location.lon,
                appid: API_KEY,
                units: "metric",
              },
            }
          );
          return { ...response.data, city: location.name };
        });

        const results = await Promise.all(dataPromises);
        setWeatherData(results);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchWeatherData();
  }, []);

  return (
    <div className="min-h-fit flex flex-wrap justify-center gap-6 p-6 bg-gray-100">
      {error && <p className="text-red-500">Error: {error}</p>}
      {weatherData.length > 0 ? (
        weatherData.map((weather, index) => (
          <div
            key={index}
            className="flex flex-col bg-white rounded p-4 w-full max-w-[500px] shadow-lg"
          >
            <div className="font-bold text-xl">
              {weather.city} / {weather.name}
            </div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString("ka-GE", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              <div>
                {new Date().toLocaleTimeString("ka-GE", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hourCycle: "h23",
                })}
              </div>
            </div>
            <div className="mt-6 text-6xl self-center inline-flex items-center justify-center rounded-lg text-indigo-400 h-24 w-fit">
              <img
                className="w-40"
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
            </div>
            <div className="flex flex-row items-center justify-center mt-6">
              <div className="font-medium text-6xl">
                {weather.main.temp.toFixed(1)}°C
              </div>
              <div className="flex flex-col items-center ml-6">
                <div>{weather.weather[0].description}</div>
              </div>
            </div>

            <div className="flex flex-row justify-between mt-6 text-sm text-gray-500">
              <div className="flex flex-col items-center"></div>
              <div className="flex flex-col items-center">
                <div className="font-medium">{t("feels-lie")}</div>
                <div>{weather.main.feels_like.toFixed(1)}°C</div>
              </div>
            </div>

            <div className="flex flex-row justify-between mt-6 text-sm text-gray-500">
              <div className="flex flex-col items-center">
                <div className="font-medium">{t("wind")}</div>
                <div>
                  {weather.wind.speed} {t("km/h")}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-medium">{t("humidity")}</div>
                <div>{weather.main.humidity}%</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-medium">{t("visibility")}</div>
                <div>{(weather.visibility / 1000).toFixed(1)} km</div>
              </div>
            </div>
            <Link
              to={`/forecast/${weather.city}`}
              type="button"
              className="text-white text-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-6 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            >
              {t("forecast-next-days")}
            </Link>
          </div>
        ))
      ) : (
        <WeatherLoader />
      )}

      <ChooseLocation />
    </div>
  );
};

export default Home;
