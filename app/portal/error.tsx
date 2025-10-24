"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console
    console.error("[PORTAL-ERROR]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We're sorry, something unexpected happened. Please try again.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-gray-500">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left">
            <p className="text-sm font-medium text-red-800">Error Details:</p>
            <p className="text-xs text-red-600 mt-1 font-mono break-all">
              {error.message || "Unknown error"}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => reset()}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try again
            </button>
            
            <Link
              href="/signin"
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Sign In
            </Link>

            <Link
              href="/"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Go to Homepage
            </Link>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p className="font-medium mb-2">Common issues:</p>
            <ul className="text-left space-y-1 ml-4 list-disc">
              <li>Database connection problem</li>
              <li>Session expired - try signing in again</li>
              <li>Browser cache - try clearing cookies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
