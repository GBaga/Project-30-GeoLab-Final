import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchWeatherData } from "../config/api";
import WeatherLoader from "../components/weatherLoader/WeatherLoader";
import Weather from "./Weather";
import { useTranslation } from "react-i18next";

function Forecast() {
  const { city } = useParams();
  const { t } = useTranslation();

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    if (!city) {
      setError("No city provided in the URL.");
      setLoading(false);
      return;
    }

    const fetchWeather = async () => {
      try {
        const data = await fetchWeatherData(city);
        setWeatherData(data);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("ka-GE", {
      timeZone: "Asia/Tbilisi",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString("ka-GE", {
      timeZone: "Asia/Tbilisi",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
  };

  const groupForecastsByDay = (list) => {
    return list.reduce((acc, item) => {
      const date = formatDate(item.dt);
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});
  };

  const renderTableRow = (date, forecasts) => (
    <tr key={date} className="border border-gray-300">
      <td className="border border-gray-300 p-2">{date}</td>
      <td className="border border-gray-300 p-2">
        {forecasts.map((item) => (
          <p className="text-center mb-4 border-b-2" key={item.dt}>
            {formatTime(item.dt)}
          </p>
        ))}
      </td>
      <td className="border border-gray-300 p-2 text-center">
        {forecasts.map((item) => (
          <p className="mb-4 border-b-2" key={item.dt}>
            {item.main.temp.toFixed(1)} °C
          </p>
        ))}
      </td>
      <td className="border border-gray-300 p-2 text-center">
        {forecasts.map((item) => (
          <p className="mb-4 border-b-2" key={item.dt}>
            {item.weather[0].main}
          </p>
        ))}
      </td>
      <td className="border border-gray-300 p-2 text-center mb-4">
        {forecasts.map((item) => (
          <img
            key={item.dt}
            className="w-10 m-auto"
            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
            alt={item.weather[0].description}
          />
        ))}
      </td>
    </tr>
  );

  if (loading) return <WeatherLoader />;
  if (error)
    return (
      <p>
        {t("error")}: {error}
      </p>
    );

  const groupedByDay = weatherData ? groupForecastsByDay(weatherData.list) : {};

  return (
    <div>
      <div className="pt-10 px-10 mb-4 text-xl font-extrabold text-gray-900 dark:text-white md:text-2xl lg:text-3xl">
        <h2>{t("forecast-next-days")}</h2>
        <h3>
          {t("location")}: {weatherData?.city?.name || t("unreachable")}
        </h3>
      </div>

      <div className="flex justify-center p-6 md:px-0">
        <button
          onClick={() => setShowTable((prev) => !prev)}
          className="px-6 py-2 bg-blue-500 text-white font-bold rounded w-full"
        >
          {showTable ? t("hide-forecast") : t("show-forecast")}
        </button>
      </div>

      {showTable && (
        <table className="w-full my-4 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">{t("date")}</th>
              <th className="border border-gray-300 p-2">{t("time")}</th>
              <th className="border border-gray-300 p-2">{t("temp")} (°C)</th>
              <th className="border border-gray-300 p-2">{t("weather")}</th>
              <th className="border border-gray-300 p-2">{t("icon")}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedByDay).map(([date, forecasts]) =>
              renderTableRow(date, forecasts)
            )}
          </tbody>
        </table>
      )}

      <Weather />
    </div>
  );
}

export default Forecast;
