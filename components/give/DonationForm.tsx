"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DonationFrequency } from "@/types/payment";

const FALLBACK_AMOUNTS_INR = [500, 1000, 2500, 5000];
const FALLBACK_AMOUNTS_USD = [10, 25, 50, 100];
const FALLBACK_CAUSES = [
  { value: "general", label: "General Fund" },
  { value: "building", label: "Building & Facilities" },
  { value: "missions", label: "Mission Support" },
  { value: "compassion", label: "Compassion Ministry" },
  { value: "youth", label: "Youth Ministry" },
];

export interface DonationValues {
  amount: number;
  currency: "INR" | "USD";
  cause: string;
  frequency: DonationFrequency;
  donorName: string;
  donorEmail: string;
}

interface DonationFormProps {
  onChange: (values: DonationValues) => void;
  presetAmountsINR?: number[];
  presetAmountsUSD?: number[];
  causes?: { value: string; label: string }[];
}

export function DonationForm({
  onChange,
  presetAmountsINR = FALLBACK_AMOUNTS_INR,
  presetAmountsUSD = FALLBACK_AMOUNTS_USD,
  causes = FALLBACK_CAUSES,
}: DonationFormProps) {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [frequency, setFrequency] = useState<DonationFrequency>("one-time");
  const [cause, setCause] = useState<string>(causes[0]?.value ?? "general");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(
    presetAmountsINR[1] ?? presetAmountsINR[0] ?? null
  );
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");

  const presets = currency === "INR" ? presetAmountsINR : presetAmountsUSD;
  const symbol = currency === "INR" ? "₹" : "$";

  const effectiveAmount =
    selectedPreset !== null ? selectedPreset : parseFloat(customAmount) || 0;

  const notify = (patch: Partial<DonationValues>) => {
    onChange({
      amount: effectiveAmount,
      currency,
      cause,
      frequency,
      donorName,
      donorEmail,
      ...patch,
    });
  };

  const handlePreset = (amt: number) => {
    setSelectedPreset(amt);
    setCustomAmount("");
    notify({ amount: amt });
  };

  const handleCustom = (val: string) => {
    setCustomAmount(val);
    setSelectedPreset(null);
    notify({ amount: parseFloat(val) || 0 });
  };

  const handleCurrency = (c: "INR" | "USD") => {
    const defaultAmt =
      c === "INR"
        ? (presetAmountsINR[1] ?? presetAmountsINR[0] ?? null)
        : (presetAmountsUSD[1] ?? presetAmountsUSD[0] ?? null);
    setCurrency(c);
    setSelectedPreset(defaultAmt);
    setCustomAmount("");
    notify({ currency: c, amount: defaultAmt ?? 0 });
  };

  return (
    <div className="space-y-6">
      {/* Currency toggle */}
      <div>
        <Label className="font-body text-sm font-medium text-[#1B2A4A] mb-2 block">
          Currency
        </Label>
        <div className="inline-flex rounded-lg border border-border overflow-hidden">
          {(["INR", "USD"] as const).map((c) => (
            <button
              key={c}
              onClick={() => handleCurrency(c)}
              className={`px-5 py-2 text-sm font-body font-semibold transition-colors ${
                currency === c
                  ? "bg-[#1B2A4A] text-white"
                  : "bg-white text-gray-600 hover:bg-[#FDF6EC]"
              }`}
            >
              {c === "INR" ? "₹ INR" : "$ USD"}
            </button>
          ))}
        </div>
      </div>

      {/* Frequency toggle */}
      <div>
        <Label className="font-body text-sm font-medium text-[#1B2A4A] mb-2 block">
          Frequency
        </Label>
        <div className="inline-flex rounded-lg border border-border overflow-hidden">
          {(["one-time", "monthly"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFrequency(f); notify({ frequency: f }); }}
              className={`px-5 py-2 text-sm font-body font-semibold transition-colors ${
                frequency === f
                  ? "bg-[#D4A853] text-[#1B2A4A]"
                  : "bg-white text-gray-600 hover:bg-[#FDF6EC]"
              }`}
            >
              {f === "one-time" ? "One-Time" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      {/* Amount selector */}
      <div>
        <Label className="font-body text-sm font-medium text-[#1B2A4A] mb-2 block">
          Select Amount
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {presets.map((amt) => (
            <button
              key={amt}
              onClick={() => handlePreset(amt)}
              className={`py-3 rounded-xl text-sm font-body font-semibold border-2 transition-all ${
                selectedPreset === amt
                  ? "border-[#1B2A4A] bg-[#1B2A4A] text-white shadow-md"
                  : "border-border bg-white text-[#1B2A4A] hover:border-[#D4A853]"
              }`}
            >
              {symbol}{amt.toLocaleString()}
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-body text-sm">
            {symbol}
          </span>
          <Input
            type="number"
            placeholder="Custom amount"
            value={customAmount}
            onChange={(e) => handleCustom(e.target.value)}
            onFocus={() => setSelectedPreset(null)}
            className="pl-7 font-body"
            min={1}
          />
        </div>
      </div>

      {/* Cause */}
      <div>
        <Label className="font-body text-sm font-medium text-[#1B2A4A] mb-2 block">
          Giving Towards
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {causes.map((c) => (
            <button
              key={c.value}
              onClick={() => { setCause(c.value); notify({ cause: c.value }); }}
              className={`text-left px-4 py-2.5 rounded-lg text-sm font-body border-2 transition-all ${
                cause === c.value
                  ? "border-[#D4A853] bg-[#D4A853]/10 text-[#1B2A4A] font-semibold"
                  : "border-border bg-white text-gray-600 hover:border-[#D4A853]/50"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Donor info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="font-body text-sm font-medium text-[#1B2A4A]">
            Your Name <span className="text-gray-400 font-normal">(optional)</span>
          </Label>
          <Input
            placeholder="Full name"
            value={donorName}
            onChange={(e) => { setDonorName(e.target.value); notify({ donorName: e.target.value }); }}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="font-body text-sm font-medium text-[#1B2A4A]">
            Email <span className="text-gray-400 font-normal">(for receipt)</span>
          </Label>
          <Input
            type="email"
            placeholder="your@email.com"
            value={donorEmail}
            onChange={(e) => { setDonorEmail(e.target.value); notify({ donorEmail: e.target.value }); }}
          />
        </div>
      </div>

      {/* Amount summary */}
      <div className="bg-[#FDF6EC] rounded-xl px-5 py-4 flex items-center justify-between border border-[#D4A853]/30">
        <span className="font-body text-sm text-gray-600">
          {frequency === "monthly" ? "Monthly giving" : "One-time gift"}
        </span>
        <span className="font-heading text-2xl font-bold text-[#1B2A4A]">
          {symbol}
          {effectiveAmount > 0 ? effectiveAmount.toLocaleString() : "—"}
        </span>
      </div>
    </div>
  );
}
