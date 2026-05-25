import React from "react";
import { FaTrashAlt, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useDeletePoll from "../../hooks/useDeletePoll";

function PollTableRow({ poll, index, refetch }) {
  const navigator = useNavigate();
  const handleDelete = useDeletePoll(poll._id, refetch);

  const handleViewOnClick = () => {
    navigator(`/view/${poll._id}`);
  };

  return (
    <>
      <tr className="hover:bg-blue-500/5 transition-colors">
        <th className="text-gray-400 font-semibold">{index + 1}</th>
        <td className="text-white font-medium">{poll.title}</td>
        <td className="text-gray-300 text-xs md:text-sm whitespace-normal break-words max-w-xs">
          {poll.description}
        </td>
        <td>
          {poll.published ? (
            <span className="badge bg-green-500/10 text-green-400 border border-green-500/30 text-xs px-2.5 py-1.5 font-semibold">Published</span>
          ) : (
            <span className="badge bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-xs px-2.5 py-1.5 font-semibold">Unpublished</span>
          )}
        </td>
        <td className="text-right pr-6">
          <div className="flex md:flex-row flex-wrap flex-col justify-end gap-2">
            <button
              onClick={handleViewOnClick}
              className="btn btn-xs md:btn-sm glass-btn-primary flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg"
            >
              <FaEye className="text-xs" /> View
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-xs md:btn-sm btn-error btn-outline flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg hover:bg-red-500/10 border-red-500/30 text-red-400"
            >
              <FaTrashAlt className="text-xs" /> Delete
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}

export default PollTableRow;
