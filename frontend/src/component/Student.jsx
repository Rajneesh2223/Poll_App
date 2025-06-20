import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import staricon from "../assets/herosection/staricon.svg";
import { socket } from "../utils/socket";

const Student = () => {
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const hasRegistered = useRef(false); // Prevent multiple registrations

  useEffect(() => {
    // Handle socket connection
    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
      setIsConnected(false);
      hasRegistered.current = false; // Reset on disconnect
    };

    const handleRegistrationSuccess = (data) => {
      console.log("Student registration successful:", data);
      setIsRegistering(false);
      hasRegistered.current = true;

      // Store registration data for the question page
      sessionStorage.setItem("userName", data.name);
      sessionStorage.setItem("userRole", data.role);
      sessionStorage.setItem("isRegistered", "true");

      // Navigate to question page (keeping original navigation)
      navigate("/question", {
        state: { userName: data.name, role: data.role },
      });
    };

    const handleRegistrationError = (error) => {
      console.error("Student registration failed:", error);
      setError(
        typeof error === "string"
          ? error
          : "Registration failed. Please try again."
      );
      setIsRegistering(false);
      hasRegistered.current = false;

      // Clear any stored data on error
      sessionStorage.removeItem("userName");
      sessionStorage.removeItem("userRole");
      sessionStorage.removeItem("isRegistered");
    };

    // Check if already connected
    if (socket.connected) {
      setIsConnected(true);
    }

    // Set up event listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("registration_success", handleRegistrationSuccess);
    socket.on("registration_error", handleRegistrationError);

    // Cleanup
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("registration_success", handleRegistrationSuccess);
      socket.off("registration_error", handleRegistrationError);
    };
  }, [navigate]);

  const handleContinue = () => {
    // Validate input
    if (!userName.trim()) {
      setError("Please enter your name to continue.");
      return;
    }

    // Check socket connection
    if (!isConnected) {
      setError("Connection lost. Please refresh the page.");
      return;
    }

    // Prevent multiple registrations
    if (isRegistering || hasRegistered.current) {
      console.log("Registration already in progress or completed");
      return;
    }

    setError("");
    setIsRegistering(true);

    // Emit registration with validation
    const trimmedName = userName.trim();
    console.log("Registering student:", trimmedName);

    socket.emit("register_user", {
      name: trimmedName,
      role: "student",
    });

    // Fallback timeout in case server doesn't respond
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-7xl w-full space-y-8">
        <div className="flex justify-center">
          <button
            className="px-2.5 py-1.5 rounded-3xl"
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

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-sora font-normal">
            Let's{" "}
            <span className="font-sora text-4xl font-semibold">
              Get Started{" "}
            </span>
          </h1>
          <p className="text-xl text-[#00000080] font-sora">
            If you're a student, you'll be able to{" "}
            <span className="font-sora font-semibold text-[#000000]">
              submit your answers
            </span>
            , participate in live <br /> polls, and see how your responses
            compare with your classmates
          </p>
        </div>

        <div className="flex justify-center">
          <div className="flex flex-col space-y-2 w-[507px]">
            <label
              htmlFor="name"
              className="text-xl font-normal font-sora text-gray-700"
            >
              Enter Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Your name"
              className="font-sora font-normal text-xl px-5 py-5 border border-gray-300 rounded-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#F2F2F2]"
              disabled={isRegistering}
            />
            {error && <span className="text-red-500 text-sm">{error}</span>}
            {!isConnected && (
              <span className="text-orange-500 text-sm">
                Connecting to server...
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-center items-center">
          <button
            className={`rounded-[34px] text-white align-middle font-sora px-16 w-[233px] h-[57px] ${
              isRegistering || !isConnected
                ? "opacity-50 cursor-not-allowed"
                : ""
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

export default Student;
