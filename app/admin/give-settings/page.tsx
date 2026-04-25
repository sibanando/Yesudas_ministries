"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Plus, Trash2 } from "lucide-react";

type Cause = { value: string; label: string };

const DEFAULT_CAUSES: Cause[] = [
  { value: "general", label: "General Fund" },
  { value: "building", label: "Building & Facilities" },
  { value: "missions", label: "Mission Support" },
  { value: "compassion", label: "Compassion Ministry" },
  { value: "youth", label: "Youth Ministry" },
];

export default function AdminGiveSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [presetINR, setPresetINR] = useState("500,1000,2500,5000");
  const [presetUSD, setPresetUSD] = useState("10,25,50,100");
  const [causes, setCauses] = useState<Cause[]>(DEFAULT_CAUSES);
  const [enableRazorpay, setEnableRazorpay] = useState(true);
  const [enableStripe, setEnableStripe] = useState(true);
  const [enableUPI, setEnableUPI] = useState(true);
  const [upiId, setUpiId] = useState("fryesudasministries@upi");
  const [bankAccountName, setBankAccountName] = useState("Fr. Yesudas Ministries");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankIfsc, setBankIfsc] = useState("");
  const [bankName, setBankName] = useState("State Bank of India");

  useEffect(() => {
    fetch("/api/admin/give-settings")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => {
        const s = d.settings ?? {};
        if (s.give_preset_amounts_inr) setPresetINR(s.give_preset_amounts_inr);
        if (s.give_preset_amounts_usd) setPresetUSD(s.give_preset_amounts_usd);
        if (s.give_causes) {
          try { setCauses(JSON.parse(s.give_causes)); } catch {}
        }
        if (s.give_enable_razorpay !== undefined) setEnableRazorpay(s.give_enable_razorpay !== "false");
        if (s.give_enable_stripe !== undefined) setEnableStripe(s.give_enable_stripe !== "false");
        if (s.give_enable_upi !== undefined) setEnableUPI(s.give_enable_upi !== "false");
        if (s.give_upi_id) setUpiId(s.give_upi_id);
        if (s.give_bank_account_name) setBankAccountName(s.give_bank_account_name);
        if (s.give_bank_account_number) setBankAccountNumber(s.give_bank_account_number);
        if (s.give_bank_ifsc) setBankIfsc(s.give_bank_ifsc);
        if (s.give_bank_name) setBankName(s.give_bank_name);
      })
      .catch(() => toast.error("Failed to load settings."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    for (const c of causes) {
      if (!c.value.trim() || !c.label.trim()) {
        toast.error("All causes must have both a key and a display name.");
        return;
      }
    }
    setSaving(true);
    const res = await fetch("/api/admin/give-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        give_preset_amounts_inr: presetINR,
        give_preset_amounts_usd: presetUSD,
        give_causes: JSON.stringify(causes),
        give_enable_razorpay: enableRazorpay ? "true" : "false",
        give_enable_stripe: enableStripe ? "true" : "false",
        give_enable_upi: enableUPI ? "true" : "false",
        give_upi_id: upiId,
        give_bank_account_name: bankAccountName,
        give_bank_account_number: bankAccountNumber,
        give_bank_ifsc: bankIfsc,
        give_bank_name: bankName,
      }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Give settings saved.");
    } else {
      toast.error("Failed to save settings.");
    }
  };

  const addCause = () => setCauses((prev) => [...prev, { value: "", label: "" }]);
  const removeCause = (i: number) => setCauses((prev) => prev.filter((_, idx) => idx !== i));
  const updateCause = (i: number, field: "value" | "label", val: string) =>
    setCauses((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: val } : c)));

  const inputCls =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Give Settings" />
        <main className="flex-1 p-6">
          {loading ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : (
            <div className="max-w-2xl space-y-6">

              {/* Gift Amounts */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                <h2 className="text-base font-semibold text-[#1B2A4A]">Gift Amounts</h2>
                <div>
                  <label className={labelCls}>INR Preset Amounts</label>
                  <input
                    value={presetINR}
                    onChange={(e) => setPresetINR(e.target.value)}
                    className={inputCls}
                    placeholder="500,1000,2500,5000"
                  />
                  <p className="text-xs text-gray-400 mt-1">Comma-separated whole numbers in rupees</p>
                </div>
                <div>
                  <label className={labelCls}>USD Preset Amounts</label>
                  <input
                    value={presetUSD}
                    onChange={(e) => setPresetUSD(e.target.value)}
                    className={inputCls}
                    placeholder="10,25,50,100"
                  />
                  <p className="text-xs text-gray-400 mt-1">Comma-separated whole numbers in dollars</p>
                </div>
              </div>

              {/* Donation Causes */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <h2 className="text-base font-semibold text-[#1B2A4A]">Donation Causes</h2>
                <div className="grid grid-cols-2 gap-x-3 mb-1">
                  <p className="text-xs font-medium text-gray-500">Display Name</p>
                  <p className="text-xs font-medium text-gray-500">Internal Key</p>
                </div>
                <div className="space-y-2">
                  {causes.map((cause, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <input
                          value={cause.label}
                          onChange={(e) => updateCause(i, "label", e.target.value)}
                          placeholder="e.g. General Fund"
                          className={inputCls}
                        />
                        <input
                          value={cause.value}
                          onChange={(e) => updateCause(i, "value", e.target.value)}
                          placeholder="e.g. general"
                          className={inputCls}
                        />
                      </div>
                      <button
                        onClick={() => removeCause(i)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                        title="Remove cause"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addCause}
                  className="flex items-center gap-1.5 text-sm text-[#1B2A4A] hover:text-[#2a4070] font-medium"
                >
                  <Plus className="h-4 w-4" /> Add Cause
                </button>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                <h2 className="text-base font-semibold text-[#1B2A4A]">Payment Methods</h2>

                <div className="flex flex-wrap gap-6">
                  {(
                    [
                      { label: "Razorpay", val: enableRazorpay, set: setEnableRazorpay },
                      { label: "Stripe", val: enableStripe, set: setEnableStripe },
                      { label: "UPI / Bank", val: enableUPI, set: setEnableUPI },
                    ] as const
                  ).map(({ label, val, set }) => (
                    <label key={label} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={(e) => set(e.target.checked)}
                        className="h-4 w-4 accent-[#1B2A4A]"
                      />
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>

                <div className="space-y-4 pt-3 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-600">UPI &amp; Bank Details</h3>
                  <div>
                    <label className={labelCls}>UPI ID</label>
                    <input
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className={inputCls}
                      placeholder="fryesudasministries@upi"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Bank Account Name</label>
                    <input
                      value={bankAccountName}
                      onChange={(e) => setBankAccountName(e.target.value)}
                      className={inputCls}
                      placeholder="Fr. Yesudas Ministries"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Bank Account Number</label>
                    <input
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
                      className={inputCls}
                      placeholder="XXXX XXXX XXXX"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>IFSC Code</label>
                    <input
                      value={bankIfsc}
                      onChange={(e) => setBankIfsc(e.target.value)}
                      className={inputCls}
                      placeholder="SBIN0000000"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Bank Name</label>
                    <input
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className={inputCls}
                      placeholder="State Bank of India"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-[#1B2A4A] text-white text-sm font-medium rounded-lg hover:bg-[#2a4070] disabled:opacity-40 transition-colors"
              >
                {saving ? "Saving…" : "Save Settings"}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
