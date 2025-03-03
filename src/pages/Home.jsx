import { useState, useEffect } from "react";
import axios from "axios";
import WeatherLoader from "../components/weatherLoader/WeatherLoader";
import ChooseLocation from "../components/ChooseLocation";
import WeatherCard from "../components/WeatherCard";

const API_KEY = "cc0e6ec727472b3e6b3b3f227a8e69c5";
// const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;

const locations = [
  { name: "Matani, GE", lat: "42.07", lon: "45.20" },
  { name: "Tbilisi", lat: "41.6941", lon: "44.8337" },
];

const Home = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState(null);

  const fetchWeatherData = async () => {
    try {
      const dataPromises = locations.map((location) =>
        axios
          .get("https://api.openweathermap.org/data/2.5/weather", {
            params: {
              lat: location.lat,
              lon: location.lon,
              appid: API_KEY,
              units: "metric",
            },
          })
          .then((response) => ({ ...response.data, city: location.name }))
      );
      const results = await Promise.all(dataPromises);
      setWeatherData(results);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  return (
    <div className="min-h-fit flex flex-wrap justify-center gap-6 p-6 bg-gray-100">
      {error && <p className="text-red-500">Error: {error}</p>}
      {weatherData.length > 0 ? (
        weatherData.map((weather, index) => (
          <WeatherCard key={index} weather={weather} />
        ))
      ) : (
        <WeatherLoader />
      )}

      <ChooseLocation />
    </div>
  );
};

export default Home;
