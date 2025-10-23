"use client";

import { useEffect, useState } from "react";

export default function AgeGate({ creatorKey }: { creatorKey: string }) {
  const storageKey = `agegate:${creatorKey}`;
  const [accepted, setAccepted] = useState<boolean>(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(storageKey);
      setAccepted(v === "accepted");
    } catch (e) {
      // ignore
    } finally {
      setLoaded(true);
    }
  }, [storageKey]);

  const accept = () => {
    try {
      localStorage.setItem(storageKey, "accepted");
    } catch (e) {}
    setAccepted(true);
  };

  const decline = () => {
    // Navigate away (home) or back
    if (typeof window !== "undefined") {
      if (document.referrer) {
        window.history.back();
      } else {
        window.location.href = "/";
      }
    }
  };

  if (!loaded || accepted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold">Age-Restricted Content</h2>
          <p className="mt-2 text-sm text-gray-600">
            This creator has marked their content as suitable for audiences 18+ only.
            By proceeding, you confirm you are of legal age to view this content.
          </p>
        </div>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={decline}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Go back
          </button>
          <button
            onClick={accept}
            className="rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:from-indigo-600 hover:to-purple-700"
          >
            I am 18+ — Proceed
          </button>
        </div>
        <p className="mt-4 text-center text-xs text-gray-400">
          Your choice is remembered on this device.
        </p>
      </div>
    </div>
  );
}
