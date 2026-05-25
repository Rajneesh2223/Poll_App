import React, { useState } from "react";
import { useQuery } from "react-query";
import getPollsService from "../services/getPollsService";
import PollCard from "../components/PollCard/PollCard";
import ErrorFallback from "../components/Errors/ErrorFallback";

function Polls() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);

  const { data, isLoading, isError, isSuccess, refetch } = useQuery(
    ["polls", page, limit],
    () => getPollsService(page, limit),
    {
      cacheTime: 1000 * 60 * 5,
      staleTime: 1000 * 60 * 10,
    },
  );

  return (
    <div className="flex bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 min-h-screen flex-col items-center text-white p-4 md:p-6 relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[130px] pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[130px] pointer-events-none animate-float-delayed"></div>

      <div className="max-w-6xl w-full mx-auto relative z-10 py-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2 tracking-tight">
          Explore Public <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Polls</span>
        </h1>
        <p className="text-center text-sm text-gray-400 mb-10 max-w-md mx-auto">
          Participate in open polls from around the community, express your feedback, and follow live results.
        </p>

        {isSuccess && (
          <div className="flex flex-wrap justify-center gap-6">
            {data?.data?.polls?.map((poll) => (
              <PollCard key={poll._id} poll={poll} />
            ))}
          </div>
        )}
        {isLoading && (
          <div className="flex flex-wrap justify-center gap-6 skeleton min-h-[300px] w-full rounded-3xl bg-slate-900/30"></div>
        )}
        {isError && (
          <div className="flex justify-center gap-6">
            <ErrorFallback onRetry={() => refetch()} />
          </div>
        )}

        <div className="flex justify-center gap-4 mt-12 border-t border-blue-500/10 pt-8">
          <button
            className="btn glass-btn-secondary px-6 rounded-xl font-bold py-2.5"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span className="flex items-center text-sm font-semibold text-gray-400 px-4">
            Page {page} of {data?.data?.totalPages || 1}
          </span>
          <button
            className="btn glass-btn-primary px-6 rounded-xl font-bold py-2.5 shadow-lg shadow-blue-500/10"
            disabled={data?.data?.totalPages === page}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Polls;
