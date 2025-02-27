import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

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
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const response = await axios.get(url);
  return response.data;
};

const processWeatherData = (data) => {
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
    if (!dailyData[day].description) {
      dailyData[day].description = entry.weather[0].description;
      dailyData[day].icon = entry.weather[0].icon;
    }
  });

  return Object.entries(dailyData)
    .slice(0, 5)
    .map(
      ([
        day,
        { tempSum, count, minTemp, maxTemp, description, icon, feelsLike },
      ]) => ({
        day,
        avgTemp: (tempSum / count).toFixed(1),
        minTemp: minTemp.toFixed(1),
        maxTemp: maxTemp.toFixed(1),
        feelsLike: (feelsLike / count).toFixed(1),
        description,
        icon,
      })
    );
};

const Geocode = () => {
  const [city, setCity] = useState("Tbilisi");
  const { data, error, isLoading } = useQuery({
    queryKey: ["weather", city],
    queryFn: fetchWeather,
  });

  if (isLoading) return <p>იტვირთება...</p>;
  if (error) return <p>შეცდომა ამინდის მონაცემების გაწვდენაში.</p>;

  const dailyForecast = processWeatherData(data);

  return (
    <div>
      <select value={city} onChange={(e) => setCity(e.target.value)}>
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
      <div className="flex flex-wrap items-center">
        <h2>{data.city.name} - ამინდის პროგნოზი</h2>
        {dailyForecast.map((item, index) => (
          <div
            key={index}
            className="flex flex-col bg-white rounded p-4 w-full max-w-[300px] shadow-lg mb-6"
          >
            <div className="font-bold text-xl">{item.day}</div>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString("ka-GE", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              <div>
                {new Date().toLocaleTimeString("ka-GE", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hourCycle: "h23",
                })}
              </div>
            </div>
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
                <div className="font-medium">მინ.</div>
                <div>{item.minTemp}°C</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-medium">მაქს.</div>
                <div>{item.maxTemp}°C</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Geocode;
