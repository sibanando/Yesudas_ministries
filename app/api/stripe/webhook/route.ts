import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  // Must use raw body — NOT req.json()
  const rawBody = await req.text();

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      prisma.donation
        .create({
          data: {
            gateway: "stripe",
            gatewayRef: session.id,
            amount: session.amount_total ?? 0,
            currency: (session.currency ?? "usd").toUpperCase(),
            cause: session.metadata?.cause ?? "general",
            frequency: session.metadata?.frequency ?? "one-time",
            donorName: (session.customer_details as { name?: string } | null)?.name ?? null,
            donorEmail: session.customer_email ?? null,
            status: "completed",
          },
        })
        .catch((err: unknown) => console.error("[Stripe Webhook] DB write failed:", err));

      console.log("[Stripe Webhook] Payment completed:", session.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Error:", error);
    return NextResponse.json({ error: "Webhook handling failed." }, { status: 400 });
  }
}
