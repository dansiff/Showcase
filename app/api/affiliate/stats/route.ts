// app/api/affiliate/stats/route.ts
// Get affiliate performance statistics

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user and their affiliate account
    const user = await prisma.user.findUnique({
      where: { email: authUser.email! },
      include: {
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
            },
            payouts: {
              orderBy: {
                createdAt: "desc",
              },
              take: 10,
            },
          },
        },
      },
    });

    if (!user || user.affiliates.length === 0) {
      return NextResponse.json(
        { error: "No affiliate account found" },
        { status: 404 }
      );
    }

    const affiliate = user.affiliates[0];

    // Calculate stats
    const totalReferrals = affiliate.referrals.length;
    const pendingReferrals = affiliate.referrals.filter(
      (r: any) => r.status === "tracked"
    ).length;
    const convertedReferrals = affiliate.referrals.filter(
      (r: any) => r.status === "converted"
    ).length;

    const totalCommissions = affiliate.referrals.reduce(
      (sum: number, r: any) => sum + r.commissionCents,
      0
    );

    const totalPaid = affiliate.payouts.reduce(
      (sum: number, p: any) => sum + (p.status === "paid" ? p.amountCents : 0),
      0
    );

    const pendingPayouts = totalCommissions - totalPaid;

    // Recent referrals with details
    const recentReferrals = affiliate.referrals.slice(0, 10).map((r: any) => ({
      id: r.id,
      userName: r.referredUser.name,
      userEmail: r.referredUser.email,
      status: r.status,
      commission: r.commissionCents,
      createdAt: r.createdAt,
      convertedAt: r.convertedAt,
    }));

    // Top performing months
    const referralsByMonth = affiliate.referrals.reduce((acc: Record<string, number>, r: any) => {
      const month = new Date(r.createdAt).toISOString().slice(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      affiliate: {
        code: affiliate.code,
        commissionRate: affiliate.ratePercent,
        isActive: affiliate.active,
        createdAt: affiliate.createdAt,
      },
      stats: {
        totalReferrals,
        pendingReferrals,
        convertedReferrals,
        conversionRate:
          totalReferrals > 0
            ? ((convertedReferrals / totalReferrals) * 100).toFixed(1)
            : "0",
        totalCommissions,
        totalPaid,
        pendingPayouts,
        availableForPayout: Math.max(0, pendingPayouts),
      },
      recentReferrals,
      referralsByMonth,
      recentPayouts: affiliate.payouts.map((p: any) => ({
        id: p.id,
        amount: p.amountCents,
        status: p.status,
        createdAt: p.createdAt,
        paidAt: p.paidAt,
      })),
    });
  } catch (error) {
    console.error("[AFFILIATE_STATS]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
