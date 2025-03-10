import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import WeatherLoader from "../components/weatherLoader/WeatherLoader";
import { useTranslation } from "react-i18next";

const API_KEY = "cc0e6ec727472b3e6b3b3f227a8e69c5";
// const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const fetchWeather = async ({ queryKey }) => {
  const [, city] = queryKey;
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

const processWeatherData = (data) => {
  if (!data || !data.list) return [];

  const dailyData = {};
  data.list.forEach((entry) => {
    const date = new Date(entry.dt * 1000);
    date.setHours(date.getHours() + 4);
    const day = date.toISOString().split("T")[0];

    if (!dailyData[day]) {
      dailyData[day] = {
        tempSum: 0,
        count: 0,
        minTemp: Infinity,
        maxTemp: -Infinity,
        description: "",
        icon: "",
        feelsLike: 0,
        windSpeed: 0,
        humidity: 0,
      };
    }

    dailyData[day].tempSum += entry.main.temp;
    dailyData[day].count++;
    dailyData[day].minTemp = Math.min(
      dailyData[day].minTemp,
      entry.main.temp_min
    );
    dailyData[day].maxTemp = Math.max(
      dailyData[day].maxTemp,
      entry.main.temp_max
    );
    dailyData[day].feelsLike += entry.main.feels_like;
    dailyData[day].windSpeed += entry.wind.speed;
    dailyData[day].humidity += entry.main.humidity;

    if (!dailyData[day].description) {
      dailyData[day].description = entry.weather[0]?.description || "Unknown";
      dailyData[day].icon = entry.weather[0]?.icon || "01d";
    }
  });

  return Object.entries(dailyData)
    .slice(0, 6)
    .map(([day, values]) => ({
      day,
      avgTemp: (values.tempSum / values.count).toFixed(1),
      minTemp: values.minTemp.toFixed(1),
      maxTemp: values.maxTemp.toFixed(1),
      feelsLike: (values.feelsLike / values.count).toFixed(1),
      description: values.description,
      icon: values.icon,
      avgWindSpeed: (values.windSpeed / values.count).toFixed(1),
      avgHumidity: (values.humidity / values.count).toFixed(1),
    }));
};

const Weather = () => {
  const { t } = useTranslation();
  const { city } = useParams();
  const queryClient = useQueryClient();

  if (!city) return <p>{t("city-not-found")}</p>;

  useEffect(() => {
    if (city) queryClient.invalidateQueries(["weather", city]);
  }, [city, queryClient]);

  const { data, error, isLoading } = useQuery({
    queryKey: ["weather", city],
    queryFn: fetchWeather,
    enabled: !!city,
  });

  if (isLoading) return <WeatherLoader />;
  if (error)
    return (
      <p>
        {t("error")}: {error.message}
      </p>
    );
  if (!data || !data.city || !data.city.name)
    return <p>{t("no-data-found")}</p>;

  const dailyForecast = processWeatherData(data);

  return (
    <div>
      <h2 className="pt-10 px-10 mb-4 text-xl font-extrabold text-gray-900 md:text-2xl lg:text-3xl">
        {data.city.name === "Meria" ? "Tbilisi" : data.city.name}{" "}
        {t("forecast")}
      </h2>

      <div className="flex flex-wrap items-center gap-4">
        {dailyForecast.map((item, index) => (
          <div
            key={index}
            className="flex flex-col m-auto bg-white rounded p-4 max-w-[300px] shadow-lg mb-6"
          >
            <div className="font-bold text-xl">{item.day}</div>
            <div className="mt-6 text-6xl self-center inline-flex items-center justify-center rounded-lg text-indigo-400 h-24 w-fit">
              <img
                className="w-40"
                src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                alt={item.description}
              />
            </div>
            <div className="flex flex-row items-center justify-center mt-6">
              <div className="font-medium text-6xl">{item.avgTemp}°C</div>
              <div className="flex flex-col items-center ml-6">
                <div>{item.description}</div>
              </div>
            </div>
            <div className="flex flex-row justify-between mt-6 text-sm text-gray-500">
              <div className="flex flex-col items-center">
                <div className="font-medium">{t("min")}</div>
                <div>{item.minTemp}°C</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-medium">{t("max")}</div>
                <div>{item.maxTemp}°C</div>
              </div>
            </div>
            <div className="flex flex-row justify-between mt-6 text-sm text-center text-gray-500">
              <div className="flex flex-col items-center">
                <div className="font-medium">{t("feels-like")}</div>
                <div>{item.feelsLike}°C</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-medium">{t("wind")}</div>
                <div>
                  {item.avgWindSpeed} {t("km/h")}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-medium">{t("humidity")}</div>
                <div>{item.avgHumidity}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Weather;
