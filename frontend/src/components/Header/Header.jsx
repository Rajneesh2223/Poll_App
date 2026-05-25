import React from "react";
import { Link } from "react-router-dom";
import useUserStore from "../../store/useStore";
import ProfileImage from "./ProfileImage";

function Header() {
  const { user } = useUserStore();

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3">
      <div className="navbar max-w-6xl mx-auto glass-panel rounded-2xl px-6 py-2 shadow-xl bg-opacity-70 bg-slate-950/70 border border-blue-500/10">
        <div className="flex-1">
          <Link to={"/"} className="text-2xl font-extrabold tracking-tight text-white hover:opacity-90 flex items-center gap-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Live</span>Poll
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 gap-2 text-sm font-semibold text-gray-300">
            {user.username ? (
              <li>
                <Link to={"/dashboard"} className="hover:text-cyan-400 transition-colors py-2 px-3 rounded-lg hover:bg-blue-500/10">Dashboard</Link>
              </li>
            ) : (
              <li>
                <Link to={"/login"} className="hover:text-cyan-400 transition-colors py-2 px-3 rounded-lg hover:bg-blue-500/10">Login</Link>
              </li>
            )}
            <li>
              <Link to={"/poll"} className="hover:text-cyan-400 transition-colors py-2 px-3 rounded-lg hover:bg-blue-500/10">Polls</Link>
            </li>
          </ul>
        </div>
        {user.username && (
          <div className="ml-3 border-l border-blue-500/20 pl-3">
            <ProfileImage userData={user} />
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
