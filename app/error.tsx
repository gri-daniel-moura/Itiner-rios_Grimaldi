"use client";

import { useEffect } from "react";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-md w-full text-center">
        <div className="bg-red-100 text-red-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong!</h2>
        <p className="text-slate-500 mb-6 text-sm">{error.message || "An unexpected error occurred while loading this page."}</p>
        <button
          onClick={() => reset()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors w-full"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
