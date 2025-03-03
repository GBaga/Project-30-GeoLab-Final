import { useMemo } from "react";
import axios from "axios";
import Papa from "papaparse";
import WeatherLoader from "../components/weatherLoader/WeatherLoader";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

const parseWeatherData = (csvData) =>
  new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const formattedData = {};

        data.forEach(({ dt_iso, temp }) => {
          if (!dt_iso || !temp) return;

          const [year, month] = dt_iso.split(" ")[0].split("-");
          formattedData[year] = formattedData[year] || {};
          formattedData[year][month] = formattedData[year][month] || {
            total: 0,
            count: 0,
          };

          formattedData[year][month].total += parseFloat(temp);
          formattedData[year][month].count += 1;
        });

        Object.keys(formattedData).forEach((year) => {
          Object.keys(formattedData[year]).forEach((month) => {
            formattedData[year][month] =
              formattedData[year][month].total /
              formattedData[year][month].count;
          });
        });

        resolve(formattedData);
      },
      error: reject,
    });
  });

const fetchWeatherData = async () => {
  const { data } = await axios.get("/assets/weather.csv");
  return parseWeatherData(data);
};

const History = () => {
  const { t } = useTranslation();

  const {
    data: weatherData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["weatherData"],
    queryFn: fetchWeatherData,
  });

  const months = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        key: String(i + 1).padStart(2, "0"),
        label: t(`months.${i}`),
      })),
    [t]
  );

  const years = useMemo(
    () => Array.from({ length: 47 }, (_, i) => (2025 - i).toString()),
    []
  );

  const getTemperatureColor = useMemo(
    () => (currentTemp, previousTemp) => {
      if (previousTemp === null) return "black";
      const change = currentTemp - previousTemp;
      const intensity = Math.min(255, 255 * (Math.abs(change) / 10));
      return change > 0 ? `rgb(${intensity}, 0, 0)` : `rgb(0, 0, ${intensity})`;
    },
    []
  );

  if (isLoading) return <WeatherLoader />;
  if (isError) return <div>{t("failed-load")}</div>;
  if (!weatherData) return <div>{t("no-weather-data")}</div>;

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold mb-4">
        {t("matani-monthly-temp")} (°C)
      </h2>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-400 w-full text-sm">
          <thead>
            <tr>
              <th className="border border-gray-400 p-2 bg-gray-200">
                {t("year")}
              </th>
              {months.map(({ key, label }) => (
                <th
                  key={key}
                  className="border border-gray-400 p-2 bg-gray-200"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {years.map((year) => {
              let previousMonthTemp = null;
              return (
                <tr key={year}>
                  <td className="border border-gray-400 p-2 font-bold">
                    {year}
                  </td>
                  {months.map(({ key }) => {
                    const currentMonthTemp = weatherData[year]?.[key];
                    const color = getTemperatureColor(
                      currentMonthTemp,
                      previousMonthTemp
                    );
                    previousMonthTemp = currentMonthTemp;
                    return (
                      <td
                        key={key}
                        className="border border-gray-400 p-2 text-center"
                        style={{ color: currentMonthTemp ? color : "black" }}
                      >
                        {currentMonthTemp
                          ? `${currentMonthTemp.toFixed(1)}°C`
                          : "x"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
