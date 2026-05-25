import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import getPollData from "../services/getPollData";
import ErrorFallback from "../components/Errors/ErrorFallback";
import createVoteService from "../services/createVoteService";
import { FaBookmark } from "react-icons/fa";
import { toast } from "react-toastify";
import { makeChartDataObjFromPollData } from "../utils/util";
import useBookmark from "../hooks/useBookmark";
import { io } from "socket.io-client";
import { getPollSelectedOptionData } from "../services/getPollSelectedOptionData";
import { BACKEND_URL } from "../config/clientConfig";

ChartJS.register(BarElement, CategoryScale, LinearScale);

function VotingPage() {
  const { pollId } = useParams();
  const [selectedOption, setSelectedOption] = useState(null);
  const { handleBookmark } = useBookmark();
  const [poll, setPoll] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io(BACKEND_URL);
    setSocket(s);

    s.on("connect", () => {
      console.log("Connected to the server");
      s.emit("joinPoll", pollId);
    });

    return () => {
      s.disconnect();
    };
  }, [pollId]);

  const { data, isLoading, isError, refetch } = useQuery(
    ["poll", pollId],
    () => getPollData(pollId),
    {
      cacheTime: 10 * 60 * 1000, // 10 minutes
      staleTime: 20 * 60 * 1000, // 20 minutes
      onSuccess: (data) => {
        setPoll(data);
      },
    },
  );

  useQuery(
    ["selectedOption", pollId],
    () => getPollSelectedOptionData(pollId),
    {
      cacheTime: 10 * 60 * 1000, // 10 minutes
      staleTime: 20 * 60 * 1000,
      onSuccess: (data) => {
        setSelectedOption(data?.data?.optionId || null);
      },
    },
  );

  useEffect(() => {
    if (socket) {
      socket.on("pollDataUpdated", (data) => {
        console.log("Received updated poll data:", data);
        setPoll(data);
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error.message);
      });

      return () => {
        socket.off("pollDataUpdated");
        socket.off("error");
      };
    }
  }, [socket]);

  const mutation = useMutation(createVoteService, {
    onSuccess: (data) => {
      toast.success("Vote submitted successfully");
      if (socket) {
        socket.emit("vote", { pollId, success: data?.success });
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred",
      );
    },
  });

  const handleOptionSelect = (id) => {
    if (!selectedOption) {
      setSelectedOption(id);
    }
    mutation.mutate({ pollId, optionId: id });
  };

  if (isLoading) {
    return <div className="skeleton h-64 w-full max-w-lg mt-12 mx-auto"></div>;
  }

  if (isError) {
    return (
      <div className="h-64 w-full max-w-lg mt-12 mx-auto">
        <ErrorFallback onRetry={refetch} />
      </div>
    );
  }

  const chartData = makeChartDataObjFromPollData(poll);

  return (
    <div className="flex bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 min-h-screen flex-col items-center text-white p-4 md:p-6 relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none animate-float-delayed"></div>

      <div className="w-full max-w-xl glass-panel p-6 md:p-8 rounded-3xl relative z-10 shadow-2xl mt-4 md:mt-8 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-6 pb-4 border-b border-blue-500/10">
          {/* Poll Creator Info */}
          <div className="flex items-center gap-3">
            <img
              src={`https://placehold.co/100?text=${poll?.data?.creatorData?.username?.[0] || "U"}`}
              alt={poll?.data?.creatorData?.username}
              className="rounded-full h-8 w-8 object-cover border border-cyan-400/30"
            />
            <div>
              <span className="text-[10px] tracking-wider text-gray-400 block font-semibold">CREATED BY</span>
              <h2 className="text-sm font-bold text-white leading-none">
                {poll?.data?.creatorData?.username || "Unknown"}
              </h2>
            </div>
          </div>

          {/* BookMark Button */}
          <button
            className="btn btn-circle btn-sm glass-btn-secondary"
            onClick={() => handleBookmark(pollId)}
            title="Bookmark Poll"
          >
            <FaBookmark className="text-xs text-cyan-400" />
          </button>
        </div>

        {/* Poll Title */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-center tracking-tight text-white mb-2">
          {poll?.data?.pollData?.title || "Loading.."}
        </h1>

        {/* Poll Description */}
        <p className="text-xs md:text-sm font-light text-gray-400 mb-8 text-center max-w-md leading-relaxed">
          {poll?.data?.pollData?.description || "Loading.."}
        </p>

        {/* Voting Options */}
        <div className="grid grid-cols-1 gap-3 w-full mb-8">
          {poll?.data?.pollData?.options.map((option) => {
            const isSelected = selectedOption === option._id;
            return (
              <div
                onClick={() => handleOptionSelect(option._id)}
                key={option._id}
                className={`p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all duration-300 border ${
                  isSelected 
                    ? "bg-gradient-to-r from-blue-600/30 to-cyan-500/30 border-cyan-400/80 shadow-lg shadow-cyan-500/10" 
                    : "glass-input border-blue-500/10 hover:bg-blue-500/5 hover:border-blue-500/30"
                }`}
              >
                <span className={`text-sm md:text-base font-semibold ${isSelected ? "text-cyan-300" : "text-white"}`}>
                  {option.name}
                </span>
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/50"></span>
                )}
              </div>
            );
          })}
        </div>

        {/* Chart Visualization (Wrapped in premium glass sub-container) */}
        <div className="w-full bg-slate-900/30 border border-blue-500/10 p-5 rounded-2xl h-64 mt-4 shadow-inner relative">
          <Bar
            data={makeChartDataObjFromPollData(poll)}
            options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false }
              },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { color: "#94a3b8", font: { size: 10 } }
                },
                y: {
                  grid: { color: "rgba(59, 130, 246, 0.05)" },
                  ticks: { color: "#94a3b8", font: { size: 10 } }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default VotingPage;
