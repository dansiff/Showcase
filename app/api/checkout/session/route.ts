// app/api/checkout/session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET!, { apiVersion: "2025-06-30.basil" });

export async function POST(req: Request) {
  const { priceId, successUrl, cancelUrl, metadata } = await req.json();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription", // or "payment"
    line_items: [{ price: priceId, quantity: 1 }],
    payment_method_types: ["card"],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  });

  return NextResponse.json({ id: session.id, url: session.url });
}
