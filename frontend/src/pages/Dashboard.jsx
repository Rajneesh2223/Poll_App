// Dashboard.js
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import PollTableRow from "../components/PollTableRow/PollTableRow";
import { useNavigate } from "react-router-dom";
import useUserStore from "../store/useStore";
import useLogout from "../hooks/useLogout";
import { useQuery } from "react-query";
import getUserPollData from "../services/getUserPollData";
import ErrorFallback from "../components/Errors/ErrorFallback";
import { formatDataByDate } from "../utils/util";

function Dashboard() {
  const navigator = useNavigate();
  const { handleLogout } = useLogout();
  const { user } = useUserStore();

  const { data, isLoading, isError, refetch, isSuccess } = useQuery(
    ["polls", user._id],
    getUserPollData,
    {
      cacheTime: 1000 * 60 * 5, // 5 minutes
      staleTime: 1000 * 60 * 10, // 10 minutes
    }
  );


  const pollData = [
    {
      _id: "1",
      title: "Poll 1",
      description: "Description of Poll 1",
      totalVotes: 120,
      published: true,
    },
    {
      _id: "2",
      title: "Poll 2",
      description: "Description of Poll 2",
      totalVotes: 45,
      published: false,
    },
    // Add more poll data as needed
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-base-200">
      {/* User Profile Sidebar */}
      <aside className="w-min lg:w-1/4 bg-slate-800 rounded-md m-4 bg-opacity-50 shadow-lg p-4 flex flex-col items-center">
        <img
          src={`https://placehold.co/200x200?text=${
            user?.username[0] || "LivePoll"
          }`} // Replace with actual path
          alt="User Profile"
          className="rounded-full h-24 w-24 object-cover mb-4"
        />
        <h2 className="text-2xl font-bold text-center text-white">
          {user?.username || "User"}
        </h2>
        <p className="mt-2 text-center text-gray-400">
          {user?.email || "Email"}
        </p>
        <button className="btn btn-primary mt-4 w-full">Edit Profile</button>
        <button
          className="btn btn-error btn-outline mt-4 w-full"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      {/* Dashboard Main Content */}
      <main className="w-full lg:w-3/4 p-6">
        {/* Dashboard Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-4xl font-bold text-white">
            Poll Dashboard
          </h1>
          <p className="md:text-lg text-gray-300">
            Manage your polls, view results, and edit as needed.
          </p>
        </div>

        {/* Add New Poll Button */}
        <div className="flex justify-end mb-4">
          <button
            className="btn btn-primary"
            onClick={() => navigator("/create")}
          >
            Add New Poll <FaPlus />
          </button>
        </div>

        {/* Polls Table */}
        {isError && <div className="h-60 w-full"><ErrorFallback onRetry={refetch}/></div>}
        {isLoading && <div className="skeleton h-40 w-full"></div>}
        {isSuccess &&
          <div className="overflow-x-auto">
            <table className="table w-full bg-gray-800 text-white">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {formatDataByDate(data)?.map((poll, index) => (
                  <PollTableRow key={poll._id} refetch={refetch} poll={poll} index={index} /> // Replace with actual path
                ))}
              </tbody>
            </table>
          </div>
        }
      </main>
    </div>
  );
}

export default Dashboard;
