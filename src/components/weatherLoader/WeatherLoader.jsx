import "./weatherLoader.css"; // Import the CSS for keyframes

const WeatherLoader = () => {
  return (
    <div className="w-full ">
      <div className="container mx-auto">
        <div className="cloud front">
          <span className="left-front"></span>
          <span className="right-front"></span>
        </div>
        <span className="sun sunshine"></span>
        <span className="sun"></span>
        <div className="cloud back">
          <span className="left-back"></span>
          <span className="right-back"></span>
        </div>
      </div>
      <h2 className="text-center font-bold">იტვირთება . . .</h2>
    </div>
  );
};

export default WeatherLoader;
