import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("inr"),
  cause: z.string().default("general"),
  frequency: z.enum(["one-time", "monthly"]).default("one-time"),
  donorEmail: z.string().email().optional(),
});

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const { amount, currency, cause, frequency, donorEmail } = parsed.data;

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: frequency === "monthly" ? "subscription" : "payment",
      payment_method_types: ["card"],
      customer_email: donorEmail,
      line_items: [
        {
          quantity: 1,
          price_data:
            frequency === "monthly"
              ? undefined
              : {
                  currency,
                  unit_amount: Math.round(amount * 100),
                  product_data: {
                    name: `Donation — ${cause}`,
                    description: "Fr. Yesudas Ministries",
                  },
                },
          ...(frequency === "monthly" && {
            price_data: {
              currency,
              unit_amount: Math.round(amount * 100),
              recurring: { interval: "month" },
              product_data: {
                name: `Monthly Donation — ${cause}`,
                description: "Fr. Yesudas Ministries",
              },
            },
          }),
        },
      ],
      success_url: `${baseUrl}/give?success=1`,
      cancel_url: `${baseUrl}/give`,
      metadata: { cause, frequency },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[Stripe] create-checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
