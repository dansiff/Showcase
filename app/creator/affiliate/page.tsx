// app/creator/affiliate/page.tsx
// Creator affiliate management page
// TEMPORARILY DISABLED FOR MVP LAUNCH

import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Affiliate Program — The Fusion Space",
  description: "Manage your affiliate links and track commissions",
};

export default async function AffiliatePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Affiliate Program Coming Soon
          </h1>
          <p className="text-gray-600 mb-6">
            The affiliate system is currently being enhanced and will be available shortly.
          </p>
          <Link
            href="/creator/dashboard"
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
