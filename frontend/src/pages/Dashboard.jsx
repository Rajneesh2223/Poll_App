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
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white relative p-4 lg:p-6 overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[130px] pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[130px] pointer-events-none animate-float-delayed"></div>

      {/* User Profile Sidebar */}
      <aside className="w-full lg:w-1/4 glass-panel m-2 shadow-2xl p-6 rounded-3xl flex flex-col items-center relative z-10 self-start border border-blue-500/10">
        <div className="relative mb-4">
          <img
            src={`https://placehold.co/200x200?text=${
              user?.username[0] || "LivePoll"
            }`}
            alt="User Profile"
            className="rounded-full h-24 w-24 object-cover border-2 border-cyan-400 p-1 shadow-md shadow-blue-500/20"
          />
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 border-2 border-slate-950 rounded-full"></span>
        </div>
        <h2 className="text-2xl font-bold text-center text-white tracking-tight">
          {user?.username || "User"}
        </h2>
        <p className="mt-1 text-center text-xs text-gray-400 font-medium">
          {user?.email || "Email"}
        </p>
        <div className="w-full mt-6 space-y-2.5">
          <button className="btn glass-btn-secondary w-full text-sm font-semibold rounded-xl">Edit Profile</button>
          <button
            className="btn btn-error btn-outline w-full text-sm font-semibold rounded-xl hover:bg-red-500/10 border-red-500/30 text-red-400"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Dashboard Main Content */}
      <main className="w-full lg:w-3/4 p-4 lg:p-6 relative z-10">
        {/* Dashboard Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Poll <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Dashboard</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Manage your polls, view results, and edit as needed.
            </p>
          </div>
          {/* Add New Poll Button */}
          <button
            className="btn glass-btn-primary rounded-xl font-bold py-3 px-5 shadow-lg flex items-center gap-2 self-start md:self-auto text-sm"
            onClick={() => navigator("/create")}
          >
            Create New Poll <FaPlus className="text-xs" />
          </button>
        </div>

        {/* Polls Table */}
        {isError && <div className="h-60 w-full"><ErrorFallback onRetry={refetch}/></div>}
        {isLoading && <div className="skeleton h-40 w-full rounded-2xl bg-slate-900/30"></div>}
        {isSuccess &&
          <div className="overflow-x-auto glass-panel rounded-3xl shadow-xl">
            <table className="table w-full text-white bg-transparent">
              <thead>
                <tr className="border-b border-blue-500/10 text-gray-400 text-xs tracking-wider">
                  <th className="py-4">#</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Published</th>
                  <th className="text-right pr-6">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-blue-500/5">
                {formatDataByDate(data)?.map((poll, index) => (
                  <PollTableRow key={poll._id} refetch={refetch} poll={poll} index={index} />
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
