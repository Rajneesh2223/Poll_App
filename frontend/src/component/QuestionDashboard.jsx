import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  History,
  Plus,
  Send,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { socket } from "../utils/socket";
import ChatButton from "./ChatButton";
import ChatWindow from "./ChatWindow";
import CommonLogo from "./CommonLogo";

const DURATION_OPTIONS = [30, 60, 90, 120, 180, 300];

const QuestionDashboard = () => {
  const [options, setOptions] = useState([
    { id: 1, text: "", isCorrect: true },
    { id: 2, text: "", isCorrect: false },
  ]);
  const [question, setQuestion] = useState("");
  const [duration, setDuration] = useState(60);
  const [nextId, setNextId] = useState(3);
  const [isRegistered, setIsRegistered] = useState(false);
  const [teacherName, setTeacherName] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [pollStatus, setPollStatus] = useState(null); // null | "sending" | "success" | "error"
  const [connectedStudents, setConnectedStudents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const reg = sessionStorage.getItem("isRegistered");
    const name = sessionStorage.getItem("userName");
    const role = sessionStorage.getItem("userRole");

    if (reg === "true" && name && role === "teacher") {
      setIsRegistered(true);
      setTeacherName(name);
    } else {
      navigate("/teacher");
      return;
    }

    const onUserList = (users) => {
      setConnectedStudents(Array.isArray(users) ? users.filter((u) => u.role === "student") : []);
    };
    const onSocketError = () => {
      setPollStatus("error");
      setTimeout(() => setPollStatus(null), 3000);
    };

    socket.on("update_user_list", onUserList);
    socket.on("error", onSocketError);

    return () => {
      socket.off("update_user_list", onUserList);
      socket.off("error", onSocketError);
    };
  }, [navigate]);

  // ── Option helpers ──────────────────────────────────────────────────────────
  const addOption = () => {
    if (options.length >= 6) return;
    setOptions([...options, { id: nextId, text: "", isCorrect: false }]);
    setNextId((n) => n + 1);
  };

  const removeOption = (id) => {
    if (options.length <= 2) return;
    // If the removed option was the correct one, assign correct to first remaining
    setOptions((prev) => {
      const filtered = prev.filter((o) => o.id !== id);
      const hasCorrect = filtered.some((o) => o.isCorrect);
      if (!hasCorrect && filtered.length > 0) filtered[0].isCorrect = true;
      return filtered;
    });
  };

  const setCorrect = (id) =>
    setOptions((prev) => prev.map((o) => ({ ...o, isCorrect: o.id === id })));

  const updateText = (id, text) =>
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)));

  // ── Create poll ─────────────────────────────────────────────────────────────
  const handleCreatePoll = () => {
    const filled = options.filter((o) => o.text.trim());
    if (!question.trim()) {
      alert("Please enter a question.");
      return;
    }
    if (filled.length < 2) {
      alert("Please fill in at least 2 options.");
      return;
    }
    const correctIdx = options.findIndex((o) => o.isCorrect);
    if (correctIdx === -1) {
      alert("Please mark one correct answer.");
      return;
    }

    const payload = {
      question: question.trim(),
      options: options.map((o) => o.text.trim()).filter(Boolean),
      correctAnswerIndex: correctIdx,
      duration,
    };

    setPollStatus("sending");
    socket.emit("create_poll", payload);

    const onNewPoll = () => {
      setPollStatus("success");
      setQuestion("");
      setOptions([
        { id: 1, text: "", isCorrect: true },
        { id: 2, text: "", isCorrect: false },
      ]);
      setNextId(3);
      setTimeout(() => setPollStatus(null), 4000);
      socket.off("new_poll", onNewPoll);
    };
    socket.once("new_poll", onNewPoll);
  };

  // ── Loading guard ────────────────────────────────────────────────────────────
  if (!isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <CommonLogo />

          <div className="flex items-center space-x-5">
            {/* Students counter */}
            <div className="hidden sm:flex items-center space-x-2 bg-purple-50 px-3 py-1.5 rounded-full">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">
                {connectedStudents.length} online
              </span>
            </div>

            {/* Poll history link */}
            <button
              onClick={() => navigate("/poll-history")}
              className="hidden sm:flex items-center space-x-1 text-sm text-gray-500 hover:text-purple-700 font-medium transition-colors"
            >
              <History className="w-4 h-4" />
              <span>History</span>
            </button>

            <div className="h-5 w-px bg-gray-200" />

            <div className="text-right">
              <p className="text-xs text-gray-400">Logged in as</p>
              <p className="text-sm font-bold text-gray-800">{teacherName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create a Poll</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Write your question, configure options, and broadcast to all
            connected students instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* ── Left column: editor ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Question card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-900">Your Question</h2>
                <span
                  className={`text-xs font-semibold ${
                    question.length > 90 ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  {question.length}/100
                </span>
              </div>
              <textarea
                id="poll-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value.slice(0, 100))}
                placeholder="e.g. What is the powerhouse of the cell?"
                rows={3}
                className="w-full resize-none border-2 border-gray-200 rounded-xl p-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
              />
            </div>

            {/* Options card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-1">
                Answer Options
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Click the numbered badge to mark the correct answer.
              </p>

              <div className="space-y-3">
                {options.map((opt, idx) => (
                  <div
                    key={opt.id}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl border-2 transition-all ${
                      opt.isCorrect
                        ? "border-emerald-400 bg-emerald-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    {/* Correct toggle badge */}
                    <button
                      title="Mark as correct answer"
                      onClick={() => setCorrect(opt.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                        opt.isCorrect
                          ? "bg-emerald-500 text-white shadow-md"
                          : "bg-white border-2 border-gray-300 text-gray-500 hover:border-emerald-400"
                      }`}
                    >
                      {opt.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        idx + 1
                      )}
                    </button>

                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => updateText(opt.id, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder-gray-400 font-medium"
                    />

                    {options.length > 2 && (
                      <button
                        onClick={() => removeOption(opt.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove option"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                {options.length < 6 && (
                  <button
                    onClick={addOption}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 font-semibold text-sm py-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add option</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Right column: settings + send ─────────────────────────── */}
          <div className="space-y-4">
            {/* Timer */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="w-5 h-5 text-purple-600" />
                <h2 className="text-base font-bold text-gray-900">Time Limit</h2>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {DURATION_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                      duration === d
                        ? "text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    style={
                      duration === d
                        ? {
                            background:
                              "linear-gradient(135deg,#7565D9,#4D0ACD)",
                          }
                        : {}
                    }
                  >
                    {d < 60 ? `${d}s` : `${d / 60}m`}
                  </button>
                ))}
              </div>
            </div>

            {/* Students online */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center space-x-2 mb-3">
                <Users className="w-5 h-5 text-purple-600" />
                <h2 className="text-base font-bold text-gray-900">Students Online</h2>
              </div>
              {connectedStudents.length === 0 ? (
                <p className="text-sm text-gray-400 italic">
                  No students connected yet.
                </p>
              ) : (
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {connectedStudents.map((s, i) => (
                    <div
                      key={s.id || i}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                      <span className="text-sm text-gray-700 font-medium">
                        {s.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Send button */}
            <button
              id="ask-question-btn"
              onClick={handleCreatePoll}
              disabled={pollStatus === "sending"}
              className={`w-full flex items-center justify-center space-x-3 py-4 rounded-2xl font-bold text-white text-sm transition-all duration-200 shadow-lg ${
                pollStatus === "sending"
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
              }`}
              style={{
                background: "linear-gradient(135deg, #7565D9, #4D0ACD)",
              }}
            >
              {pollStatus === "sending" ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Broadcasting…</span>
                </>
              ) : pollStatus === "success" ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Poll Sent!</span>
                </>
              ) : pollStatus === "error" ? (
                <>
                  <XCircle className="w-5 h-5" />
                  <span>Failed — Try Again</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Ask Question</span>
                </>
              )}
            </button>

            {pollStatus === "success" && (
              <p className="text-center text-sm text-emerald-600 font-semibold">
                ✓ Poll is live to all students
              </p>
            )}
          </div>
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
        isTeacher
        userName={teacherName}
      />
    </div>
  );
};

export default QuestionDashboard;
