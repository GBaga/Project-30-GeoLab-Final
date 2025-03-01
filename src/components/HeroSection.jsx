import { Link } from "react-router";
import { useTranslation } from "react-i18next";

function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-center  min-h-fit bg-[url('/assets/hero-image.jpg')] bg-cover bg-gray-300 bg-blend-multiply ">
      <div className="px-4 mx-auto max-w-screen-xl max-h-full pb-40 ">
        <h1 className="mb-4 py-3 text-2xl font-extrabold tracking-tight leading-none text-gray-200 md:text-5xl md:py-6 lg:text-6xl lg:py-10">
          {t("H1")}
        </h1>
        <Link
          to="https://openweathermap.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 text-lg font-normal text-gray-300 lg:text-xl sm:px-8 lg:px-24"
        >
          {t("source")} : OpenWeather
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;
