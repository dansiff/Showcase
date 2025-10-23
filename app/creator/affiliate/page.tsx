// app/creator/affiliate/page.tsx
// Creator affiliate management page

import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Affiliate Program — The Fusion Space",
  description: "Manage your affiliate links and track commissions",
};

async function getAffiliateData() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { email: authUser.email! },
    include: {
      creator: true,
      affiliates: {
        include: {
          referrals: {
            include: {
              referredUser: {
                select: {
                  name: true,
                  email: true,
                  createdAt: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 10,
          },
          payouts: {
            orderBy: {
              createdAt: "desc",
            },
            take: 5,
          },
        },
      },
    },
  });

  if (!user?.creator) {
    redirect("/portal");
  }

  const affiliate = user.affiliates[0] || null;

  // Calculate stats
  let stats = {
    totalReferrals: 0,
    pendingReferrals: 0,
    convertedReferrals: 0,
    totalCommissions: 0,
    pendingPayouts: 0,
  };

  if (affiliate) {
    stats.totalReferrals = affiliate.referrals.length;
    stats.pendingReferrals = affiliate.referrals.filter(
      (r) => r.status === "PENDING"
    ).length;
    stats.convertedReferrals = affiliate.referrals.filter(
      (r) => r.status === "CONVERTED"
    ).length;
    stats.totalCommissions = affiliate.referrals.reduce(
      (sum, r) => sum + r.commissionCents,
      0
    );

    const totalPaid = affiliate.payouts.reduce(
      (sum, p) => sum + (p.status === "PAID" ? p.amountCents : 0),
      0
    );

    stats.pendingPayouts = affiliate.totalEarnedCents - totalPaid;
  }

  return { user, creator: user.creator, affiliate, stats };
}

export default async function AffiliatePage() {
  const { user, creator, affiliate, stats } = await getAffiliateData();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thefusionspace.com";
  const affiliateUrl = affiliate
    ? `${baseUrl}/?ref=${affiliate.code}`
    : "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Affiliate Program</h1>
              <p className="text-indigo-100 text-lg">
                Earn commissions by referring new users
              </p>
            </div>
            <Link
              href="/creator/dashboard"
              className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/30 transition"
            >
              ← Dashboard
            </Link>
          </div>

          {affiliate && (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-indigo-200 text-sm mb-1">Total Referrals</div>
                  <div className="text-3xl font-bold">{stats.totalReferrals}</div>
                </div>
                <div>
                  <div className="text-indigo-200 text-sm mb-1">Converted</div>
                  <div className="text-3xl font-bold">{stats.convertedReferrals}</div>
                </div>
                <div>
                  <div className="text-indigo-200 text-sm mb-1">Total Earned</div>
                  <div className="text-3xl font-bold">
                    ${(stats.totalCommissions / 100).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-indigo-200 text-sm mb-1">Pending Payout</div>
                  <div className="text-3xl font-bold">
                    ${(stats.pendingPayouts / 100).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!affiliate ? (
          /* No Affiliate Account */
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Join the Affiliate Program
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Get your unique referral link and earn {10}% commission on every user you refer who makes a purchase!
            </p>
            <form action="/api/affiliate/create" method="POST">
              <button
                type="submit"
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-lg"
              >
                Activate Affiliate Account
              </button>
            </form>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">How it works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div>
                  <div className="text-3xl mb-2">1️⃣</div>
                  <h4 className="font-semibold text-gray-900 mb-1">Get Your Link</h4>
                  <p className="text-sm text-gray-600">
                    Receive your unique referral link
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">2️⃣</div>
                  <h4 className="font-semibold text-gray-900 mb-1">Share & Promote</h4>
                  <p className="text-sm text-gray-600">
                    Share your link on social media, your website, or with friends
                  </p>
                </div>
                <div>
                  <div className="text-3xl mb-2">3️⃣</div>
                  <h4 className="font-semibold text-gray-900 mb-1">Earn Commissions</h4>
                  <p className="text-sm text-gray-600">
                    Get paid when your referrals make purchases
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Affiliate Link Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Affiliate Link</h2>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-gray-600 block mb-1">Affiliate Code</label>
                    <div className="font-mono text-2xl font-bold text-indigo-600">
                      {affiliate.code}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="text-xs text-gray-600 mb-1">Commission Rate</div>
                    <div className="text-lg font-bold text-gray-900">{affiliate.commissionRate}%</div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Your Referral URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={affiliateUrl}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                  />
                  <button
                    onClick={(e) => {
                      navigator.clipboard.writeText(affiliateUrl);
                      const btn = e.currentTarget;
                      btn.textContent = "✓ Copied!";
                      setTimeout(() => (btn.textContent = "Copy"), 2000);
                    }}
                    className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition">
                  Share on Twitter
                </button>
                <button className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition">
                  Share on Facebook
                </button>
                <button className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition">
                  Email Link
                </button>
              </div>
            </div>

            {/* Recent Referrals */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Referrals</h2>
              {affiliate.referrals.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  <div className="text-4xl mb-2">🤷</div>
                  <p>No referrals yet. Start sharing your link!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {affiliate.referrals.map((referral) => (
                    <div
                      key={referral.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <div className="font-semibold text-gray-900">
                          {referral.referredUser.name || "Anonymous User"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            referral.status === "CONVERTED"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {referral.status}
                        </div>
                        {referral.commissionCents > 0 && (
                          <div className="text-sm font-semibold text-gray-900 mt-1">
                            ${(referral.commissionCents / 100).toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payout History */}
            {affiliate.payouts.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payout History</h2>
                <div className="space-y-3">
                  {affiliate.payouts.map((payout) => (
                    <div
                      key={payout.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <div className="font-semibold text-gray-900">
                          ${(payout.amountCents / 100).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(payout.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          payout.status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {payout.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
