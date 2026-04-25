import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { GiveOptions } from "@/components/give/GiveOptions";
import { getGiveSettings } from "@/lib/public-data";
import { Heart, Shield, Globe, HandHeart } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Give",
  description:
    "Support Fr. Yesudas Ministries through your generous giving. Donate via Razorpay, Stripe, UPI, or bank transfer.",
};

const impactStats = [
  { icon: <Heart className="h-6 w-6" />, num: "50K+", label: "Lives Touched" },
  { icon: <Globe className="h-6 w-6" />, num: "100+", label: "Villages Reached" },
  { icon: <HandHeart className="h-6 w-6" />, num: "1000+", label: "Families Supported" },
  { icon: <Shield className="h-6 w-6" />, num: "25+", label: "Years of Ministry" },
];

const givingAreas = [
  {
    cause: "General Fund",
    description: "Supports the day-to-day operations and ongoing ministry work.",
    percentage: 40,
  },
  {
    cause: "Mission Support",
    description: "Sending the Gospel to unreached villages and people groups.",
    percentage: 30,
  },
  {
    cause: "Compassion Ministry",
    description: "Food, medical care, and support for the poor and marginalized.",
    percentage: 20,
  },
  {
    cause: "Youth Ministry",
    description: "Investing in the next generation of disciples and leaders.",
    percentage: 10,
  },
];

export default async function GivePage() {
  const giveSettings = await getGiveSettings();
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-[#1B2A4A] py-14 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-[#D4A853]/20 text-[#D4A853] border-[#D4A853]/30 text-xs tracking-widest uppercase">
              Partner With Us
            </Badge>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-3">
              Give to the Ministry
            </h1>
            <p className="font-body text-white/70 text-lg">
              Your generosity fuels the Gospel. Every gift — large or small — makes an
              eternal difference in the lives we serve.
            </p>
          </div>
        </div>
      </section>

      {/* Impact stats */}
      <section className="bg-[#D4A853]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {impactStats.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="flex-shrink-0 text-[#1B2A4A] opacity-70">{s.icon}</div>
                <div>
                  <p className="font-heading text-xl font-bold text-[#1B2A4A]">{s.num}</p>
                  <p className="font-body text-xs text-[#1B2A4A]/70">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation form */}
      <section className="py-14 bg-[#FDF6EC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <GiveOptions giveSettings={giveSettings} />
        </div>
      </section>

      {/* Transparency */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs font-body uppercase tracking-widest text-[#D4A853] font-semibold mb-2">
                Transparency
              </p>
              <h2 className="font-heading text-3xl font-bold text-[#1B2A4A]">
                Where Your Giving Goes
              </h2>
              <p className="font-body text-gray-500 mt-2">
                We are committed to faithful stewardship of every gift entrusted to us.
              </p>
            </div>

            <div className="space-y-5">
              {givingAreas.map((area) => (
                <div key={area.cause}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="font-body text-sm font-semibold text-[#1B2A4A]">
                        {area.cause}
                      </span>
                      <p className="font-body text-xs text-gray-500">{area.description}</p>
                    </div>
                    <span className="font-heading text-lg font-bold text-[#D4A853] ml-4">
                      {area.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-[#FDF6EC] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1B2A4A] to-[#D4A853] rounded-full"
                      style={{ width: `${area.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-[#FDF6EC] rounded-xl p-5 text-center border border-[#D4A853]/30">
              <p className="font-body text-sm text-gray-600">
                <Shield className="inline h-4 w-4 text-[#D4A853] mr-1.5 align-middle" />
                All donations are processed securely. 80G tax exemption certificates
                available. Contact us at{" "}
                <a
                  href="mailto:info@fryesudasministries.com"
                  className="text-[#D4A853] hover:underline"
                >
                  info@fryesudasministries.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
