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
    <div className="flex bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 min-h-screen flex-col text-white p-4 md:p-6 relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[130px] pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[130px] pointer-events-none animate-float-delayed"></div>

      <div className="max-w-5xl w-full mx-auto relative z-10 py-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
          Bookmarked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Polls</span>
        </h1>
        <p className="text-sm text-gray-400 mb-8">Follow ongoing statistical changes in polls you have saved.</p>

        {isError && (
          <div className="h-60 w-full">
            <ErrorFallback onRetry={refetch} />
          </div>
        )}
        {isLoading && <div className="skeleton h-40 w-full rounded-2xl bg-slate-900/30"></div>}
        {isSuccess && (
          <div className="overflow-x-auto glass-panel rounded-3xl shadow-xl">
            <table className="table w-full text-white bg-transparent">
              <thead>
                <tr className="border-b border-blue-500/10 text-gray-400 text-xs tracking-wider">
                  <th className="py-4">#</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th className="text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-500/5">
                {formatDataByDate(data.data).map((bookmark, index) => (
                  <tr key={bookmark._id} className="hover:bg-blue-500/5 transition-colors">
                    <th className="text-gray-400 font-semibold">{index + 1}</th>
                    <td className="text-white font-medium text-sm md:text-base">
                      {bookmark.title}
                    </td>
                    <td className="text-gray-300 whitespace-normal break-words max-w-xs text-xs md:text-sm">
                      {bookmark.description}
                    </td>
                    <td className="text-right pr-6">
                      <div className="flex md:flex-row flex-wrap flex-col justify-end gap-2">
                        <button
                          onClick={() => handleViewPollClick(bookmark._id)}
                          className="btn btn-xs md:btn-sm glass-btn-primary flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-xs"
                        >
                          View Poll
                        </button>
                        <button
                          onClick={() => handleRemoveBookmark(bookmark._id)}
                          className="btn btn-xs md:btn-sm btn-error btn-outline flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg hover:bg-red-500/10 border-red-500/30 text-red-400 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookmark;
