// BookmarkPage.js
import React from "react";
import { getUserBookmarks } from "../services/getUserBookmarks";
import { useQuery, useQueryClient } from "react-query";
import ErrorFallback from "../components/Errors/ErrorFallback";
import useBookmark from "../hooks/useBookmark";
import { useNavigate } from "react-router-dom";
import { formatDataByDate } from "../utils/util";

function Bookmark() {
  const { handleBookmark } = useBookmark();
  const navigator = useNavigate();

  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch, isSuccess } = useQuery(
    ["bookmarks"],
    getUserBookmarks,
    {
      cacheTime: 1000 * 60 * 5, // 5 minutes
      staleTime: 1000 * 60 * 10, // 10 minutes
    }
  );

  const handleViewPollClick = (pollId) => {
    navigator(`/view/${pollId}`);
  };

  const handleRemoveBookmark = async (bookmarkId) => {
    queryClient.setQueryData(["bookmarks"], (oldData) => {
      return {
        ...oldData,
        data: oldData.data.filter((bookmark) => bookmark._id !== bookmarkId),
      };
    });
    await handleBookmark(bookmarkId);
  };
  console.log(data);

  return (
    <div className="p-6 bg-base-200 h-screen">
      <h1 className="md:text-4xl text-xl font-bold text-white mb-6">
        Bookmarked Polls
      </h1>
      {isError && (
        <div className="h-60 w-full">
          <ErrorFallback onRetry={refetch} />
        </div>
      )}
      {isLoading && <div className="skeleton h-40 w-full"></div>}
      {isSuccess && (
        <div className="overflow-x-auto">
          <table className="table w-full bg-base-100">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {formatDataByDate(data.data).map((bookmark, index) => (
                <tr key={bookmark._id}>
                  <th>{index + 1}</th>
                  <td className="text-white text-sm md:text-base">
                    {bookmark.title}
                  </td>
                  <td className="text-gray-400 whitespace-normal break-words max-w-xs text-xs md:text-base">
                    {bookmark.description}
                  </td>
                  <td>
                    <button
                      onClick={() => handleViewPollClick(bookmark._id)}
                      className="btn btn-sm btn-primary text-sm md:text-base mb-2 md:mb-1"
                    >
                      View Poll
                    </button>
                    <button
                      onClick={() => handleRemoveBookmark(bookmark._id)}
                      className="btn btn-sm btn-error text-sm md:text-base ml-2"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Bookmark;
