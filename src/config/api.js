import axios from "axios";

const API_KEY = "cc0e6ec727472b3e6b3b3f227a8e69c5";
// const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;

export const fetchWeatherData = async (city) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
