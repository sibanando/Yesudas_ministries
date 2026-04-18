"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DonationValues } from "./DonationForm";

interface Props {
  donation: DonationValues;
  disabled?: boolean;
}

export function StripeCheckout({ donation, disabled }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    if (donation.amount <= 0) {
      setError("Please select or enter a valid amount.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: donation.amount,
          currency: donation.currency.toLowerCase(),
          cause: donation.cause,
          frequency: donation.frequency,
          donorEmail: donation.donorEmail || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Failed to start checkout.");
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-red-500 font-body">{error}</p>}
      <Button
        onClick={handleCheckout}
        disabled={disabled || loading || donation.amount <= 0}
        className="w-full bg-[#635BFF] hover:bg-[#4e46e5] text-white font-semibold py-3 h-12 text-base"
      >
        {loading ? (
          <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Redirecting…</>
        ) : (
          <>Pay with Stripe</>
        )}
      </Button>
      <p className="text-center text-xs text-gray-400 font-body">
        Secured by Stripe · All major cards accepted worldwide
      </p>
    </div>
  );
}
