import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import WeatherLoader from "../components/weatherLoader/WeatherLoader";
import Weather from "./Weather";
import { useTranslation } from "react-i18next";

function Forecast() {
  const { city } = useParams(); // Get city from URL
  const [weatherData, setWeatherData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTable, setShowTable] = useState(false);

  const API_KEY = "cc0e6ec727472b3e6b3b3f227a8e69c5";

  const { t } = useTranslation();

  useEffect(() => {
    if (!city) {
      setError("No city provided in the URL.");
      setLoading(false);
      return;
    }

    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );

        setWeatherData(response.data);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  if (loading) return <WeatherLoader />;
  if (error)
    return (
      <p>
        {t("error")}: {error}
      </p>
    );

  // Group forecasts by day
  const groupedByDay = weatherData.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString("ka-GE", {
      timeZone: "Asia/Tbilisi",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <div>
      <div className="pt-10 px-10">
        <h2>{t("forecast-next-days")}</h2>
        <h3>
          {t("location")}: {weatherData?.city?.name || t("unreachable")}
        </h3>
      </div>

      <div className="flex justify-center p-6  md:px-0">
        <button
          onClick={() => setShowTable(!showTable)}
          className="px-6 py-2 bg-blue-500 text-white font-bold rounded  w-full "
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
            {Object.entries(groupedByDay).map(([date, forecasts]) => (
              <tr key={date} className="border border-gray-300">
                <td className="border border-gray-300 p-2">{date}</td>
                <td className="border border-gray-300 p-2">
                  {forecasts.map((item) => {
                    const time = new Date(item.dt * 1000).toLocaleTimeString(
                      "ka-GE",
                      {
                        timeZone: "Asia/Tbilisi",
                        hour: "2-digit",
                        minute: "2-digit",
                        hourCycle: "h23",
                      }
                    );
                    return (
                      <p className="text-center mb-4 border-b-2" key={item.dt}>
                        {time}
                      </p>
                    );
                  })}
                </td>
                <td className="border border-gray-300 p-2 text-center ">
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
            ))}
          </tbody>
        </table>
      )}
      <Weather />
    </div>
  );
}

export default Forecast;
