import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonLogo from "./CommonLogo";

const Hero = () => {
  const [role, setRole] = useState();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full space-y-6 sm:space-y-8 mt-9">
        <CommonLogo />

        <div className="text-center space-y-3 sm:space-y-4 px-2 sm:px-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sora font-normal">
            Welcome to the{" "}
            <span className="font-sora text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Live Polling System{" "}
            </span>
          </h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-base sm:text-lg lg:text-xl text-[#00000080] font-sora leading-relaxed px-2">
              Please select the role that best describes you to begin using the
              live polling system
            </p>
          </div>
        </div>

        <div className="flex justify-center px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl w-full">
            <div
              onClick={() => setRole("student")}
              className={`p-[3px] rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                role === "student"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600"
                  : "bg-gradient-to-r from-[#7765DA10] to-[#1D68BD10]"
              }`}
            >
              <div className="bg-white rounded-lg p-4 sm:p-6 h-full text-center">
                <h1 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 font-sora">
                  I'm a Student
                </h1>
                <p className="text-gray-600 text-sm sm:text-base font-sora leading-relaxed">
                  Join live polls, submit your answers, and see how your
                  responses compare with your classmates in real-time
                </p>
              </div>
            </div>

            <div
              onClick={() => setRole("teacher")}
              className={`p-[3px] rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
                role === "teacher"
                  ? "bg-gradient-to-r from-purple-600 to-blue-600"
                  : "bg-gradient-to-r from-[#7765DA10] to-[#1D68BD10]"
              }`}
            >
              <div className="bg-white rounded-lg p-4 sm:p-6 h-full text-center">
                <h1 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 font-sora">
                  I'm a Teacher
                </h1>
                <p className="text-gray-600 text-sm sm:text-base font-sora leading-relaxed">
                  Create and manage polls, ask questions, and monitor your
                  students' responses in real-time
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center px-4">
          <button
            disabled={!role}
            onClick={() => {
              sessionStorage.setItem("role", role);
              navigate(`/${role}`);
            }}
            className={`py-3 sm:py-4 lg:py-5 rounded-[34px] text-white font-sora px-8 sm:px-12 lg:px-16 w-full max-w-xs sm:max-w-sm lg:w-[233px] text-base sm:text-lg transition-all duration-200 ${
              !role
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90 hover:scale-105"
            }`}
            style={{
              background: "linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
