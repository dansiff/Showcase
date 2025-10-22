"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ConfirmEmailPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/signin");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Email Confirmed! 🎉
          </h1>
          
          <p className="text-gray-600 mb-8">
            Your email has been successfully verified. You can now sign in to your account.
          </p>

          {/* Countdown */}
          <div className="bg-indigo-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-indigo-800">
              Redirecting to sign in page in{" "}
              <span className="font-bold text-indigo-600 text-lg">{countdown}</span>{" "}
              seconds...
            </p>
          </div>

          {/* Sign In Button */}
          <Link
            href="/signin"
            className="inline-block w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
          >
            Sign In Now
          </Link>

          {/* Help Text */}
          <p className="mt-6 text-sm text-gray-500">
            Having trouble?{" "}
            <Link href="/signup" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Create a new account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
