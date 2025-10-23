import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function GET() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      locale: "auto",
      allow_promotion_codes: true,
      phone_number_collection: { enabled: true },
      billing_address_collection: "auto",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "48-Hour Blitz Build: $3,999 (one-time)",
              description: "Rapid website development with priority delivery — upfront build fee",
              // images: [`${process.env.NEXT_PUBLIC_SITE_URL}/images/checkout/blitz-build.png`],
            },
            unit_amount: 399900, // $3,999 in cents
            recurring: undefined,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium Monthly Hosting: $79/mo (recurring)",
              description: "Hosting, maintenance, and priority support — billed monthly",
              // images: [`${process.env.NEXT_PUBLIC_SITE_URL}/images/checkout/blitz-hosting.png`],
            },
            unit_amount: 7900, // $79 in cents
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          plan: "blitz",
        },
      },
      custom_text: {
        submit: {
          message: "You're getting the Blitz Plan: $3,999 today + $79/mo starting immediately. ⚡",
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/pricing`,
      metadata: {
        plan: "blitz",
      },
    });

    return NextResponse.redirect(session.url!);
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
