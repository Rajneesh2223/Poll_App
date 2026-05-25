import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Shield, Wifi, WifiOff } from "lucide-react";
import { socket } from "../utils/socket";
import CommonLogo from "./CommonLogo";

const Teacher = () => {
  const [teacherName, setTeacherName] = useState("");
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const hasRegistered = useRef(false);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => {
      setIsConnected(false);
      hasRegistered.current = false;
    };
    const onSuccess = (data) => {
      setIsRegistering(false);
      hasRegistered.current = true;
      sessionStorage.setItem("userName", data.name);
      sessionStorage.setItem("userRole", data.role);
      sessionStorage.setItem("isRegistered", "true");
      navigate("/teacher-dashboard");
    };
    const onError = (err) => {
      setError(typeof err === "string" ? err : "Registration failed. Please try again.");
      setIsRegistering(false);
      hasRegistered.current = false;
    };

    if (socket.connected) setIsConnected(true);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("registration_success", onSuccess);
    socket.on("registration_error", onError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("registration_success", onSuccess);
      socket.off("registration_error", onError);
    };
  }, [navigate]);

  const handleSubmit = () => {
    if (!teacherName.trim()) { setError("Please enter your name."); return; }
    if (!isConnected) { setError("Not connected. Please refresh the page."); return; }
    if (isRegistering || hasRegistered.current) return;
    setError("");
    setIsRegistering(true);
    socket.emit("register_user", { name: teacherName.trim(), role: "teacher" });
    setTimeout(() => {
      if (!hasRegistered.current) {
        setError("Connection timeout. Please try again.");
        setIsRegistering(false);
      }
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <CommonLogo />
          <div
            className="mt-6 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ background: "linear-gradient(135deg, #7565D9, #4D0ACD)" }}
          >
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Enter your name to access poll creation &amp; management
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">Your Name</label>
            <div
              className={`flex items-center space-x-1 text-xs font-medium ${
                isConnected ? "text-green-500" : "text-orange-400"
              }`}
            >
              {isConnected ? (
                <Wifi className="w-3 h-3" />
              ) : (
                <WifiOff className="w-3 h-3" />
              )}
              <span>{isConnected ? "Connected" : "Connecting…"}</span>
            </div>
          </div>

          <input
            type="text"
            value={teacherName}
            onChange={(e) => { setTeacherName(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="e.g. Prof. Sharma"
            disabled={isRegistering}
            autoFocus
            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 text-gray-900 placeholder-gray-400 text-sm transition-colors"
          />

          {error && (
            <p className="mt-2 text-xs text-red-500 font-medium">{error}</p>
          )}

          <button
            id="teacher-enter-btn"
            onClick={handleSubmit}
            disabled={isRegistering || !isConnected || !teacherName.trim()}
            className={`w-full mt-5 flex items-center justify-center space-x-2 py-3.5 rounded-2xl font-bold text-white text-sm transition-all duration-200 ${
              !isRegistering && isConnected && teacherName.trim()
                ? "hover:scale-[1.02] hover:shadow-lg active:scale-[0.99]"
                : "opacity-50 cursor-not-allowed"
            }`}
            style={{ background: "linear-gradient(135deg, #7565D9, #4D0ACD)" }}
          >
            {isRegistering ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Setting up…</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Enter Dashboard</span>
              </>
            )}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          You'll be able to create polls, monitor students, and view results.
        </p>
      </div>
    </div>
  );
};

export default Teacher;
