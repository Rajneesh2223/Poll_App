import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  Send,
  Users,
  Zap,
} from "lucide-react";
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
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [totalVoters, setTotalVoters] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const userName =
    location.state?.userName || sessionStorage.getItem("userName");

  // Redirect if no userName
  useEffect(() => {
    if (!userName) navigate("/student");
  }, [userName, navigate]);

  // ── Socket connection tracking ──────────────────────────────────────────────
  useEffect(() => {
    const onConnect = () => setIsSocketConnected(true);
    const onDisconnect = () => {
      setIsSocketConnected(false);
      setIsRegistered(false);
    };
    if (socket.connected) setIsSocketConnected(true);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  // ── Registration ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isSocketConnected || !userName) return;

    const onSuccess = (data) => {
      setIsRegistered(true);
      sessionStorage.setItem("userName", data.name);
      sessionStorage.setItem("userRole", data.role);
      sessionStorage.setItem("isRegistered", "true");
    };
    const onError = () => {
      // If already registered in this session, mark as registered
      if (sessionStorage.getItem("isRegistered") === "true") {
        setIsRegistered(true);
      }
    };

    socket.on("registration_success", onSuccess);
    socket.on("registration_error", onError);

    if (!isRegistered) {
      socket.emit("register_user", { name: userName, role: "student" });
    }

    return () => {
      socket.off("registration_success", onSuccess);
      socket.off("registration_error", onError);
    };
  }, [isSocketConnected, userName, isRegistered]);

  // ── Poll event listeners ─────────────────────────────────────────────────────
  // ⚠️  CRITICAL BUG FIX: `pollData` is NOT in the dependency array.
  //     Previously, every `update_stats` changed `pollData`, which re-ran this
  //     effect (cleanup → re-register), causing the socket listeners to
  //     constantly tear down / rebuild, effectively breaking click handling.
  //     Using the functional form of setPollData removes the need for the
  //     `pollData` dependency entirely.
  useEffect(() => {
    if (!isRegistered || !isSocketConnected) return;

    const handleNewPoll = (poll) => {
      const options = poll.options.map((text, idx) => ({
        id: idx + 1,
        text,
        votes: 0,
      }));
      setPollData({ question: poll.question, options });
      setIsPollActive(true);
      setTimeLeft(poll.duration || 60);
      setHasVoted(false);
      setShowResults(false);
      setIsTimerActive(true);
      setSelectedOption(null);
      setTotalVoters(0);
    };

    // Functional setter — no stale closure, no `pollData` dependency needed
    const handleUpdateStats = (result) => {
      setPollData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          options: prev.options.map((opt, idx) => ({
            ...opt,
            votes: result.counts?.[idx] ?? 0,
          })),
        };
      });
      setTotalVoters(result.totalResponses ?? 0);
    };

    const handlePollEnded = (result) => {
      setIsTimerActive(false);
      setShowResults(true);
      setIsPollActive(false);
      if (result?.counts) {
        setPollData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            options: prev.options.map((opt, idx) => ({
              ...opt,
              votes: result.counts[idx] ?? 0,
            })),
          };
        });
      }
      setTotalVoters(result?.totalResponses ?? 0);
    };

    const handleCurrentPoll = (poll) => {
      if (poll) handleNewPoll(poll);
    };

    const handleKicked = () => {
      alert("You have been removed from the session by the teacher.");
      navigate("/");
    };

    socket.emit("get_current_poll");
    socket.on("new_poll", handleNewPoll);
    socket.on("update_stats", handleUpdateStats);
    socket.on("poll_ended", handlePollEnded);
    socket.on("current_poll", handleCurrentPoll);
    socket.on("kicked", handleKicked);

    return () => {
      socket.off("new_poll", handleNewPoll);
      socket.off("update_stats", handleUpdateStats);
      socket.off("poll_ended", handlePollEnded);
      socket.off("current_poll", handleCurrentPoll);
      socket.off("kicked", handleKicked);
    };
  }, [isRegistered, isSocketConnected, navigate]); // ← NO pollData!

  // ── Countdown timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isTimerActive || hasVoted) return;
    if (timeLeft <= 0) {
      setIsTimerActive(false);
      setShowResults(true);
      return;
    }
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsTimerActive(false);
          setShowResults(true);
          clearInterval(id);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isTimerActive, hasVoted, timeLeft]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const fmt = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const getTotal = () =>
    pollData ? pollData.options.reduce((s, o) => s + o.votes, 0) : 0;

  const getPct = (votes) => {
    const t = getTotal();
    return t > 0 ? Math.round((votes / t) * 100) : 0;
  };

  const submitVote = () => {
    if (!selectedOption || hasVoted || timeLeft <= 0 || !isTimerActive) return;
    socket.emit("submit_answer", { selectedIndex: selectedOption - 1 });
    setHasVoted(true);
    setShowResults(true);
    setIsTimerActive(false);
  };

  // ── Waiting screen ───────────────────────────────────────────────────────────
  if (!isSocketConnected || !isRegistered || (!isPollActive && !pollData)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50 px-4">
        <div className="text-center max-w-sm">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #7565D9, #4D0ACD)",
            }}
          >
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {!isSocketConnected ? "Connecting…" : "Waiting for Poll"}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {!isSocketConnected
              ? "Establishing connection to the server…"
              : `Hi ${userName}! Your teacher will start a poll shortly.`}
          </p>
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
        <ChatButton
          isOpen={isChatOpen}
          onClick={() => {
            setIsChatOpen((p) => !p);
            setHasUnreadMessages(false);
          }}
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

  const totalVotes = getTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-6 px-4">
      <div className="max-w-xl mx-auto">
        {/* Status bar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-1.5 shadow-sm border border-gray-100">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">
              {userName}
            </span>
          </div>

          {!showResults && (
            <div
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-full font-bold text-sm shadow-sm ${
                timeLeft <= 10
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-white border border-gray-200 text-gray-700"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{fmt(timeLeft)}</span>
            </div>
          )}
        </div>

        {/* Main poll card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Question */}
          <div
            className="px-7 pt-7 pb-6"
            style={{
              background: "linear-gradient(135deg, #7565D9 0%, #4D0ACD 100%)",
            }}
          >
            <p className="text-purple-200 text-xs font-bold uppercase tracking-widest mb-2">
              Question
            </p>
            <h1 className="text-white text-xl font-bold leading-relaxed">
              {pollData.question}
            </h1>
          </div>

          {/* Options */}
          <div className="p-6 space-y-3">
            {showResults
              ? // ── Results view ──────────────────────────────────────────
                pollData.options.map((opt, idx) => {
                  const pct = getPct(opt.votes);
                  const isMine = selectedOption === opt.id;
                  return (
                    <div
                      key={opt.id}
                      className="relative rounded-2xl overflow-hidden"
                    >
                      <div className="relative flex items-center h-14 bg-gray-50 overflow-hidden rounded-2xl">
                        {/* Progress bar */}
                        <div
                          className="absolute left-0 top-0 h-full rounded-2xl transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: isMine
                              ? "linear-gradient(90deg,#7565D9,#4D0ACD)"
                              : "linear-gradient(90deg,#E0E7FF,#C7D2FE)",
                          }}
                        />
                        <div className="relative z-10 flex items-center justify-between w-full px-4">
                          <div className="flex items-center space-x-3">
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                isMine
                                  ? "bg-white text-purple-700"
                                  : "bg-white text-gray-500"
                              }`}
                            >
                              {idx + 1}
                            </span>
                            <span
                              className={`text-sm font-semibold ${
                                isMine ? "text-white" : "text-gray-700"
                              }`}
                            >
                              {opt.text}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {isMine && (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                            <span
                              className={`text-sm font-bold ${
                                isMine ? "text-white" : "text-gray-600"
                              }`}
                            >
                              {pct}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : // ── Voting view ───────────────────────────────────────────
                pollData.options.map((opt, idx) => {
                  const isSelected = selectedOption === opt.id;
                  const disabled = hasVoted || timeLeft <= 0;
                  return (
                    <button
                      key={opt.id}
                      id={`option-${opt.id}`}
                      onClick={() => {
                        if (!disabled) setSelectedOption(opt.id);
                      }}
                      disabled={disabled}
                      className={`w-full flex items-center space-x-3 h-14 px-4 rounded-2xl border-2 text-left transition-all duration-150 ${
                        isSelected
                          ? "border-purple-500 bg-purple-50 shadow-md scale-[1.02]"
                          : "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/40"
                      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-[0.99]"}`}
                    >
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                          isSelected
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          idx + 1
                        )}
                      </span>
                      <span
                        className={`flex-1 text-sm font-semibold ${
                          isSelected ? "text-purple-800" : "text-gray-700"
                        }`}
                      >
                        {opt.text}
                      </span>
                    </button>
                  );
                })}
          </div>

          {/* Footer action */}
          <div className="px-6 pb-6">
            {showResults ? (
              <div className="text-center space-y-1">
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {hasVoted ? "Answer submitted!" : "Poll has ended"}
                  </span>
                </div>
                <p className="text-gray-400 text-xs">
                  {totalVotes} response{totalVotes !== 1 ? "s" : ""} ·
                  Waiting for next question…
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  {selectedOption
                    ? "Ready to submit"
                    : "Select an option above"}
                </p>
                <button
                  id="submit-vote-btn"
                  onClick={submitVote}
                  disabled={!selectedOption || hasVoted || timeLeft <= 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-200 ${
                    selectedOption && !hasVoted && timeLeft > 0
                      ? "text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                  style={
                    selectedOption && !hasVoted && timeLeft > 0
                      ? {
                          background:
                            "linear-gradient(135deg,#7565D9,#4D0ACD)",
                        }
                      : {}
                  }
                >
                  <Send className="w-4 h-4" />
                  <span>Submit</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live indicator */}
        <div className="mt-4 flex items-center justify-center space-x-2 text-gray-400 text-xs">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>
            Live · {totalVoters} student{totalVoters !== 1 ? "s" : ""}{" "}
            responded
          </span>
        </div>
      </div>

      <ChatButton
        isOpen={isChatOpen}
        onClick={() => {
          setIsChatOpen((p) => !p);
          setHasUnreadMessages(false);
        }}
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
