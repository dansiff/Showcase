import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    // Verify admin access
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch all intakes
    const intakes = await prisma.clientIntake.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        company: true,
        projectType: true,
        budget: true,
        timeline: true,
        status: true,
        depositPaid: true,
        preferredCallDate: true,
        preferredCallTime: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ intakes }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Admin intakes API error:", message);
    return NextResponse.json(
      { error: message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
