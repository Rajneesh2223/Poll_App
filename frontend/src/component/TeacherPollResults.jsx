import { useState } from "react";

const TeacherPollResults = () => {
  // Sample poll data - in real app, this would come from props or API
  const [pollData, setPollData] = useState({
    question: "Which planet is known as the Red Planet?",
    options: [
      { id: 1, text: "Mars", votes: 78, color: "bg-blue-500" },
      { id: 2, text: "Venus", votes: 5, color: "bg-blue-500" },
      { id: 3, text: "Jupiter", votes: 5, color: "bg-blue-500" },
      { id: 4, text: "Saturn", votes: 10, color: "bg-blue-500" },
    ],
    totalResponses: 98,
  });

  // Calculate percentages and total
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

  const optionsWithPercentages = calculatePercentages();
  const totalVotes = optionsWithPercentages.reduce(
    (sum, option) => sum + option.votes,
    0
  );

  // Function to get color intensity based on percentage
  const getColorIntensity = (percentage) => {
    if (percentage >= 70) return "bg-purple-600";
    if (percentage >= 50) return "bg-purple-500";
    if (percentage >= 30) return "bg-purple-400";
    if (percentage >= 15) return "bg-purple-300";
    if (percentage >= 5) return "bg-purple-200";
    return "bg-gray-200";
  };

  // Function to handle asking a new question
  const handleAskNewQuestion = () => {
    // In real app, this would route to create question page
    console.log("Routing to create question page...");
    alert("Redirecting to create new question...");
  };

  // Function to simulate real-time updates (for demo purposes)
  // const simulateNewResponse = () => {
  //   setPollData((prev) => ({
  //     ...prev,
  //     options: prev.options.map((option) =>
  //       Math.random() > 0.7 ? { ...option, votes: option.votes + 1 } : option
  //     ),
  //   }));
  // };

  return (
    <div className="max-w-3xl mx-auto flex items-center justify-center px-4 min-h-screen">
      <div className="w-full">
        {/* Question Header */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Question</h2>
          <div className="bg-gray-700 text-white p-3 rounded">
            <p className="text-sm font-medium">{pollData.question}</p>
          </div>
        </div>

        {/* Poll Results */}
        <div className="space-y-3 mb-6">
          {optionsWithPercentages.map((option) => (
            <div key={option.id} className="relative">
              {/* Option bar */}
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <div className="flex items-center bg-gray-100 rounded-md h-10 relative overflow-hidden">
                    {/* Progress bar */}
                    <div
                      className={`h-full rounded-md transition-all duration-500 ${getColorIntensity(
                        option.percentage
                      )}`}
                      style={{ width: `${option.percentage}%` }}
                    ></div>

                    {/* Option text and icon */}
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

                {/* Percentage and vote count */}
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
          ))}
        </div>

        {/* Total responses */}
        <div className="mb-4 text-center">
          <span className="text-sm text-gray-600">
            Total responses: {totalVotes}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="flex justify-center">
            <button
              onClick={handleAskNewQuestion}
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium px-8 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Ask New Question
            </button>
          </div>

          {/* Demo button to simulate responses */}
          {/* <div className="flex justify-center">
            <button
              onClick={simulateNewResponse}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 text-sm"
            >
              Simulate New Response (Demo)
            </button>
          </div> */}
        </div>

        {/* Real-time indicator */}
        {/* <div className="mt-6 flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Live results updating</span>
        </div> */}
      </div>
    </div>
  );
};

export default TeacherPollResults;
