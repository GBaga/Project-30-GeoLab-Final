import { useState, useEffect } from "react";
import axios from "axios";
import WeatherLoader from "../../components/WeatherLoader";

function Forecast() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "cc0e6ec727472b3e6b3b3f227a8e69c5";
  const lat = "42.07";
  const lon = "45.20";

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        setWeatherData(response.data);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return <WeatherLoader />;
  if (error) return <p>Error: {error}</p>;

  console.log(weatherData);

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
        <h2> 5 დღის პროგნოზი</h2>
        <h3>ადგილი: მატანი/{weatherData?.city?.name || "მიუწვდომელია"}</h3>
      </div>

      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">თარიღი</th>
            {/* Table headers for time, temperature, weather, and icon */}
            <th className="border border-gray-300 p-2">დრო</th>
            <th className="border border-gray-300 p-2">ტემპ. (°C)</th>
            <th className="border border-gray-300 p-2">ამინდი</th>
            <th className="border border-gray-300 p-2">icon </th>
          </tr>
        </thead>
        <tbody>
          {/* Rows for each day */}
          {Object.entries(groupedByDay).map(([date, forecasts]) => (
            <tr key={date} className="border border-gray-300">
              {/* Left column with the day name */}
              <td className="border border-gray-300 p-2">{date}</td>

              {/* Columns for time, temperature, weather, and icon */}
              <td className="border border-gray-300 p-2">
                {forecasts.map((item) => {
                  const time = new Date(item.dt * 1000).toLocaleTimeString(
                    "ka-GE",
                    {
                      timeZone: "Asia/Tbilisi",
                      hour: "2-digit",
                      minute: "2-digit",
                      hourCycle: "h23", // 24-hour format
                    }
                  );
                  return (
                    <p
                      className="flex flex-col justify-between items-center mb-4"
                      key={item.dt}
                    >
                      {time}
                    </p>
                  );
                })}
              </td>
              <td className="border border-gray-300 p-2">
                {forecasts.map((item) => (
                  <p
                    className="flex flex-col justify-between items-center mb-4"
                    key={item.dt}
                  >
                    {item.main.temp.toFixed(1)} °C
                  </p>
                ))}
              </td>
              <td className="border border-gray-300 p-2">
                {forecasts.map((item) => (
                  <p
                    className="flex flex-col justify-between items-center mb-4"
                    key={item.dt}
                  >
                    {item.weather[0].main}
                  </p>
                ))}
              </td>
              <td className="border border-gray-300 p-2 ">
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
    </div>
  );
}

export default Forecast;
