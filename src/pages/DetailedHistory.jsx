import { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
import WeatherLoader from "../components/weatherLoader/WeatherLoader";
import { useTranslation } from "react-i18next";

const DetailedHistory = () => {
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [expandedMonth, setExpandedMonth] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    axios
      .get("/assets/weather.csv")
      .then((response) => {
        Papa.parse(response.data, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const formattedData = {};

            result.data.forEach(({ dt_iso, temp }) => {
              if (!dt_iso || !temp) return;

              const date = new Date(dt_iso);
              date.setHours(date.getHours() + 4); // Convert to UTC+4 (Tbilisi Time)
              const year = date.getUTCFullYear().toString();
              const month = (date.getUTCMonth() + 1)
                .toString()
                .padStart(2, "0");
              const day = date.getUTCDate().toString().padStart(2, "0");
              const hour = date.getUTCHours().toString().padStart(2, "0");

              if (!formattedData[year]) formattedData[year] = {};
              if (!formattedData[year][month]) formattedData[year][month] = {};
              if (!formattedData[year][month][day])
                formattedData[year][month][day] = {
                  total: 0,
                  count: 0,
                  hours: {},
                  previousTemp: null, // Track previous temperature
                };
              if (!formattedData[year][month][day].hours[hour])
                formattedData[year][month][day].hours[hour] = [];

              // Store hourly temperatures
              formattedData[year][month][day].hours[hour].push(
                parseFloat(temp)
              );
              // Calculate total and count for daily average
              formattedData[year][month][day].total += parseFloat(temp);
              formattedData[year][month][day].count += 1;

              // Track temperature change
              const previousTemp = formattedData[year][month][day].previousTemp;
              formattedData[year][month][day].previousTemp = parseFloat(temp);
              formattedData[year][month][day].tempChange =
                previousTemp !== null ? parseFloat(temp) - previousTemp : 0;
            });

            // Compute daily averages
            Object.keys(formattedData).forEach((year) => {
              Object.keys(formattedData[year]).forEach((month) => {
                Object.keys(formattedData[year][month]).forEach((day) => {
                  const dayData = formattedData[year][month][day];
                  dayData.average = dayData.total / dayData.count; // Compute daily average
                });
              });
            });

            setWeatherData(formattedData);
            setLoading(false);
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching CSV:", error);
        setLoading(false);
      });
  }, []);

  const months = t("months", { returnObjects: true });

  const years = Array.from({ length: 2025 - 1979 + 1 }, (_, i) =>
    (2025 - i).toString()
  );
  const days = Array.from({ length: 31 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const getTemperatureColor = (change) => {
    if (change > 0) {
      const redIntensity = Math.min(255, 255 * (change / 10)); // Adjust the red intensity based on change
      return `rgb(${redIntensity}, 0, 0)`; // More red for rising temperature
    } else if (change < 0) {
      const blueIntensity = Math.min(255, 255 * (-change / 10)); // Adjust the blue intensity based on change
      return `rgb(0, 0, ${blueIntensity})`; // More blue for decreasing temperature
    }
    return "black"; // No change
  };

  if (loading) {
    return <WeatherLoader />;
  }

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold mb-4">
        {t("matani-daily-temp")} ({selectedYear}) (°C)
      </h2>
      <h3 className="mb-3">{t("historical-data")}</h3>
      <div className="mb-4">
        <label className="mr-2 font-bold ">{t("choose-year")}</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border p-2 bg-yellow-100"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <h3 className="inline ml-5 italic text-sm">{t("click-on-data")}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-400 w-full text-sm">
          <thead>
            <tr>
              <th
                className="border border-gray-400 p-2 bg-gray-200 block"
                style={{ width: "72px" }}
              >
                {t("month")}
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  className="border border-gray-400 p-2 bg-gray-200"
                  style={{ width: "72px" }}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {months.map((label, index) => {
              const monthKey = (index + 1).toString().padStart(2, "0");
              return (
                <>
                  <tr
                    key={monthKey}
                    onClick={() =>
                      setExpandedMonth(
                        expandedMonth === monthKey ? null : monthKey
                      )
                    }
                    className={`cursor-pointer ${
                      index % 2 === 0 ? "bg-gray-100" : ""
                    }`}
                  >
                    <td
                      className="border border-gray-400 p-2 font-bold block"
                      style={{ width: "72px" }}
                    >
                      {label}
                    </td>
                    {days.map((day) => {
                      const dayData =
                        weatherData[selectedYear]?.[monthKey]?.[day];
                      const change = dayData ? dayData.tempChange : 0;
                      return (
                        <td
                          key={day}
                          className="border border-gray-400 p-2 text-center"
                          style={{
                            width: "72px",
                            color: getTemperatureColor(change), // Dynamic color based on temperature change
                          }}
                        >
                          {dayData?.average
                            ? `${dayData.average.toFixed(1)}°C`
                            : "x"}
                        </td>
                      );
                    })}
                  </tr>
                  {expandedMonth === monthKey && (
                    <tr>
                      <td colSpan={32}>
                        <table className="table-auto  border-gray-400 w-full text-sm mt-2">
                          <thead>
                            <tr>
                              <th
                                className="border border-gray-400 p-2 bg-gray-200 block"
                                style={{ width: "72px" }}
                              >
                                {t("hour")}
                              </th>
                              {days.map((day) => (
                                <th
                                  key={day}
                                  className="border border-gray-400 p-2 bg-gray-200"
                                  style={{ width: "72px" }}
                                >
                                  {day}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {hours.map((hour) => (
                              <tr key={hour}>
                                <td
                                  className="border border-gray-400 p-2 font-bold block"
                                  style={{ width: "72px" }}
                                >
                                  {hour}:00
                                </td>
                                {days.map((day, dayIndex) => {
                                  const dayData =
                                    weatherData[selectedYear]?.[monthKey]?.[
                                      day
                                    ];
                                  const hourData = dayData?.hours?.[hour];
                                  const change = hourData
                                    ? hourData.reduce((a, b) => a + b, 0) /
                                        hourData.length -
                                      (dayData.previousTemp || 0)
                                    : 0;
                                  return (
                                    <td
                                      key={day}
                                      className={`border border-gray-400 p-2 text-center ${
                                        dayIndex % 2 === 0 ? "bg-gray-100" : ""
                                      }`}
                                      style={{
                                        width: "72px",
                                        color: getTemperatureColor(change), // Dynamic color for hour data
                                      }}
                                    >
                                      {hourData && hourData.length > 0
                                        ? `${(
                                            hourData.reduce(
                                              (a, b) => a + b,
                                              0
                                            ) / hourData.length
                                          ).toFixed(1)}°C`
                                        : "x"}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailedHistory;
