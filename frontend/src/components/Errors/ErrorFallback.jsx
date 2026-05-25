import React from "react";
import { Link } from "react-router-dom";

const ErrorFallback = ({ onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-full w-full bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl text-center space-y-4 p-6">
        <h2 className="text-xl font-bold text-error">Oops! Something went wrong</h2>
        <p className="text-sm text-base-content">
          We encountered an unexpected error. Please try again.
        </p>
        <button
          className="btn btn-primary w-full"
          onClick={() => onRetry()}
        >
          Retry
        </button>
        <Link to="/" className="btn btn-ghost w-full">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorFallback;
