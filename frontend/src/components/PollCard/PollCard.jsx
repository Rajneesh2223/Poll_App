import React from "react";
import { useNavigate } from "react-router-dom";

function PollCard({ poll }) {

    const navigator = useNavigate();

    const handleViewOnClick = () => {
        navigator(`/view/${poll._id}`);
    };

  return (
    <div className="card glass-panel shadow-2xl text-white w-full md:w-80 border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300 group hover:-translate-y-1">
      <div className="card-body p-6 flex flex-col justify-between h-full min-h-[180px]">
        <div>
          <h2 className="card-title text-lg font-bold tracking-tight text-white mb-2 group-hover:text-cyan-300 transition-colors">{poll.title}</h2>
          <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">{poll.description}</p>
        </div>
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-blue-500/5">
          <div className="text-[10px] text-gray-400 font-medium leading-tight">
            By <span className="text-cyan-400">{poll.creatorData.username}</span>
            <span className="block text-[8px] opacity-70 mt-0.5">{new Date(poll?.createdAt).toLocaleDateString()}</span>
          </div>
          <button onClick={handleViewOnClick} className="btn glass-btn-primary btn-xs md:btn-sm rounded-lg py-1 px-3.5 text-xs">View</button>
        </div>
      </div>
    </div>
  );
}

export default PollCard;
