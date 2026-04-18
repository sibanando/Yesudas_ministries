"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonationForm } from "./DonationForm";
import { RazorpayButton } from "./RazorpayButton";
import { StripeCheckout } from "./StripeCheckout";
import type { DonationValues } from "./DonationForm";
import { QrCode, Copy, CheckCircle } from "lucide-react";

const UPI_ID = "fryesudasministries@upi";

function UPITab({ donation }: { donation: DonationValues }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-center">
      {/* QR placeholder */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-48 h-48 bg-[#FDF6EC] border-2 border-[#D4A853]/40 rounded-xl flex flex-col items-center justify-center mx-auto">
          <QrCode className="h-20 w-20 text-[#1B2A4A]" />
          <p className="text-xs text-gray-400 mt-2 font-body">UPI QR Code</p>
        </div>
        <p className="font-body text-xs text-gray-500">
          Scan with any UPI app — GPay, PhonePe, Paytm, BHIM
        </p>
      </div>

      {/* UPI ID */}
      <div className="bg-[#FDF6EC] rounded-xl p-4 border border-[#D4A853]/30">
        <p className="font-body text-xs text-gray-500 mb-1">UPI ID</p>
        <div className="flex items-center justify-center gap-3">
          <span className="font-mono text-[#1B2A4A] font-semibold">{UPI_ID}</span>
          <button
            onClick={copy}
            className="text-[#D4A853] hover:text-[#b8893a] transition-colors"
            title="Copy UPI ID"
          >
            {copied ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {donation.amount > 0 && (
        <div className="bg-white border border-border/50 rounded-xl p-4">
          <p className="font-body text-sm text-gray-600">
            Please send{" "}
            <span className="font-bold text-[#1B2A4A]">
              {donation.currency === "INR" ? "₹" : "$"}
              {donation.amount.toLocaleString()}
            </span>{" "}
            to the UPI ID above and note:{" "}
            <span className="font-semibold">{donation.cause}</span>
          </p>
        </div>
      )}

      {/* Bank transfer */}
      <div className="text-left bg-[#1B2A4A] rounded-xl p-5 text-white">
        <p className="font-body text-xs text-[#D4A853] font-semibold uppercase tracking-wider mb-3">
          Bank Transfer Details
        </p>
        <div className="space-y-1.5 text-sm font-body text-white/80">
          <div className="flex justify-between">
            <span>Account Name</span>
            <span className="font-semibold text-white">Fr. Yesudas Ministries</span>
          </div>
          <div className="flex justify-between">
            <span>Account Number</span>
            <span className="font-semibold text-white">XXXX XXXX XXXX</span>
          </div>
          <div className="flex justify-between">
            <span>IFSC Code</span>
            <span className="font-semibold text-white">XXXXXXXXXX</span>
          </div>
          <div className="flex justify-between">
            <span>Bank</span>
            <span className="font-semibold text-white">State Bank of India</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GiveOptions() {
  const [donation, setDonation] = useState<DonationValues>({
    amount: 1000,
    currency: "INR",
    cause: "general",
    frequency: "one-time",
    donorName: "",
    donorEmail: "",
  });

  const razorpayConfigured = !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const stripeConfigured = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
      {/* Left: Donation amount form */}
      <div className="lg:col-span-3 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50">
        <h2 className="font-heading text-2xl font-semibold text-[#1B2A4A] mb-6">
          Choose Your Gift
        </h2>
        <DonationForm onChange={setDonation} />
      </div>

      {/* Right: Payment method */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50">
        <h2 className="font-heading text-2xl font-semibold text-[#1B2A4A] mb-6">
          Payment Method
        </h2>

        <Tabs defaultValue={razorpayConfigured ? "razorpay" : "upi"}>
          <TabsList className="w-full mb-6 grid grid-cols-3 h-auto gap-1 bg-[#FDF6EC] p-1 rounded-xl">
            <TabsTrigger
              value="razorpay"
              className="text-xs font-body font-semibold py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1B2A4A] data-[state=active]:shadow-sm"
            >
              Razorpay
            </TabsTrigger>
            <TabsTrigger
              value="stripe"
              className="text-xs font-body font-semibold py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1B2A4A] data-[state=active]:shadow-sm"
            >
              Stripe
            </TabsTrigger>
            <TabsTrigger
              value="upi"
              className="text-xs font-body font-semibold py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1B2A4A] data-[state=active]:shadow-sm"
            >
              UPI / Bank
            </TabsTrigger>
          </TabsList>

          <TabsContent value="razorpay">
            {razorpayConfigured ? (
              <RazorpayButton donation={donation} />
            ) : (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm font-body text-amber-800">
                Razorpay is not configured yet. Add{" "}
                <code className="font-mono">NEXT_PUBLIC_RAZORPAY_KEY_ID</code> to{" "}
                <code className="font-mono">.env.local</code> to enable.
              </div>
            )}
          </TabsContent>

          <TabsContent value="stripe">
            {stripeConfigured ? (
              <StripeCheckout donation={donation} />
            ) : (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm font-body text-amber-800">
                Stripe is not configured yet. Add{" "}
                <code className="font-mono">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> to{" "}
                <code className="font-mono">.env.local</code> to enable.
              </div>
            )}
          </TabsContent>

          <TabsContent value="upi">
            <UPITab donation={donation} />
          </TabsContent>
        </Tabs>

        <p className="mt-4 text-center text-xs text-gray-400 font-body">
          All donations support the ministry of Fr. Yesudas Ministries.
          <br />
          80G tax exemption available on request.
        </p>
      </div>
    </div>
  );
}
