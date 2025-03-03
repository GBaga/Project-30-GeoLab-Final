import "./weatherLoader.css";
import { useTranslation } from "react-i18next";

const WeatherLoader = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full ">
      <div className="container mx-auto w-[250px] h-[250px] p-[15px] flex items-center justify-center ">
        <div className="cloud front w-[250px] pt-[45px] ml-[25px] inline absolute z-[11]">
          <span className="left-front w-[65px] h-[65px]  bg-[#4c9beb] inline-block z-5"></span>
          <span className="right-front w-[45px] h-[45px] rounded-full  bg-[#4c9beb] inline-block -ml-[25px] z-5"></span>
        </div>
        <span className="sun sunshine w-[120px] h-[120px] rounded-full inline absolute"></span>
        <span className="sun w-[120px] h-[120px] rounded-full inline absolute"></span>
        <div className="cloud back w-[250px] mt-[-30px] ml-[150px] z-[12]">
          <span className="left-back w-[30px] h-[30px] bg-[#4c9beb] inline-block z-5"></span>
          <span className="right-back w-[50px] h-[50px]  bg-[#4c9beb] inline-block -ml-[20px] z-5"></span>
        </div>
      </div>
      <h2 className="text-center font-bold">{t("loader")}</h2>
    </div>
  );
};

export default WeatherLoader;
