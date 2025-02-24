import { useState, useEffect } from "react";
import axios from "axios";
import Papa from "papaparse";
import WeatherLoader from "../../components/WeatherLoader";

const History = () => {
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    axios
      .get("/public/assets/history-weather.csv") // Make sure this file is in `public/`
      .then((response) => {
        Papa.parse(response.data, {
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

            console.log("Formatted Weather Data:", formattedData);
            setWeatherData(formattedData);
            setLoading(false); // Set loading to false after data is processed
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching CSV:", error);
        setLoading(false); // Set loading to false in case of error
      });
  }, []);

  const months = [
    { key: "01", label: "იან" },
    { key: "02", label: "თებ" },
    { key: "03", label: "მარ" },
    { key: "04", label: "აპრ" },
    { key: "05", label: "მაის" },
    { key: "06", label: "ივნ" },
    { key: "07", label: "ივლ" },
    { key: "08", label: "აგვ" },
    { key: "09", label: "სექტ" },
    { key: "10", label: "ოქტ" },
    { key: "11", label: "ნოემ" },
    { key: "12", label: "დეკ" },
  ];

  const years = Array.from({ length: 2025 - 1979 + 1 }, (_, i) =>
    (2025 - i).toString()
  );

  const getTemperatureColor = (currentTemp, previousTemp) => {
    if (previousTemp === null) return "black"; // No previous temperature to compare
    const change = currentTemp - previousTemp;
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
        მატნის საშუალო თვიური ტემპერატურა წლების მიხედვით (°C)
      </h2>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-400 w-full text-sm">
          <thead>
            <tr>
              <th className="border border-gray-400 p-2 bg-gray-200">წელი</th>
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
              let previousMonthTemp = null; // To track the previous month for each year
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

                    previousMonthTemp = currentMonthTemp; // Update for next comparison

                    return (
                      <td
                        key={key}
                        className="border border-gray-400 p-2"
                        style={{
                          color: currentMonthTemp ? color : "black",
                        }}
                      >
                        {currentMonthTemp ? currentMonthTemp.toFixed(1) : "-"}
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
