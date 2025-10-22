"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Mail, Calendar, Clock } from "lucide-react";

function IntakeSuccessContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    
    if (sessionId) {
      // Verify payment and update intake record
      fetch("/api/intake/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }
        })
        .catch((err) => {
          console.error("Verification error:", err);
          setError("Failed to verify payment");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thank You! Payment Received
          </h1>
          <p className="text-xl text-gray-600">
            Your deposit has been processed successfully. We're excited to start working on your project!
          </p>
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-8">
            <p className="font-medium">Note: {error}</p>
            <p className="text-sm mt-1">Your payment was successful, but we encountered an issue updating your record. Our team will contact you shortly.</p>
          </div>
        )}

        {/* What Happens Next */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Happens Next?</h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">1. Confirmation Email</h3>
                <p className="text-gray-600">
                  You'll receive a confirmation email with your project details and receipt within the next few minutes.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">2. Team Review (24 hours)</h3>
                <p className="text-gray-600">
                  Our team will review your project requirements and prepare for your kickoff call.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">3. Kickoff Call (48 hours)</h3>
                <p className="text-gray-600">
                  We'll schedule a kickoff call to discuss your project in detail, answer questions, and align on next steps.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-bold">4</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">4. Project Kickoff</h3>
                <p className="text-gray-600">
                  Once we're aligned, we'll begin development immediately and provide regular updates throughout the process.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3">Important Information</h3>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li>• Your 50% deposit secures your project timeline</li>
            <li>• The remaining 50% is due upon project completion</li>
            <li>• We'll provide a detailed project timeline during your kickoff call</li>
            <li>• You'll have a dedicated project manager throughout development</li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Have Questions?</h3>
          <p className="text-gray-600 mb-4">
            Feel free to reach out to us anytime
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="mailto:hello@showcase.com"
              className="inline-flex items-center justify-center px-6 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
            >
              Email Us
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Join 100+ satisfied clients who have built their digital presence with us</p>
        </div>
      </div>
    </div>
  );
}

export default function IntakeSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <IntakeSuccessContent />
    </Suspense>
  );
}
