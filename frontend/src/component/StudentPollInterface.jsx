import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import staricon from "../assets/herosection/staricon.svg";
import { socket } from "../utils/socket";
import ChatButton from "./ChatButton";
import ChatWindow from "./ChatWindow";

const StudentPollInterface = () => {
  const [pollData, setPollData] = useState(null);
  const [isPollActive, setIsPollActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  console.log(
    pollData,
    isPollActive,
    selectedOption,
    hasVoted,
    showResults,
    timeLeft,
    isActive,
    isRegistered,
    isSocketConnected
  );

  const location = useLocation();
  const userName = location.state?.userName;

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  const handleChatToggle = () => {
    setIsChatOpen((prev) => !prev);
    if (!isChatOpen) setHasUnreadMessages(false);
  };

  useEffect(() => {
    const handleConnect = () => {
      console.log("Socket connected");
      setIsSocketConnected(true);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
      setIsSocketConnected(false);
      setIsRegistered(false);
    };

    const handleReconnect = () => {
      console.log("Socket reconnected");
      setIsSocketConnected(true);

      if (userName) {
        setIsRegistered(false);
      }
    };

    if (socket.connected) {
      setIsSocketConnected(true);
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("reconnect", handleReconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("reconnect", handleReconnect);
    };
  }, [userName]);

  useEffect(() => {
    if (userName && !isRegistered && isSocketConnected) {
      console.log("Registering user:", userName);
      socket.emit("register_user", { name: userName, role: "student" });
    }
    const handleRegistrationSuccess = (data) => {
      console.log("Registration successful:", data);
      setIsRegistered(true);
    };

    const handleRegistrationError = (error) => {
      console.error("Registration failed:", error);
      alert(`Registration failed: ${error}`);

      setTimeout(() => {
        if (isSocketConnected && userName) {
          console.log("Retrying registration...");
          socket.emit("register_user", { name: userName, role: "student" });
        }
      }, 2000);
    };

    const handleSocketError = (error) => {
      console.error("Socket error:", error);
    };

    if (isSocketConnected) {
      socket.on("registration_success", handleRegistrationSuccess);
      socket.on("registration_error", handleRegistrationError);
      socket.on("error", handleSocketError);
    }

    return () => {
      socket.off("registration_success", handleRegistrationSuccess);
      socket.off("registration_error", handleRegistrationError);
      socket.off("error", handleSocketError);
    };
  }, [userName, isRegistered, isSocketConnected]);

  useEffect(() => {
    if (!isRegistered || !isSocketConnected) {
      return;
    }

    const handleNewPoll = (poll) => {
      console.log("New poll received:", poll);

      const options = poll.options.map((text, index) => ({
        id: index + 1,
        text,
        votes: 0,
      }));

      setPollData({ question: poll.question, options });
      setIsPollActive(true);
      setTimeLeft(poll.duration || 60);
      setHasVoted(false);
      setShowResults(false);
      setIsActive(true);
      setSelectedOption(null);
    };

    const handleUpdateStats = (result) => {
      console.log("Stats update received:", result);

      if (!pollData) return;

      const newOptions = pollData.options.map((option, index) => ({
        ...option,
        votes: result.counts[index] || 0,
      }));

      setPollData({ ...pollData, options: newOptions });
    };

    const handlePollEnded = (result) => {
      console.log("Poll ended:", result);
      setIsActive(false);
      setShowResults(true);
    };

    const handleAnswerSubmitted = ({ selectedIndex, isCorrect }) => {
      console.log("Answer submitted confirmation:", {
        selectedIndex,
        isCorrect,
      });
    };

    socket.emit("get_current_poll");

    socket.on("new_poll", handleNewPoll);
    socket.on("update_stats", handleUpdateStats);
    socket.on("poll_ended", handlePollEnded);
    socket.on("answer_submitted", handleAnswerSubmitted);
    socket.on("current_poll", handleNewPoll);

    return () => {
      socket.off("new_poll", handleNewPoll);
      socket.off("update_stats", handleUpdateStats);
      socket.off("poll_ended", handlePollEnded);
      socket.off("answer_submitted", handleAnswerSubmitted);
      socket.off("current_poll", handleNewPoll);
    };
  }, [isRegistered, isSocketConnected, pollData]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0 && !hasVoted && isPollActive) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, hasVoted, isPollActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const calculatePercentages = () => {
    const total = pollData.options.reduce(
      (sum, option) => sum + option.votes,
      0
    );
    return pollData.options.map((option) => ({
      ...option,
      percentage: total > 0 ? Math.round((option.votes / total) * 100) : 0,
    }));
  };

  const getColorIntensity = (percentage) => {
    if (percentage >= 70) return "bg-[#6766D5]";
    if (percentage >= 50) return "bg-[#6766D5]";
    if (percentage >= 30) return "bg-[#6766D5]";
    if (percentage >= 15) return "bg-[#6766D5]";
    if (percentage >= 5) return "bg-[#6766D5]";
    return "bg-gray-200";
  };

  const handleOptionSelect = (optionId) => {
    if (!hasVoted && timeLeft > 0 && isActive) {
      setSelectedOption(optionId);
    }
  };

  const handleSubmitVote = () => {
    if (selectedOption && !hasVoted && timeLeft > 0 && isActive) {
      console.log("Submitting vote for option:", selectedOption - 1);
      socket.emit("submit_answer", { selectedIndex: selectedOption - 1 });
      setHasVoted(true);
      setShowResults(true);
      setIsActive(false);
    }
  };

  const optionsWithPercentages = pollData ? calculatePercentages() : [];
  const totalVotes = optionsWithPercentages.reduce(
    (sum, option) => sum + option.votes,
    0
  );

  console.log(
    "Socket connected:",
    isSocketConnected,
    "Registered:",
    isRegistered,
    "Poll active:",
    isPollActive,
    "Poll data:",
    pollData
  );

  if (!isSocketConnected || !isRegistered || (!isPollActive && !pollData)) {
    let statusMessage = "Connecting...";

    if (!isSocketConnected) {
      statusMessage = "Connecting to server...";
    } else {
      statusMessage = "Wait for the teacher to ask questions..";
    }

    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-white">
        <div className="flex justify-center mb-4">
          <button
            className="px-2.5 py-1.5 rounded-3xl shadow-md"
            style={{
              background: "linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)",
            }}
          >
            <div className="flex items-center space-x-2">
              <img src={staricon} alt="star icon" className="w-6 h-6" />
              <h1 className="font-sora font-semibold text-white text-lg">
                Intervue Poll
              </h1>
            </div>
          </button>
        </div>
        <p className="text-center font-sora font-semibold text-xl text-gray-700">
          {statusMessage}
        </p>
        <div className="mt-4 text-sm text-gray-500">
          {userName && `Logged in as: ${userName}`}
        </div>
        {!isSocketConnected && (
          <div className="mt-2 text-xs text-red-500">
            Connection status: Disconnected
          </div>
        )}
        <ChatButton
          isOpen={isChatOpen}
          onClick={handleChatToggle}
          hasUnreadMessages={hasUnreadMessages}
        />
        <ChatWindow
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          isTeacher={false}
          userName={userName || "Student"}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex items-center justify-center px-4 min-h-screen">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Question</h2>
          {!showResults && (
            <div className="flex items-center space-x-1">
              <svg
                className="w-4 h-4 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-500 font-medium text-sm">
                {formatTime(timeLeft)}
              </span>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="bg-gray-700 text-white p-3 rounded">
            <p className="text-sm font-medium">{pollData.question}</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {showResults
            ? optionsWithPercentages.map((option) => (
                <div key={option.id} className="relative">
                  <div className="flex items-center">
                    <div className="flex-1 relative">
                      <div className="flex items-center bg-gray-100 rounded-md h-10 relative overflow-hidden">
                        <div
                          className={`h-full rounded-md transition-all duration-500 ${getColorIntensity(
                            option.percentage
                          )}`}
                          style={{ width: `${option.percentage}%` }}
                        ></div>
                        <div className="absolute left-3 flex items-center space-x-2 z-10">
                          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-semibold text-gray-700">
                            {option.id}
                          </div>
                          <span
                            className={`text-sm font-medium ${
                              option.percentage > 30
                                ? "text-white"
                                : "text-gray-700"
                            }`}
                          >
                            {option.text}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-3 min-w-16 text-right">
                      <span className="text-sm font-semibold text-gray-700">
                        {option.percentage}%
                      </span>
                      <div className="text-xs text-gray-500">
                        {option.votes} votes
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : pollData.options.map((option) => (
                <div key={option.id} className="relative">
                  <button
                    onClick={() => handleOptionSelect(option.id)}
                    disabled={timeLeft === 0 || hasVoted}
                    className={`w-full flex items-center bg-gray-100 rounded-md h-10 relative overflow-hidden transition-all duration-200 ${
                      selectedOption === option.id
                        ? "ring-2 ring-purple-500 bg-purple-50"
                        : "hover:bg-gray-200"
                    } ${
                      timeLeft === 0 || hasVoted
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    {selectedOption === option.id && (
                      <div className="absolute inset-0 bg-purple-100 opacity-50"></div>
                    )}
                    <div className="absolute left-3 flex items-center space-x-2 z-10">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${
                          selectedOption === option.id
                            ? "bg-purple-500 text-white"
                            : "bg-white text-gray-700"
                        }`}
                      >
                        {option.id}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {option.text}
                      </span>
                    </div>
                  </button>
                </div>
              ))}
        </div>

        {showResults ? (
          <>
            <div className="mb-4 text-center">
              <span className="text-sm text-gray-600">
                Total responses: {totalVotes}
              </span>
            </div>
            <div className="text-center">
              <p className="text-gray-600 font-medium">
                Wait for the teacher to ask a new question..
              </p>
            </div>
            <div className="mt-6 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-500">
                Live results updating
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <button
                onClick={handleSubmitVote}
                disabled={!selectedOption || timeLeft === 0 || hasVoted}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedOption && timeLeft > 0 && !hasVoted
                    ? "bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Submit Answer
              </button>
            </div>
            {timeLeft <= 10 && timeLeft > 0 && (
              <div className="text-center mb-4">
                <p className="text-red-600 font-medium text-sm animate-pulse">
                  Hurry up! Only {timeLeft} seconds left!
                </p>
              </div>
            )}
            {timeLeft === 0 && (
              <div className="text-center mb-4">
                <p className="text-red-600 font-medium">
                  Time's up! Showing live results...
                </p>
              </div>
            )}
          </>
        )}
      </div>
      <ChatButton
        isOpen={isChatOpen}
        onClick={handleChatToggle}
        hasUnreadMessages={hasUnreadMessages}
      />
      <ChatWindow
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        isTeacher={false}
        userName={userName || "Student"}
      />
    </div>
  );
};

export default StudentPollInterface;
