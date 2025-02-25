import "./weatherLoader.css"; // Import the CSS for keyframes

const WeatherLoader = () => {
  return (
    <div className="w-full ">
      <div className="container mx-auto w-[250px] h-[250px] p-[15px] flex items-center justify-center ">
        <div className="cloud front w-[250px] pt-[45px] ml-[25px] inline absolute z-[11]">
          <span className="left-front"></span>
          <span className="right-front"></span>
        </div>
        <span className="sun sunshine"></span>
        <span className="sun"></span>
        <div className="cloud back w-[250px] mt-[-30px] ml-[150px] z-[12]">
          <span className="left-back"></span>
          <span className="right-back"></span>
        </div>
      </div>
      <h2 className="text-center font-bold">იტვირთება . . .</h2>
    </div>
  );
};

export default WeatherLoader;
