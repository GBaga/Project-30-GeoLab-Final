/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        sunshine: {
          "0%": { transform: "scale(1)", opacity: 0.6 },
          "100%": { transform: "scale(1.4)", opacity: 0 },
        },
        "sunshine-pulse": {
          // Added pulse animation
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        "cloud-front": {
          "0%": { transform: "translateX(15px)" },
          "50%": { transform: "translateX(0px)" },
          "100%": { transform: "translateX(15px)" },
        },
        "cloud-back": {
          "0%": { transform: "translateX(-15px)" }, // Corrected negative value
          "50%": { transform: "translateX(0px)" },
          "100%": { transform: "translateX(-15px)" }, // Corrected negative value
        },
      },
      animation: {
        sunshine: "sunshine 2s infinite",
        "sunshine-pulse": "sunshine-pulse 2s infinite alternate", // Alternate for pulsing
        "cloud-front": "cloud-front 8s infinite ease-in-out",
        "cloud-back": "cloud-back 12s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};
