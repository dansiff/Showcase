import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 px-4">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-green-500/20 bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-10 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle2 className="h-10 w-10 text-green-400" />
        </div>
        <h1 className="mb-3 text-3xl font-bold text-white">Payment Successful!</h1>
        <p className="mb-8 text-gray-300">
          Thank you for your purchase. We'll be in touch shortly to get started on your project.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105"
          >
            Return Home
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-6 py-3 font-semibold text-white transition-all hover:bg-gray-800"
          >
            View Pricing
          </Link>
        </div>

        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-green-500/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />
      </div>
    </div>
  );
}
