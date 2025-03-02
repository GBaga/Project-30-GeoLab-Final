# Project-30-GeoLab24-Final# Weather App

## Overview
This is a weather application built with React, designed as a final project for the GeoLab JS/React course. The app provides real-time weather forecasts for many cities of Georgia, historical weather data for Kakhetian village Matani (Akhmeta municipality), and an interactive UI for users to search and view weather conditions in different locations.

## Features
- **Current Weather:** Displays real-time weather conditions for a given city.
- **Weather Forecast:** Provides a 5-day weather forecast using an external API.
- **Historical Data:** Loads and displays past (from 1979 to 2025) weather data for Matani (village in Kakheti) from a CSV file.
- **Multi-language Support:** Uses i18next for localization (supports English and Georgian).
- **Optimized Performance:** Utilizes React Query for API calls and useMemo for efficient rendering.
- **Responsive Design:** Works on mobile, tablet, and desktop screens.

## Technologies Used
- React (with React Router)
- JavaScript (ES6+)
- React Query (for data fetching)
- i18next (for internationalization)
- Tailwind CSS (for styling)
- Vite (for fast development and build process)
- Axios (for API calls)
- PapaParse (for CSV data processing)

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/GBaga/Project-30-GeoLab-Final.git
   ```
2. Navigate to the project directory:
   ```sh
   cd Project-30-GeoLab-Final
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file in the root directory and add your API key:
   ```sh
   REACT_APP_WEATHER_API_KEY=your_api_key_here
   ```
5. Start the development server:
   ```sh
   npm run dev
   ```

## Usage
- **Search for a city:** Select a city name in the dropdown selection to fetch weather details.
- **View forecast:** Navigate to the forecast page to see future weather predictions.
- **Check history:** Access the history section to explore past weather trends (only for one villige).
- **Switch language:** Use the language switcher to toggle between English and Georgian.

## Deployment
To create a production build:
```sh
npm run build
```
Deploy the `dist` folder to platforms like Vercel, Netlify, or GitHub Pages.

## Future Improvements
- **User Authentication:** Save favorite locations and weather preferences.
- **Dark Mode:** Add a toggle for light/dark themes.
- **Additional Weather Metrics:** Include air quality, UV index, and more.
- **Improved UI Animations:** Enhance user experience with interactive animations.

## License
This project is open-source and available under the MIT License.

## Author
Developed by Goga Bagauri as part of the GeoLab Final Project.

