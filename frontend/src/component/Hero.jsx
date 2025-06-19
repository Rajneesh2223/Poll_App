import { useState } from "react";
import staricon from "../assets/herosection/staricon.svg";
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [role, setRole] = useState()
  const navigate = useNavigate()
  
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
            Welcome to the{" "}
            <span className="font-sora text-4xl font-semibold">
              Live Polling System{" "}
            </span>
          </h1>
          <p className="text-xl text-[#00000080] font-sora">
            Please select the role that best describes you to begin using the
            live polling system
          </p>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
            <div
              onClick={() => setRole("student")}
              className={`p-[3px] rounded-lg cursor-pointer ${role === "student"
                ? "bg-gradient-to-r from-purple-600 to-blue-600"
                : "bg-gradient-to-r from-[#7765DA10] to-[#1D68BD10]"
                }`}
            >
              <div className="bg-white rounded-lg p-6 h-full text-center">
                <h1 className="text-2xl font-semibold mb-4">I'm a Student</h1>
                <p className="text-gray-600">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry
                </p>
              </div>
            </div>

            <div
              onClick={() => setRole("teacher")}
              className={`p-[3px] rounded-lg cursor-pointer ${role === "teacher"
                ? "bg-gradient-to-r from-purple-600 to-blue-600"
            : "bg-gradient-to-r from-[#7765DA10] to-[#1D68BD10]"
                }`}
            >
              <div className="bg-white rounded-lg p-6 h-full text-center">
                <h1 className="text-2xl font-semibold mb-4">I'm a Teacher</h1>
                <p className="text-gray-600">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <button
            disabled={!role}
            onClick={() => {
              localStorage.setItem("role", role);
              navigate(`/${role}`);
            }}
            className={`py-5 rounded-[34px] text-white font-sora px-16 w-[233px] ${!role ? "opacity-50 cursor-not-allowed" : ""
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
