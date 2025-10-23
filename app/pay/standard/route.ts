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
              name: "Standard Build: $2,500 (one-time)",
              description: "Custom website design & development — upfront build fee",
              // images: [`${process.env.NEXT_PUBLIC_SITE_URL}/images/checkout/standard-build.png`],
            },
            unit_amount: 250000, // $2,500 in cents
            recurring: undefined,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Monthly Hosting: $49/mo (recurring)",
              description: "Hosting, maintenance, and support — billed monthly",
              // images: [`${process.env.NEXT_PUBLIC_SITE_URL}/images/checkout/standard-hosting.png`],
            },
            unit_amount: 4900, // $49 in cents
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          plan: "standard",
        },
      },
      custom_text: {
        submit: {
          message: "You're getting our Standard Plan: $2,500 today + $49/mo starting immediately. 🎉",
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/pricing`,
      metadata: {
        plan: "standard",
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
