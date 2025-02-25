import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-gray-700 bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="/assets/logo-weather.png"
            className="w-20"
            alt="Weather Site Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            ამინდი
          </span>
        </Link>

        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-700 rounded-lg bg-gray-800 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-gray-900">
            <li>
              <Link
                to="/"
                className="block py-2 px-3 text-white rounded-sm hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-500 md:p-0"
              >
                მთავარი
              </Link>
            </li>
            <li>
              <Link
                to="/history"
                className="block py-2 px-3 text-white rounded-sm hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-500 md:p-0"
              >
                თვიური ისტორია
              </Link>
            </li>
            <li>
              <Link
                to="/detailed-history"
                className="block py-2 px-3 text-white rounded-sm hover:bg-gray-700 md:hover:bg-transparent md:border-0 md:hover:text-blue-500 md:p-0"
              >
                დეტალური ისტორია
              </Link>
            </li>
          </ul>
        </div>

        {/* Burger Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 md:hidden"
          aria-expanded={menuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-95 flex flex-col justify-center items-center transition-all duration-300 ${
          menuOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        } md:hidden`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-4 right-4 text-white text-2xl"
        >
          ✖
        </button>

        <div className="w-full px-4 text-center">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/assets/logo-weather.png"
              className="w-20 mb-12"
              alt="Weather Site Logo"
            />
            <span
              onClick={() => setMenuOpen(false)}
              className="self-center text-2xl font-semibold whitespace-nowrap text-white"
            >
              ამინდი
            </span>
          </Link>

          {/* Mobile Buttons */}
          <div className="flex flex-col space-y-4 sm:justify-center">
            <Link
              to="/history"
              onClick={() => setMenuOpen(false)}
              className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            >
              თვიური ისტორია
            </Link>
            <Link
              onClick={() => setMenuOpen(false)}
              to="/detailed-history"
              className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            >
              დეტალური ისტორია
            </Link>

            <a
              href="#"
              className="inline-flex justify-center hover:text-gray-900 items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg border border-white hover:bg-gray-100 focus:ring-4 focus:ring-gray-400"
            >
              ისტორია დეტალურად
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
