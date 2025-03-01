import { useMemo } from "react";
import axios from "axios";
import Papa from "papaparse";
import WeatherLoader from "../components/weatherLoader/WeatherLoader";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// Helper function to parse weather data
const parseWeatherData = (csvData) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const formattedData = {};

        result.data.forEach(({ dt_iso, temp }) => {
          if (!dt_iso || !temp) return;

          const [year, month] = dt_iso.split(" ")[0].split("-");

          if (!formattedData[year]) formattedData[year] = {};
          if (!formattedData[year][month])
            formattedData[year][month] = { total: 0, count: 0 };

          formattedData[year][month].total += parseFloat(temp);
          formattedData[year][month].count += 1;
        });

        // Compute the averages
        Object.keys(formattedData).forEach((year) => {
          Object.keys(formattedData[year]).forEach((month) => {
            formattedData[year][month] =
              formattedData[year][month].total /
              formattedData[year][month].count;
          });
        });

        resolve(formattedData);
      },
      error: (err) => reject(err),
    });
  });
};

// Fetch function for weather data
const fetchWeatherData = async () => {
  const response = await axios.get("/assets/weather.csv");
  return parseWeatherData(response.data);
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

  const months = useMemo(() => {
    return [
      { key: "01", label: t("months.0") },
      { key: "02", label: t("months.1") },
      { key: "03", label: t("months.2") },
      { key: "04", label: t("months.3") },
      { key: "05", label: t("months.4") },
      { key: "06", label: t("months.5") },
      { key: "07", label: t("months.6") },
      { key: "08", label: t("months.7") },
      { key: "09", label: t("months.8") },
      { key: "10", label: t("months.9") },
      { key: "11", label: t("months.10") },
      { key: "12", label: t("months.11") },
    ];
  }, [t]);

  const years = useMemo(
    () =>
      Array.from({ length: 2025 - 1979 + 1 }, (_, i) => (2025 - i).toString()),
    []
  );

  const getTemperatureColor = useMemo(
    () => (currentTemp, previousTemp) => {
      if (previousTemp === null) return "black";
      const change = currentTemp - previousTemp;
      if (change > 0) {
        const redIntensity = Math.min(255, 255 * (change / 10));
        return `rgb(${redIntensity}, 0, 0)`;
      } else if (change < 0) {
        const blueIntensity = Math.min(255, 255 * (-change / 10));
        return `rgb(0, 0, ${blueIntensity})`;
      }
      return "black";
    },
    []
  );

  // Conditional rendering based on loading and error state
  if (isLoading) {
    return <WeatherLoader />;
  }

  if (isError) {
    return <div>{t("failed-load")}</div>;
  }

  if (!weatherData) {
    return <div>{t("no-weather-data")}</div>;
  }

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
                        style={{
                          color: currentMonthTemp ? color : "black",
                        }}
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
