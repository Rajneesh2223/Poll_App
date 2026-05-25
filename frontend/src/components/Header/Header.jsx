import React from "react";
import { Link } from "react-router-dom";
import useUserStore from "../../store/useStore";
import ProfileImage from "./ProfileImage";

function Header() {
  const { user } = useUserStore();

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link to={"/"} className="btn btn-ghost text-xl">
          LivePoll
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 gap-1">
          {user.username ? (
            <li>
              <Link to={"/dashboard"}>Dashboard</Link>
            </li>
          ) : (
            <li>
              <Link to={"/login"}>Login</Link>
            </li>
          )}
          <li>
            <Link to={"/poll"}>Polls</Link>
          </li>
        </ul>
      </div>
      {user.username && <ProfileImage userData={user} />}
    </div>
  );
}

export default Header;
