"use client";

import { useState } from "react";
import { Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DonationValues } from "./DonationForm";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window.Razorpay !== "undefined") { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface Props {
  donation: DonationValues;
  disabled?: boolean;
}

export function RazorpayButton({ donation, disabled }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    if (donation.amount <= 0) {
      setError("Please select or enter a valid amount.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Razorpay failed to load. Please refresh.");

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: donation.amount,
          currency: donation.currency,
          receipt: `rcpt_${Date.now()}`,
          notes: {
            cause: donation.cause,
            frequency: donation.frequency,
            donorName: donation.donorName,
            donorEmail: donation.donorEmail,
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to create payment order.");
      const { orderId, amount } = await res.json();

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
        order_id: orderId,
        amount,
        currency: donation.currency,
        name: "Fr. Yesudas Ministries",
        description: `Donation — ${donation.cause}`,
        prefill: {
          name: donation.donorName,
          email: donation.donorEmail,
        },
        theme: { color: "#1B2A4A" },
        handler: async (response: Record<string, string>) => {
          const verify = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (verify.ok) {
            window.location.href = "/give?success=1";
          } else {
            setError("Payment verification failed. Please contact us.");
          }
        },
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-sm text-red-500 font-body">{error}</p>
      )}
      <Button
        onClick={handlePay}
        disabled={disabled || loading || donation.amount <= 0}
        className="w-full bg-[#1B2A4A] hover:bg-[#2a4070] text-white font-semibold py-3 h-12 text-base"
      >
        {loading ? (
          <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Processing…</>
        ) : (
          <><CreditCard className="mr-2 h-5 w-5" />Pay with Razorpay</>
        )}
      </Button>
      <p className="text-center text-xs text-gray-400 font-body">
        Secured by Razorpay · Cards, UPI, Net Banking & Wallets accepted
      </p>
    </div>
  );
}
