import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 }
      );
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    // Get intake ID from metadata
    const intakeId = session.metadata?.intakeId;

    if (!intakeId) {
      return NextResponse.json(
        { error: "Intake ID not found in session" },
        { status: 400 }
      );
    }

    // Update intake record to mark deposit as paid
    await prisma.clientIntake.update({
      where: { id: intakeId },
      data: {
        depositPaid: true,
        status: "in-progress",
      },
    });

    // TODO: Send confirmation email to client
    // TODO: Send notification to team

    return NextResponse.json({
      success: true,
      message: "Payment verified and intake updated",
    });
  } catch (err: any) {
    console.error("Verification error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
