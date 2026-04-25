"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonationForm } from "./DonationForm";
import { RazorpayButton } from "./RazorpayButton";
import { StripeCheckout } from "./StripeCheckout";
import type { DonationValues } from "./DonationForm";
import type { GiveSettings } from "@/lib/public-data";
import { QRCodeSVG } from "qrcode.react";
import { Copy, CheckCircle } from "lucide-react";

interface UPITabProps {
  donation: DonationValues;
  upiId: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankName: string;
}

function UPITab({ donation, upiId, bankAccountName, bankAccountNumber, bankIfsc, bankName }: UPITabProps) {
  const [copied, setCopied] = useState(false);

  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(bankAccountName)}&cu=INR`;

  const copy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-center">
      {/* Generated QR code */}
      <div className="flex flex-col items-center gap-3">
        <div className="p-3 bg-white border-2 border-[#D4A853]/40 rounded-xl inline-block">
          <QRCodeSVG
            value={upiDeepLink}
            size={176}
            bgColor="#ffffff"
            fgColor="#1B2A4A"
            level="M"
          />
        </div>
        <p className="font-body text-xs text-gray-500">
          Scan with any UPI app — GPay, PhonePe, Paytm, BHIM
        </p>
      </div>

      {/* UPI ID */}
      <div className="bg-[#FDF6EC] rounded-xl p-4 border border-[#D4A853]/30">
        <p className="font-body text-xs text-gray-500 mb-1">UPI ID</p>
        <div className="flex items-center justify-center gap-3">
          <span className="font-mono text-[#1B2A4A] font-semibold">{upiId}</span>
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
            <span className="font-semibold text-white">{bankAccountName}</span>
          </div>
          <div className="flex justify-between">
            <span>Account Number</span>
            <span className="font-semibold text-white">{bankAccountNumber || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span>IFSC Code</span>
            <span className="font-semibold text-white">{bankIfsc || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span>Bank</span>
            <span className="font-semibold text-white">{bankName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface GiveOptionsProps {
  giveSettings: GiveSettings;
}

export function GiveOptions({ giveSettings }: GiveOptionsProps) {
  const firstDefaultAmount =
    giveSettings.presetAmountsINR[1] ?? giveSettings.presetAmountsINR[0] ?? 0;

  const [donation, setDonation] = useState<DonationValues>({
    amount: firstDefaultAmount,
    currency: "INR",
    cause: giveSettings.causes[0]?.value ?? "general",
    frequency: "one-time",
    donorName: "",
    donorEmail: "",
  });

  const razorpayConfigured = !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const stripeConfigured = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  const tabs = [
    giveSettings.enableRazorpay && { value: "razorpay", label: "Razorpay" },
    giveSettings.enableStripe && { value: "stripe", label: "Stripe" },
    giveSettings.enableUPI && { value: "upi", label: "UPI / Bank" },
  ].filter(Boolean) as { value: string; label: string }[];

  const defaultTab = tabs[0]?.value ?? "upi";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
      {/* Left: Donation amount form */}
      <div className="lg:col-span-3 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50">
        <h2 className="font-heading text-2xl font-semibold text-[#1B2A4A] mb-6">
          Choose Your Gift
        </h2>
        <DonationForm
          onChange={setDonation}
          presetAmountsINR={giveSettings.presetAmountsINR}
          presetAmountsUSD={giveSettings.presetAmountsUSD}
          causes={giveSettings.causes}
        />
      </div>

      {/* Right: Payment method */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-border/50">
        <h2 className="font-heading text-2xl font-semibold text-[#1B2A4A] mb-6">
          Payment Method
        </h2>

        {tabs.length === 0 ? (
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-sm font-body text-gray-500 text-center">
            No payment methods are currently available. Please contact the ministry.
          </div>
        ) : (
          <Tabs defaultValue={defaultTab}>
            <TabsList
              className={`w-full mb-6 grid h-auto gap-1 bg-[#FDF6EC] p-1 rounded-xl`}
              style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
            >
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-xs font-body font-semibold py-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#1B2A4A] data-[state=active]:shadow-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {giveSettings.enableRazorpay && (
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
            )}

            {giveSettings.enableStripe && (
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
            )}

            {giveSettings.enableUPI && (
              <TabsContent value="upi">
                <UPITab
                  donation={donation}
                  upiId={giveSettings.upiId}
                  bankAccountName={giveSettings.bankAccountName}
                  bankAccountNumber={giveSettings.bankAccountNumber}
                  bankIfsc={giveSettings.bankIfsc}
                  bankName={giveSettings.bankName}
                />
              </TabsContent>
            )}
          </Tabs>
        )}

        <p className="mt-4 text-center text-xs text-gray-400 font-body">
          All donations support the ministry of Fr. Yesudas Ministries.
          <br />
          80G tax exemption available on request.
        </p>
      </div>
    </div>
  );
}
