import { db } from "@vercel/postgres";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import dotenv from "dotenv";
dotenv.config();

const parseCSV = async (filePath) => {
  const csvFile = fs.readFileSync(path.resolve(filePath), "utf8");
  return new Promise((resolve, reject) => {
    Papa.parse(csvFile, {
      header: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

const seedDatabase = async (weatherData) => {
  const client = await db.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS weather (
      dt BIGINT PRIMARY KEY,
      dt_iso TIMESTAMP WITH TIME ZONE,
      timezone INT,
      city_name VARCHAR(255),
      lat FLOAT,
      lon FLOAT,
      temp FLOAT,
      visibility INT,
      dew_point FLOAT,
      feels_like FLOAT,
      temp_min FLOAT,
      temp_max FLOAT,
      pressure INT,
      sea_level INT,
      grnd_level INT,
      humidity INT,
      wind_speed FLOAT,
      wind_deg INT,
      wind_gust FLOAT,
      rain_1h FLOAT,
      rain_3h FLOAT,
      snow_1h FLOAT,
      snow_3h FLOAT,
      clouds_all INT,
      weather_id INT,
      weather_main VARCHAR(255),
      weather_description VARCHAR(255),
      weather_icon VARCHAR(10)
    );
  `);

  for (const weather of weatherData) {
    await client.query(`
      INSERT INTO weather (
        dt, dt_iso, timezone, city_name, lat, lon, temp, visibility,
        dew_point, feels_like, temp_min, temp_max, pressure, sea_level, grnd_level,
        humidity, wind_speed, wind_deg, wind_gust, rain_1h, rain_3h, snow_1h, snow_3h,
        clouds_all, weather_id, weather_main, weather_description, weather_icon
      ) VALUES (
        ${weather.dt}, '${weather.dt_iso}', ${weather.timezone}, '${weather.city_name}',
        ${weather.lat}, ${weather.lon}, ${weather.temp}, ${weather.visibility},
        ${weather.dew_point}, ${weather.feels_like}, ${weather.temp_min}, ${weather.temp_max},
        ${weather.pressure}, ${weather.sea_level}, ${weather.grnd_level},
        ${weather.humidity}, ${weather.wind_speed}, ${weather.wind_deg},
        ${weather.wind_gust}, ${weather.rain_1h}, ${weather.rain_3h}, ${weather.snow_1h},
        ${weather.snow_3h}, ${weather.clouds_all}, ${weather.weather_id},
        '${weather.weather_main}', '${weather.weather_description}', '${weather.weather_icon}'
      );
    `);
  }

  await client.end();
};

const filePath = "/assets/history-weather.csv"; // Replace with the path to your CSV file
parseCSV(filePath)
  .then((data) => seedDatabase(data))
  .then(() => console.log("Data seeded successfully"))
  .catch((error) => console.error("Error seeding data:", error));
