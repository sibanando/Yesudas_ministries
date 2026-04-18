import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, currency, cause, donorName, donorEmail } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Not configured." }, { status: 503 });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: "Signature mismatch." }, { status: 400 });
    }

    // Record donation
    prisma.donation
      .create({
        data: {
          gateway: "razorpay",
          gatewayRef: razorpay_payment_id,
          amount: amount ?? 0,
          currency: currency ?? "INR",
          cause: cause ?? "general",
          frequency: "one-time",
          donorName: donorName ?? null,
          donorEmail: donorEmail ?? null,
          status: "completed",
        },
      })
      .catch((err: unknown) => console.error("[Razorpay] DB write failed:", err));

    console.log("[Razorpay] Payment verified:", razorpay_payment_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Razorpay] verify-payment error:", error);
    return NextResponse.json({ error: "Verification failed." }, { status: 500 });
  }
}
