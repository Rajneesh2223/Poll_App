import { useEffect, useState } from "react";
import down from "../assets/herosection/down.png";
import staricon from "../assets/herosection/staricon.svg";
import { socket } from "../utils/socket";
import ChatButton from "./ChatButton";
import ChatWindow from "./ChatWindow";
import CommonLogo from "./CommonLogo";

const QuestionDashboard = () => {
  const [options, setOptions] = useState([
    { id: 1, text: "Rahul Bajaj", isCorrect: true },
    { id: 2, text: "Rahul Bajaj", isCorrect: false },
  ]);
  const [question, setQuestion] = useState("");
  const [nextId, setNextId] = useState(3);
  const [isRegistered, setIsRegistered] = useState(false);
  const [teacherName, setTeacherName] = useState("");

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useEffect(() => {
    const registrationStatus = sessionStorage.getItem("isRegistered");
    const storedTeacherName = sessionStorage.getItem("teacherName");
    const userRole = sessionStorage.getItem("userRole");

    console.log("Checking registration status:", {
      registrationStatus,
      storedTeacherName,
      userRole,
    });

    if (
      registrationStatus === "true" &&
      storedTeacherName &&
      userRole === "teacher"
    ) {
      console.log("Teacher already registered:", storedTeacherName);
      setIsRegistered(true);
      setTeacherName(storedTeacherName);
    } else {
      console.log("Teacher not properly registered, redirecting...");
      window.location.href = "/teacher";
      return;
    }

    const handleRegistrationSuccess = (data) => {
      console.log("Additional registration success:", data);
      setIsRegistered(true);
      setTeacherName(data.name);
    };

    const handleRegistrationError = (error) => {
      console.error("Registration error:", error);
      alert(`Registration error: ${error}`);
    };

    const handleSocketError = (error) => {
      console.error("Socket error:", error);
    };

    socket.on("registration_success", handleRegistrationSuccess);
    socket.on("registration_error", handleRegistrationError);
    socket.on("error", handleSocketError);

    return () => {
      socket.off("registration_success", handleRegistrationSuccess);
      socket.off("registration_error", handleRegistrationError);
      socket.off("error", handleSocketError);
    };
  }, []);

  const handleChatToggle = () => {
    setIsChatOpen((prev) => !prev);
    if (!isChatOpen) setHasUnreadMessages(false);
  };

  const addOption = () => {
    const newOption = {
      id: nextId,
      text: "",
      isCorrect: false,
    };
    setOptions([...options, newOption]);
    setNextId(nextId + 1);
  };

  const updateOptionText = (id, text) => {
    setOptions(
      options.map((option) => (option.id === id ? { ...option, text } : option))
    );
  };

  const toggleCorrectAnswer = (id) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, isCorrect: !option.isCorrect } : option
      )
    );
  };

  const removeOption = (id) => {
    if (options.length > 2) {
      setOptions(options.filter((option) => option.id !== id));
    }
  };

  const preparePollData = () => {
    const trimmedOptions = options
      .map((opt) => opt.text.trim())
      .filter((text) => text);
    const validOptions = options.filter((opt) => opt.text.trim());

    if (!question.trim() || validOptions.length < 2) {
      alert("Please enter a question and at least two valid options.");
      return null;
    }

    const correctIndex = options.findIndex((opt) => opt.isCorrect);

    if (correctIndex === -1) {
      alert("Please select one correct answer.");
      return null;
    }

    return {
      question: question.trim(),
      options: trimmedOptions,
      correctAnswerIndex: correctIndex,
      duration: 60,
    };
  };

  const handleCreatePoll = () => {
    if (!isRegistered) {
      alert("Please wait, connecting to server...");
      return;
    }

    const pollData = preparePollData();
    if (pollData) {
      console.log("Creating poll:", pollData);
      socket.emit("create_poll", pollData);

      const handlePollCreated = () => {
        alert("Poll sent successfully!");
        setQuestion("");
        setOptions([
          { id: 1, text: "", isCorrect: true },
          { id: 2, text: "", isCorrect: false },
        ]);
        setNextId(3);
        socket.off("new_poll", handlePollCreated);
      };

      socket.on("new_poll", handlePollCreated);

      const handleError = (error) => {
        console.error("Poll creation error:", error);
        alert(`Failed to create poll: ${error}`);
        socket.off("error", handleError);
      };

      socket.once("error", handleError);
    }
  };

  if (!isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
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
          <p className="text-xl font-sora">Redirecting to registration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 pt-6 md:pt-[87px] px-4 md:px-8 lg:px-[134px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <CommonLogo />

          <div className="text-left sm:text-right">
            <p className="text-sm text-gray-600">Welcome back,</p>
            <p className="font-sora font-semibold text-lg text-gray-800">
              {teacherName}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl md:text-4xl font-sora font-normal">
            Let's{" "}
            <span className="font-sora text-2xl md:text-4xl font-semibold">
              Get Started{" "}
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[#00000080] font-sora">
            you'll have the ability to create and manage polls, ask questions,
            and monitor your students' responses in real-time.
          </p>
        </div>

        <div className="w-full bg-white">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
              Enter your question
            </h1>
            <div className="flex items-center justify-center bg-gray-100 rounded-lg px-4 py-2.5 w-full sm:w-[170px] h-[43px] sm:self-auto self-start">
              <span className="text-gray-700 font-medium mr-2">60 seconds</span>
              <img src={down} alt="down" className="w-4 h-4" />
            </div>
          </div>

          <div className="relative mb-8">
            <textarea
              placeholder="Enter your question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full h-32 p-4 bg-gray-50 border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 rounded-lg"
            />
            <div className="absolute bottom-4 right-4 text-sm text-gray-500">
              {question.length}/100
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start mb-8 space-y-8 lg:space-y-0 lg:space-x-8">
            <div className="flex-1 w-full lg:w-auto">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                Edit Options
              </h2>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={option.id} className="flex items-center space-x-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                      style={{
                        background:
                          "linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)",
                      }}
                    >
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) =>
                        updateOptionText(option.id, e.target.value)
                      }
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter option"
                    />
                    {options.length > 2 && (
                      <button
                        onClick={() => removeOption(option.id)}
                        className="text-red-500 hover:text-red-700 font-semibold px-2 flex-shrink-0"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addOption}
                  className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 font-medium"
                >
                  <span className="text-lg">+</span>
                  <span>Add More option</span>
                </button>
              </div>
            </div>

            <div className="w-full lg:w-auto lg:flex-shrink-0">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                Is it Correct?
              </h2>
              <div className="space-y-3">
                {options.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-start lg:justify-center h-12"
                  >
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`correct-${option.id}`}
                          checked={option.isCorrect}
                          onChange={() => toggleCorrectAnswer(option.id)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            option.isCorrect
                              ? "border-purple-600 bg-purple-600"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {option.isCorrect && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="ml-2 text-gray-700">Yes</span>
                      </label>

                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`correct-${option.id}`}
                          checked={!option.isCorrect}
                          onChange={() => toggleCorrectAnswer(option.id)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            !option.isCorrect
                              ? "border-purple-600 bg-purple-600"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {!option.isCorrect && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="ml-2 text-gray-700">No</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-t-2 border-t-[#B6B6B6] mx-4 md:mx-8 lg:mx-[134px]" />

      <div className="flex justify-center md:justify-end mt-4 px-4 md:px-8 lg:pr-[134px] pb-6">
        <button
          className="rounded-[34px] text-white font-sora px-8 md:px-14 py-4 w-full sm:w-auto md:w-[233px] h-[57px]"
          onClick={handleCreatePoll}
          style={{
            background: "linear-gradient(90deg, #7565D9 0%, #4D0ACD 100%)",
          }}
        >
          Ask Question
        </button>
      </div>

      <ChatButton
        isOpen={isChatOpen}
        onClick={handleChatToggle}
        hasUnreadMessages={hasUnreadMessages}
      />
      <ChatWindow
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        isTeacher={true}
        userName={teacherName}
      />
    </div>
  );
};

export default QuestionDashboard;
