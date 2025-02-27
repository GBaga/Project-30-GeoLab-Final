import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import WeatherLoader from "./weatherLoader/WeatherLoader";

const API_KEY = "8d62b5015264a920a27dbd465a9a6273";

const fetchCoordinates = async (city) => {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;
  const response = await axios.get(url);
  if (response.data.length === 0) throw new Error("City not found");
  return response.data[0];
};

const fetchWeather = async ({ queryKey }) => {
  const [, city] = queryKey;
  const { lat, lon } = await fetchCoordinates(city);
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
};

const ChooseLocation = () => {
  const [city, setCity] = useState("Telavi");
  const { data, error, isLoading } = useQuery({
    queryKey: ["weather", city],
    queryFn: fetchWeather,
  });

  if (isLoading) return <WeatherLoader />;
  if (error) return <p className="text-red-500">შეცდომა: {error.message}</p>;

  return (
    <div className="flex flex-col bg-white rounded p-4 w-full max-w-[1024px] shadow-lg">
      <h2 className=" mb-2 text-xl text-center">აირჩიე ქალაქი</h2>

      <select
        className="font-bold text-xl bg-yellow-300 py-2"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      >
        <option value="Tbilisi">თბილისი</option>
        <option value="Batumi">ბათუმი</option>
        <option value="Kutaisi">ქუთაისი</option>
        <option value="Zugdidi">ზუგდიდი</option>
        <option value="Rustavi">რუსთავი</option>
        <option value="Vani">ვანი</option>
        <option value="Telavi">თელავი</option>
        <option value="Mtskheta">მცხეთა</option>
        <option value="Gori">გორი</option>
        <option value="Khashuri">ხაშური</option>
        <option value="Sighnaghi">სიღნაღი</option>
        <option value="Mestia">მესტია</option>
        <option value="Borjomi">ბორჯომი</option>
        <option value="Poti">ფოთი</option>
        <option value="Akhaltsikhe">ახალციხე</option>
        <option value="Ambrolauri">ამბროლაური</option>
        <option value="Kobuleti">ქობულეთი</option>
        <option value="Zestafoni">ზესტაფონი</option>
      </select>

      <div className="mt-6 text-6xl self-center inline-flex items-center justify-center rounded-lg text-indigo-400 h-24 w-fit">
        <img
          className="w-40"
          src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
          alt={data.weather[0].description}
        />
      </div>

      <div className="flex flex-row items-center justify-center mt-6">
        <div className="font-medium text-6xl">
          {data.main.temp.toFixed(1)}°C
        </div>
        <div className="flex flex-col items-center ml-6">
          <div>{data.weather[0].description}</div>
        </div>
      </div>

      <div className="flex flex-row justify-between mt-6 text-sm text-gray-500">
        <div className="flex flex-col items-center"></div>
        <div className="flex flex-col items-center">
          <div className="font-medium">იგრძნობა როგორც</div>
          <div>{data.main.feels_like.toFixed(1)}°C</div>
        </div>
      </div>

      <div className="flex flex-row justify-between mt-6 text-sm text-gray-500">
        <div className="flex flex-col items-center">
          <div className="font-medium">ქარი</div>
          <div>{data.wind.speed} km/h</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-medium">ტენიანობა</div>
          <div>{data.main.humidity}%</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-medium">ხილვადობა</div>
          <div>{(data.visibility / 1000).toFixed(1)} km</div>
        </div>
      </div>

      <Link
        to={`/forecast/${encodeURIComponent(city)}`}
        className="text-white text-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mt-6"
      >
        5 დღის პროგნოზი
      </Link>
    </div>
  );
};

export default ChooseLocation;
