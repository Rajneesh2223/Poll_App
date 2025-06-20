import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-3">
      <div className="container mx-auto flex justify-end items-center">
        <Link
          to="/"
          className="text-lg font-semibold text-[#4D0ACD] hover:text-purple-700 transition"
        >
          Home
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
