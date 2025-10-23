// app/api/affiliate/track/route.ts
// Track affiliate referrals via cookie

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const AFFILIATE_COOKIE_NAME = "aff_ref";
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

// GET: Set affiliate tracking cookie
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("ref");

    if (!code) {
      return NextResponse.json(
        { error: "Affiliate code required" },
        { status: 400 }
      );
    }

    // Verify affiliate code exists and is active
    const affiliate = await prisma.affiliate.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!affiliate || !affiliate.isActive) {
      return NextResponse.json(
        { error: "Invalid or inactive affiliate code" },
        { status: 404 }
      );
    }

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: "Affiliate tracking cookie set",
      code: affiliate.code,
    });

    // Set cookie
    response.cookies.set(AFFILIATE_COOKIE_NAME, affiliate.code, {
      maxAge: COOKIE_MAX_AGE,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("[AFFILIATE_TRACK]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Create a referral record when someone signs up
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, affiliateCode } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    // Check for affiliate cookie if code not provided
    const cookieCode =
      affiliateCode || request.cookies.get(AFFILIATE_COOKIE_NAME)?.value;

    if (!cookieCode) {
      return NextResponse.json({
        success: false,
        message: "No affiliate code found",
      });
    }

    // Find affiliate
    const affiliate = await prisma.affiliate.findUnique({
      where: { code: cookieCode.toUpperCase() },
    });

    if (!affiliate || !affiliate.isActive) {
      return NextResponse.json({
        success: false,
        message: "Invalid affiliate code",
      });
    }

    // Prevent self-referral
    if (affiliate.userId === userId) {
      return NextResponse.json({
        success: false,
        message: "Cannot refer yourself",
      });
    }

    // Check if referral already exists
    const existingReferral = await prisma.referral.findFirst({
      where: {
        affiliateId: affiliate.id,
        referredUserId: userId,
      },
    });

    if (existingReferral) {
      return NextResponse.json({
        success: false,
        message: "Referral already recorded",
      });
    }

    // Create referral record
    const referral = await prisma.referral.create({
      data: {
        affiliateId: affiliate.id,
        referredUserId: userId,
        status: "PENDING",
        commissionCents: 0, // Will be calculated when they make a purchase
      },
    });

    // Clear the affiliate cookie after successful referral
    const response = NextResponse.json({
      success: true,
      message: "Referral recorded successfully",
      referral,
    });

    response.cookies.delete(AFFILIATE_COOKIE_NAME);

    return response;
  } catch (error) {
    console.error("[AFFILIATE_TRACK_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
