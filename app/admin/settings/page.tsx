"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { siteSettingsSchema, type SiteSettingsInput } from "@/lib/validations/admin";

const DEFAULT_VALUES: SiteSettingsInput = {
  contact_address: "Fr. Yesudas Ministries,\nVisakhapatnam, Andhra Pradesh,\nIndia",
  contact_phone: "+91 XXXXX XXXXX",
  contact_phone_href: "tel:+91XXXXXXXXXX",
  contact_email: "info@fryesudasministries.com",
};

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SiteSettingsInput>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => {
        if (d.settings && Object.keys(d.settings).length > 0) {
          reset({ ...DEFAULT_VALUES, ...d.settings });
        }
      })
      .catch(() => toast.error("Failed to load settings."))
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data: SiteSettingsInput) => {
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success("Settings saved.");
    } else {
      toast.error("Failed to save settings.");
    }
  };

  const fieldCls =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";
  const errorCls = "text-xs text-red-500 mt-1";

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Site Settings" />
        <main className="flex-1 p-6">
          {loading ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                <h2 className="text-base font-semibold text-[#1B2A4A]">Contact Information</h2>

                <div>
                  <label className={labelCls}>Address</label>
                  <textarea
                    {...register("contact_address")}
                    rows={3}
                    className={fieldCls}
                    placeholder={"Fr. Yesudas Ministries,\nVisakhapatnam, Andhra Pradesh,\nIndia"}
                  />
                  {errors.contact_address && (
                    <p className={errorCls}>{errors.contact_address.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Phone (display text)</label>
                  <input
                    {...register("contact_phone")}
                    className={fieldCls}
                    placeholder="+91 XXXXX XXXXX"
                  />
                  {errors.contact_phone && (
                    <p className={errorCls}>{errors.contact_phone.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Phone (tel: link href)</label>
                  <input
                    {...register("contact_phone_href")}
                    className={fieldCls}
                    placeholder="tel:+91XXXXXXXXXX"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Used as the href for the phone number link (e.g. tel:+919876543210)
                  </p>
                  {errors.contact_phone_href && (
                    <p className={errorCls}>{errors.contact_phone_href.message}</p>
                  )}
                </div>

                <div>
                  <label className={labelCls}>Email</label>
                  <input
                    {...register("contact_email")}
                    type="email"
                    className={fieldCls}
                    placeholder="info@fryesudasministries.com"
                  />
                  {errors.contact_email && (
                    <p className={errorCls}>{errors.contact_email.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#1B2A4A] text-white text-sm font-medium rounded-lg hover:bg-[#2a4070] disabled:opacity-40 transition-colors"
              >
                {isSubmitting ? "Saving…" : "Save Settings"}
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
