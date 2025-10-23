// app/api/affiliate/create/route.ts
// Create or activate affiliate account for a user

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

// Generate a unique 8-character affiliate code
function generateAffiliateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Avoiding ambiguous chars
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: authUser.email! },
      include: {
        creator: true,
        affiliates: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has an affiliate account
    if (user.affiliates.length > 0) {
      const existing = user.affiliates[0];
      return NextResponse.json({
        affiliate: existing,
        message: "Affiliate account already exists",
      });
    }

    // Generate unique code
    let code = generateAffiliateCode();
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const existing = await prisma.affiliate.findUnique({
        where: { code },
      });

      if (!existing) break;

      code = generateAffiliateCode();
      attempts++;
    }

    if (attempts === maxAttempts) {
      return NextResponse.json(
        { error: "Failed to generate unique code" },
        { status: 500 }
      );
    }

    // Create affiliate account
    const affiliate = await prisma.affiliate.create({
      data: {
        userId: user.id,
        code,
        ratePercent: 10, // 10% default commission
        active: true,
      },
    });

    return NextResponse.json({
      affiliate,
      message: "Affiliate account created successfully",
    });
  } catch (error) {
    console.error("[AFFILIATE_CREATE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET: Fetch current user's affiliate account
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: authUser.email! },
      include: {
        affiliates: {
          include: {
            _count: {
              select: {
                referrals: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const affiliate = user.affiliates[0] || null;

    return NextResponse.json({ affiliate });
  } catch (error) {
    console.error("[AFFILIATE_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
