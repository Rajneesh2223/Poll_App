import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  ArrowLeft,
} from "lucide-react";

const TeacherPollHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const base =
          import.meta.env.VITE_API_URL || "http://localhost:4000";
        const res = await fetch(`${base}/api/poll-history`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading poll history…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50 px-4">
        <div className="bg-white rounded-2xl p-8 text-center shadow-lg max-w-sm w-full">
          <p className="text-red-500 mb-4 text-sm">Failed to load: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl text-white text-sm font-bold"
            style={{ background: "linear-gradient(135deg,#7565D9,#4D0ACD)" }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate("/teacher-dashboard")}
            className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-purple-700 hover:border-purple-300 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
              <BarChart2 className="w-6 h-6 text-purple-600" />
              <span>Poll History</span>
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {history.length} poll{history.length !== 1 ? "s" : ""} conducted
            </p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="bg-white rounded-2xl p-14 text-center shadow-sm border border-gray-100">
            <BarChart2 className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No polls conducted yet.</p>
            <p className="text-gray-400 text-sm mt-1">
              Create your first poll from the dashboard.
            </p>
            <button
              onClick={() => navigate("/teacher-dashboard")}
              className="mt-5 px-5 py-2.5 rounded-xl text-white text-sm font-bold"
              style={{ background: "linear-gradient(135deg,#7565D9,#4D0ACD)" }}
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((poll, idx) => {
              const isOpen = expandedId === (poll._id || idx);
              const total = poll.responses?.length ?? 0;
              const date = poll.createdAt
                ? new Date(poll.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—";

              return (
                <div
                  key={poll._id || idx}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* Accordion header */}
                  <button
                    onClick={() =>
                      setExpandedId(isOpen ? null : poll._id || idx)
                    }
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg,#7565D9,#4D0ACD)",
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm leading-snug">
                          {poll.question}
                        </p>
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-1.5">
                          <span className="flex items-center space-x-1 text-xs text-gray-400">
                            <User className="w-3 h-3" />
                            <span>{poll.createdBy || "—"}</span>
                          </span>
                          <span className="flex items-center space-x-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{date}</span>
                          </span>
                          <span className="text-xs font-semibold text-purple-600">
                            {total} response{total !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  {/* Accordion body */}
                  {isOpen && (
                    <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-2">
                      {poll.options?.map((opt, i) => {
                        const count =
                          poll.responses?.filter(
                            (r) => r.selectedIndex === i
                          ).length ?? 0;
                        const pct =
                          total > 0
                            ? Math.round((count / total) * 100)
                            : 0;
                        const correct = i === poll.correctAnswerIndex;
                        return (
                          <div
                            key={i}
                            className="relative rounded-xl overflow-hidden"
                          >
                            <div className="flex items-center h-11 bg-gray-50 relative overflow-hidden rounded-xl">
                              {/* Fill bar */}
                              <div
                                className="absolute left-0 top-0 h-full rounded-xl transition-all duration-500"
                                style={{
                                  width: `${pct}%`,
                                  background: correct
                                    ? "linear-gradient(90deg,#10B981,#059669)"
                                    : "linear-gradient(90deg,#E0E7FF,#C7D2FE)",
                                }}
                              />
                              <div className="relative z-10 flex items-center justify-between w-full px-3">
                                <div className="flex items-center space-x-2">
                                  {correct && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                  )}
                                  <span className="text-sm text-gray-800 font-medium">
                                    {opt}
                                  </span>
                                </div>
                                <span className="text-sm font-bold text-gray-600">
                                  {pct}%{" "}
                                  <span className="font-normal text-gray-400">
                                    ({count})
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherPollHistory;