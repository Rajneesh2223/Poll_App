import React from "react";
import { useNavigate } from "react-router-dom";

function PollCard({ poll }) {

    const navigator = useNavigate();

    const handleViewOnClick = () => {
        navigator(`/view/${poll._id}`);
    };

  return (
    <div className="card bg-base-300 shadow-xl text-white w-full md:w-80">
      <div className="card-body">
        <h2 className="card-title text-xl font-bold">{poll.title}</h2>
        <p className="text-sm text-base-content">{poll.description}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="text-xs text-gray-400">
            Created by <span className="text-yellow-400">{poll.creatorData.username}</span> on {new Date(poll?.createdAt).toLocaleDateString()}
          </div>
          <button onClick={handleViewOnClick} className="btn btn-primary btn-sm text-base-content">View</button>
        </div>
      </div>
    </div>
  );
}

export default PollCard;
