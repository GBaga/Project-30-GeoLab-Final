import { useState, useEffect } from "react";

const API_KEY = "8d62b5015264a920a27dbd465a9a6273"; // Replace with your actual API key
const city = "Tbilisi";
const state = "CA"; // Optional (for US cities)
const country = "US"; // Use country code (ISO 3166)
const limit = 3; // Number of results

const Geocode = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(
          `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=${limit}&appid=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch location data");
        }

        const data = await response.json();
        if (data.length === 0) {
          throw new Error("Location not found");
        }

        setLocation(data[0]); // Get the first result
      } catch (error) {
        setError(error.message);
      }
    };

    fetchLocation();
  }, []);

  if (error) return <p>GeocodePage ================= Error: {error}</p>;
  if (!location) return <p>Loading...</p>;

  return (
    <div>
      <h2>Location Data</h2>
      <p>City: {location.name}</p>
      <p>Latitude: {location.lat}</p>
      <p>Longitude: {location.lon}</p>
      <p>Country: {location.country}</p>
    </div>
  );
};

export default Geocode;
