import { useState, useEffect } from "react";

function Forecast() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = "cc0e6ec727472b3e6b3b3f227a8e69c5";
  const lat = "41.6941";
  const lon = "44.8337";
  const cnt = 16;

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=${cnt}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        setWeatherData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return <p>Loading weather data...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log(weatherData);
  return (
    <>
      <div className="p-10">
        <h2>16 დღის ამინდის პროგნოზი</h2>
        <h3>ადგილი: {weatherData.city.name}</h3>
      </div>

      <div className="h-full flex justify-center items-center flex-wrap gap-4">
        {weatherData.list.slice(0, cnt).map((item, index) => (
          <div key={index} className="p-4 border border-gray-300 rounded-lg">
            <p>თარიღი: {item.dt_txt}°C</p>
            <p>ტემპერატურა: {item.main.temp}°C</p>
            <p>ამინდი: {item.weather[0].main}</p>
            <img
              className="w-20"
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt={item.weather[0].description}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default Forecast;
