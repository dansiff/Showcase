// app/api/checkout/session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required env var STRIPE_SECRET_KEY. Set this in Vercel or .env for local dev.");
}

// Use STRIPE_SECRET_KEY to match the rest of the codebase and Vercel env var
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-08-27.basil" });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { priceId, planId, creatorId, successUrl, cancelUrl, metadata } = body;

    // If planId is provided, fetch the plan details from database
    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let checkoutMetadata: Record<string, string> = metadata || {};

    if (planId) {
      // Fetch plan from database
      const plan = await (prisma as any).plan.findUnique({
        where: { id: planId },
        include: { creator: true }
      });

      if (!plan) {
        return NextResponse.json(
          { error: "Subscription plan not found" },
          { status: 404 }
        );
      }

      // Create line item from plan data
      lineItems = [
        {
          price_data: {
            currency: plan.currency,
            product_data: {
              name: `${plan.name} Subscription`,
              description: `Subscribe to exclusive content`,
            },
            unit_amount: plan.priceCents,
            recurring: {
              interval: plan.billingPeriod === "YEAR" ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ];

      checkoutMetadata = {
        ...checkoutMetadata,
        planId: plan.id,
        creatorId: plan.creatorId,
        tierName: plan.name,
      };
    } else if (priceId) {
      // Legacy support for direct Stripe price IDs
      lineItems = [{ price: priceId, quantity: 1 }];
    } else {
      return NextResponse.json(
        { error: "Either planId or priceId is required" },
        { status: 400 }
      );
    }

    // Determine success/cancel URLs
    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const finalSuccessUrl = successUrl || `${baseUrl}/creator/success?session_id={CHECKOUT_SESSION_ID}`;
    const finalCancelUrl = cancelUrl || (creatorId ? `${baseUrl}/creator/${creatorId}` : `${baseUrl}/`);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: lineItems,
      payment_method_types: ["card"],
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      metadata: checkoutMetadata,
      subscription_data: {
        metadata: checkoutMetadata,
      },
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error("Checkout session creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
