function HeroSection() {
  return (
    <section className="bg-center  min-h-fit bg-[url('/assets/hero-image.jpg')] bg-cover bg-gray-300 bg-blend-multiply ">
      <div className="px-4 mx-auto max-w-screen-xl max-h-full pb-40 ">
        <h1 className="mb-4 text-l font-extrabold tracking-tight leading-none text-gray-200 md:text-5xl lg:text-6xl">
          ამინდის პროგნოზი
        </h1>
        <p className="mb-4 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">
          OpenWeather
        </p>
      </div>
    </section>
  );
}

export default HeroSection;
