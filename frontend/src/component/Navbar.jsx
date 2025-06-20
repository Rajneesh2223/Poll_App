import { Link } from "react-router-dom";

const Navbar = () => {
  const role = sessionStorage.getItem("userRole");
  console.log(role);

  return (
    <nav className="bg-white shadow-md px-6 py-3">
      <div className="container mx-auto flex justify-end items-center space-x-4">
        <Link
          to="/"
          className="text-lg font-semibold text-[#4D0ACD] hover:text-purple-700 transition"
        >
          Home
        </Link>
        {role === "teacher" && (
          <Link
            to="/poll-history"
            className="text-lg font-semibold text-[#4D0ACD] hover:text-purple-700 transition"
          >
            Poll History
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
