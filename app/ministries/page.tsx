import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MinistryCard } from "@/components/ministries/MinistryCard";
import { ButtonLink } from "@/components/ui/button-link";
import { prisma } from "@/lib/db";
import { mapMinistry } from "@/lib/mappers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ministries",
  description:
    "Discover the ministries of Fr. Yesudas Ministries — worship, youth, prayer, outreach, and children's ministry.",
};

export default async function MinistriesPage() {
  const rows = await prisma.ministry.findMany({ orderBy: { createdAt: "asc" } });
  const ministries = rows.map(mapMinistry);
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-[#1B2A4A] py-14 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-[#D4A853]/20 text-[#D4A853] border-[#D4A853]/30 text-xs tracking-widest uppercase">
              Get Involved
            </Badge>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-3">
              Our Ministries
            </h1>
            <p className="font-body text-white/70 text-lg">
              Every ministry is an expression of God&apos;s love in action. Find where
              you belong and start serving today.
            </p>
          </div>
        </div>
      </section>

      {/* Ministry Cards */}
      <section className="py-14 bg-[#FDF6EC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((ministry) => (
              <MinistryCard key={ministry.id} ministry={ministry} />
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl font-bold text-[#1B2A4A] mb-4">
              Not sure where to start?
            </h2>
            <p className="font-body text-gray-600 leading-relaxed mb-8">
              We&apos;d love to help you find the right place to serve and grow.
              Reach out to us and we&apos;ll connect you with the right team.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <ButtonLink
                href="/contact"
                className="bg-[#1B2A4A] hover:bg-[#2a4070] text-white"
              >
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                href="/give"
                variant="outline"
                className="border-[#1B2A4A] text-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white"
              >
                Support the Ministry
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
