import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import staricon from "../assets/herosection/staricon.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const role = sessionStorage.getItem("userRole");

  return (
    <nav className="bg-white shadow-md px-6 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold text-[#4D0ACD] hover:text-purple-700 transition"
        >
          <div className="flex justify-center">
            <button
              className="px-2.5 py-1.5 rounded-3xl"
              style={{
                background: "linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)",
              }}
            >
              <div className="flex items-center space-x-2">
                <img src={staricon} alt="star icon" className="w-6 h-6" />
              </div>
            </button>
          </div>
        </Link>

        <button
          className="sm:hidden text-[#4D0ACD] focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="hidden sm:flex space-x-4 items-center">
          <Link
            to="/"
            className="text-lg font-semibold text-[#4D0ACD] hover:text-purple-700 transition"
          >
            Home
          </Link>
          {role === "teacher" && (
            <>
              <Link
                to="/poll-history"
                className="text-lg font-semibold text-[#4D0ACD] hover:text-purple-700 transition"
              >
                Poll History
              </Link>
              <Link
                to="/teacher-dashboard"
                className="text-lg font-semibold text-[#4D0ACD] hover:text-purple-700 transition"
              >
                Go to Question
              </Link>
            </>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden mt-3 space-y-2 px-4">
          <Link
            to="/"
            className="block text-lg font-semibold text-[#4D0ACD] hover:text-purple-700 transition"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          {role === "teacher" && (
            <>
              <Link
                to="/poll-history"
                className="block text-lg font-semibold text-[#4D0ACD] hover:text-purple-700 transition"
                onClick={() => setIsOpen(false)}
              >
                Poll History
              </Link>
              <Link
                to="/teacher-dashboard"
                className="block text-lg font-semibold text-[#4D0ACD] hover:text-purple-700 transition"
                onClick={() => setIsOpen(false)}
              >
                Go to Question
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
