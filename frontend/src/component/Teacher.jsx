import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
      setIsConnected(false);
      hasRegistered.current = false;
    };

    const handleRegistrationSuccess = (data) => {
      console.log("Teacher registration successful:", data);
      setIsRegistering(false);
      hasRegistered.current = true;

      sessionStorage.setItem("teacherName", data.name);
      sessionStorage.setItem("userRole", data.role);
      sessionStorage.setItem("isRegistered", "true");

      navigate("/teacher-dashboard");
    };

    const handleRegistrationError = (error) => {
      console.error("Teacher registration failed:", error);
      setError(
        typeof error === "string"
          ? error
          : "Registration failed. Please try again."
      );
      setIsRegistering(false);
      hasRegistered.current = false;

      sessionStorage.removeItem("teacherName");
      sessionStorage.removeItem("userRole");
      sessionStorage.removeItem("isRegistered");
    };

    if (socket.connected) {
      setIsConnected(true);
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("registration_success", handleRegistrationSuccess);
    socket.on("registration_error", handleRegistrationError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("registration_success", handleRegistrationSuccess);
      socket.off("registration_error", handleRegistrationError);
    };
  }, [navigate]);

  const handleContinue = () => {
    if (!teacherName.trim()) {
      setError("Please enter your name to continue.");
      return;
    }

    if (!isConnected) {
      setError("Connection lost. Please refresh the page.");
      return;
    }

    if (isRegistering || hasRegistered.current) {
      console.log("Registration already in progress or completed");
      return;
    }

    setError("");
    setIsRegistering(true);

    const trimmedName = teacherName.trim();
    console.log("Registering teacher:", trimmedName);

    socket.emit("register_user", {
      name: trimmedName,
      role: "teacher",
    });

    setTimeout(() => {
      if (isRegistering && !hasRegistered.current) {
        setError("Registration timeout. Please try again.");
        setIsRegistering(false);
      }
    }, 5000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleContinue();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full space-y-6 sm:space-y-8">
        <CommonLogo />

        <div className="text-center space-y-3 sm:space-y-4 px-2 sm:px-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sora font-normal">
            Let's{" "}
            <span className="font-sora text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Get Started{" "}
            </span>
          </h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-base sm:text-lg lg:text-xl text-[#00000080] font-sora leading-relaxed px-2">
              As a teacher, you'll have the ability to{" "}
              <span className="font-sora font-semibold text-[#000000]">
                create and manage polls
              </span>
              , ask questions, and monitor your students' responses in real-time
            </p>
          </div>
        </div>

        <div className="flex justify-center px-4">
          <div className="flex flex-col space-y-2 w-full max-w-md sm:max-w-lg">
            <label
              htmlFor="name"
              className="text-lg sm:text-xl font-normal font-sora text-gray-700"
            >
              Enter Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Your name"
              className="font-sora font-normal text-lg sm:text-xl px-4 sm:px-5 py-4 sm:py-5 border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#F2F2F2] w-full"
              disabled={isRegistering}
            />
            {error && (
              <span className="text-red-500 text-sm break-words">{error}</span>
            )}
            {!isConnected && (
              <span className="text-orange-500 text-sm">
                Connecting to server...
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-center items-center px-4">
          <button
            className={`rounded-[34px] text-white font-sora px-8 sm:px-12 lg:px-16 py-3 sm:py-4 w-full max-w-xs sm:max-w-sm lg:w-[233px] lg:h-[57px] text-base sm:text-lg transition-all duration-200 ${
              isRegistering || !isConnected
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90"
            }`}
            style={{
              background: "linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)",
            }}
            onClick={handleContinue}
            disabled={isRegistering || !isConnected}
          >
            {isRegistering ? "Registering..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Teacher;
