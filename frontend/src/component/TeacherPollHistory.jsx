import React, { useEffect, useState } from "react";

const TeacherPollHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  console.log("Current history state:", history);

  useEffect(() => {
    const fetchPollHistory = async () => {
      try {
        console.log("Fetching poll history from REST API");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/poll-history`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Received poll history data:", data);
        setHistory(data || []);
      } catch (err) {
        console.error("Failed to fetch poll history:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPollHistory();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Poll History</h1>
        <p>Loading poll history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Poll History</h1>
        <p className="text-red-500">Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Poll History</h1>
      <p className="text-sm text-gray-500 mb-4">Found {history.length} polls</p>
      
      {history.length === 0 ? (
        <p>No polls created yet.</p>
      ) : (
        <div className="space-y-4">
          {history.map((poll, index) => (
            <div key={poll._id || index} className="border rounded-lg p-4 shadow">
              <h2 className="text-lg font-semibold">
                {index + 1}. {poll.question}
              </h2>
              <ul className="mt-2 list-disc list-inside">
                {poll.options?.map((opt, i) => (
                  <li
                    key={i}
                    className={i === poll.correctAnswerIndex ? "font-semibold text-green-600" : ""}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-gray-500">Created by: {poll.createdBy}</p>
              <p className="text-sm text-gray-500">Responses: {poll.responses?.length || 0}</p>
              <p className="text-sm text-gray-400">
                Created At: {poll.createdAt ? new Date(poll.createdAt).toLocaleString() : poll.startTime ? new Date(poll.startTime).toLocaleString() : 'Unknown'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherPollHistory;