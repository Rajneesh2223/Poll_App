import { Home, History, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import staricon from "../assets/herosection/staricon.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const role = sessionStorage.getItem("userRole");
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `flex items-center space-x-1.5 text-sm font-semibold transition-colors ${
      isActive(path)
        ? "text-purple-700"
        : "text-gray-500 hover:text-purple-700"
    }`;

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center">
          <button
            className="px-3 py-1.5 rounded-3xl flex items-center space-x-2"
            style={{
              background: "linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)",
            }}
          >
            <img src={staricon} alt="PollSync icon" className="w-5 h-5" />
            <span className="font-bold text-white text-sm">
              Poll<span style={{ color: "#C4B5FD" }}>Sync</span>
            </span>
          </button>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center space-x-6">
          <Link to="/" className={linkClass("/")}>
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>

          {role === "teacher" && (
            <>
              <Link to="/teacher-dashboard" className={linkClass("/teacher-dashboard")}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link to="/poll-history" className={linkClass("/poll-history")}>
                <History className="w-4 h-4" />
                <span>Poll History</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-gray-500 focus:outline-none"
          onClick={() => setIsOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 px-5 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-2 text-sm font-semibold text-gray-600 hover:text-purple-700"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          {role === "teacher" && (
            <>
              <Link
                to="/teacher-dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 text-sm font-semibold text-gray-600 hover:text-purple-700"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/poll-history"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-2 text-sm font-semibold text-gray-600 hover:text-purple-700"
              >
                <History className="w-4 h-4" />
                <span>Poll History</span>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
