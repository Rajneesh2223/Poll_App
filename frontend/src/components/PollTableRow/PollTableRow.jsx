import React from "react";
import { FaTrashAlt } from "react-icons/fa";
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
      <tr>
        <th>{index + 1}</th>
        <td className="text-white">{poll.title}</td>
        <td className="text-gray-400 whitespace-normal break-words max-w-xs">
          {poll.description}
        </td>
        <td>
          {poll.published ? (
            <span className="badge badge-success text-white">Published</span>
          ) : (
            <span className="badge badge-warning text-white">Unpublished</span>
          )}
        </td>
        <td>
          <div className="flex md:flex-row flex-wrap flex-col gap-2">
            <button
              onClick={handleViewOnClick}
              className="btn btn-sm btn-primary flex items-center"
            >
              <FaTrashAlt className="mr-1" /> View
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-sm btn-error flex items-center"
            >
              <FaTrashAlt className="mr-1" /> Delete
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}

export default PollTableRow;
