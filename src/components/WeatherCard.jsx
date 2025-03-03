import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const WeatherCard = ({ weather, city }) => {
  const { t } = useTranslation();
  const formatDateTime = () => {
    const date = new Date();
    return {
      date: date.toLocaleDateString("ka-GE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("ka-GE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      }),
    };
  };

  return (
    <div className="flex flex-col bg-white rounded p-4 w-full max-w-[500px] shadow-lg">
      <div className="font-bold text-xl">
        {weather.city || city} / {weather.name}
      </div>
      <div className="text-sm text-gray-500">
        {formatDateTime().date}
        <div>{formatDateTime().time}</div>
      </div>
      <div className="mt-6 text-6xl self-center inline-flex items-center justify-center rounded-lg text-indigo-400 h-24 w-fit">
        <img
          className="w-40"
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
        />
      </div>
      <div className="flex flex-row items-center justify-center mt-6">
        <div className="font-medium text-6xl">
          {weather.main.temp.toFixed(1)}°C
        </div>
        <div className="flex flex-col items-center ml-6">
          <div>{weather.weather[0].description}</div>
        </div>
      </div>

      <div className="flex flex-row justify-end text-center mt-6 text-sm text-gray-500">
        <div className="flex flex-col items-center"></div>
        <div className="flex flex-col items-center">
          <div className="font-medium">{t("feels-like")}</div>
          <div>{weather.main.feels_like.toFixed(1)}°C</div>
        </div>
      </div>

      <div className="flex flex-row justify-between mt-6 text-sm text-gray-500">
        <div className="flex flex-col items-center">
          <div className="font-medium">{t("wind")}</div>
          <div>
            {weather.wind.speed} {t("km/h")}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-medium">{t("humidity")}</div>
          <div>{weather.main.humidity}%</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-medium">{t("visibility")}</div>
          <div>{(weather.visibility / 1000).toFixed(1)} km</div>
        </div>
      </div>
      <Link
        to={`/forecast/${weather.city || city}`}
        className="text-white text-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mt-6 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        {t("forecast-next-days")}
      </Link>
    </div>
  );
};

WeatherCard.propTypes = {
  weather: PropTypes.shape({
    city: PropTypes.string,
    name: PropTypes.string.isRequired,
    weather: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      })
    ).isRequired,
    main: PropTypes.shape({
      temp: PropTypes.number.isRequired,
      feels_like: PropTypes.number.isRequired,
      humidity: PropTypes.number.isRequired,
    }).isRequired,
    wind: PropTypes.shape({
      speed: PropTypes.number.isRequired,
    }).isRequired,
    visibility: PropTypes.number.isRequired,
  }).isRequired,
  city: PropTypes.string.isRequired,
};

export default WeatherCard;
