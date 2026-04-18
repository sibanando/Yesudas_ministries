import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, BookOpen, Heart, Users, Target } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockTeamMembers } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Fr. Yesudas Ministries — our story, mission, vision, leadership team, and statement of faith.",
};

const beliefs = [
  {
    title: "The Bible",
    description:
      "We believe the Bible is the inspired, infallible, and authoritative Word of God — our ultimate guide for faith and life.",
  },
  {
    title: "The Trinity",
    description:
      "We believe in one God eternally existing in three persons: Father, Son, and Holy Spirit, each fully God.",
  },
  {
    title: "Salvation by Grace",
    description:
      "We believe salvation is by grace through faith in Jesus Christ alone — His atoning death, burial, and resurrection.",
  },
  {
    title: "The Holy Spirit",
    description:
      "We believe in the present-day ministry of the Holy Spirit, who empowers believers for holy living and service.",
  },
  {
    title: "The Church",
    description:
      "We believe in the universal Church — the Body of Christ — made up of all true believers across all generations.",
  },
  {
    title: "Christ's Return",
    description:
      "We believe in the literal, bodily return of Jesus Christ, who will establish His Kingdom for eternity.",
  },
];

const coreValues = [
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Word-Centered",
    description: "Every message, ministry, and decision is grounded in Scripture.",
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Spirit-Led",
    description: "We follow the leading of the Holy Spirit in prayer and ministry.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Community-Focused",
    description: "We build authentic, caring relationships within the Body of Christ.",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Mission-Driven",
    description: "We exist to reach the lost, disciple the saved, and serve the poor.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="bg-[#1B2A4A] py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-[#D4A853]/20 text-[#D4A853] border-[#D4A853]/30 text-xs tracking-widest uppercase">
              Our Story
            </Badge>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-4">
              About Fr. Yesudas Ministries
            </h1>
            <p className="font-body text-lg text-white/70">
              Over 25 years of proclaiming the Gospel, healing the sick, and transforming
              communities across India and beyond.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 lg:py-20 bg-[#FDF6EC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#1B2A4A]/10">
                <Image
                  src="/images/team/fr-yesudas.jpg"
                  alt="Fr. Yesudas"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 bg-[#1B2A4A] text-white rounded-xl px-5 py-4 shadow-lg hidden lg:block">
                <p className="font-heading text-2xl font-bold text-[#D4A853]">25+</p>
                <p className="font-body text-xs">Years in Ministry</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-body uppercase tracking-widest text-[#D4A853] font-semibold mb-2">
                How It Started
              </p>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-[#1B2A4A] mb-5">
                A Calling from God
              </h2>
              <p className="font-body text-base text-gray-600 leading-relaxed mb-4">
                Fr. Yesudas received his calling to full-time ministry through a profound
                encounter with God, stepping out in faith to reach the unreached across
                Andhra Pradesh and beyond.
              </p>
              <p className="font-body text-base text-gray-600 leading-relaxed mb-4">
                What began as small prayer meetings and village outreach gatherings has,
                by God&apos;s grace, grown into a ministry that touches thousands of lives
                every year — through sermons, healing crusades, youth camps, and
                compassion work.
              </p>
              <p className="font-body text-base text-gray-600 leading-relaxed">
                Today, Fr. Yesudas Ministries is a vibrant community of believers united
                by one purpose: to know Christ and make Him known.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#1B2A4A] rounded-2xl p-8 text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4A853] mb-5">
                <Target className="h-6 w-6 text-[#1B2A4A]" />
              </div>
              <h2 className="font-heading text-2xl font-bold mb-4">Our Mission</h2>
              <p className="font-body text-white/80 leading-relaxed">
                To proclaim the Gospel of Jesus Christ with power, heal the sick, set the
                captives free, and make disciples of all nations — beginning in our
                communities and reaching to the ends of the earth.
              </p>
            </div>
            <div className="bg-[#D4A853] rounded-2xl p-8 text-[#1B2A4A]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B2A4A] mb-5">
                <Heart className="h-6 w-6 text-[#D4A853]" />
              </div>
              <h2 className="font-heading text-2xl font-bold mb-4">Our Vision</h2>
              <p className="font-body text-[#1B2A4A]/80 leading-relaxed">
                To see every person in India and beyond encounter the living Jesus Christ,
                experience His love and transformation, and become fully devoted followers
                who impact their families, communities, and nations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 lg:py-20 bg-[#FDF6EC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-body uppercase tracking-widest text-[#D4A853] font-semibold mb-2">
              What Guides Us
            </p>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-[#1B2A4A]">
              Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-xl p-6 text-center border border-border/50 hover:border-[#D4A853] transition-colors"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#1B2A4A] text-[#D4A853] mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="font-heading text-lg font-semibold text-[#1B2A4A] mb-2">
                  {value.title}
                </h3>
                <p className="font-body text-sm text-gray-500 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-body uppercase tracking-widest text-[#D4A853] font-semibold mb-2">
              The Team
            </p>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-[#1B2A4A]">
              Our Leadership
            </h2>
            <p className="font-body text-base text-gray-500 mt-3">
              Called, equipped, and passionate about serving God and His people.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {mockTeamMembers.map((member) => (
              <div key={member.id} className="text-center">
                <div className="relative h-40 w-40 mx-auto mb-4 rounded-full overflow-hidden bg-[#1B2A4A]/10 ring-4 ring-[#D4A853]/30">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </div>
                <h3 className="font-heading text-lg font-semibold text-[#1B2A4A] mb-1">
                  {member.name}
                </h3>
                <p className="font-body text-sm text-[#D4A853] font-semibold mb-3">
                  {member.role}
                </p>
                <p className="font-body text-sm text-gray-500 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statement of Faith */}
      <section className="py-16 lg:py-20 bg-[#1B2A4A]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-body uppercase tracking-widest text-[#D4A853] font-semibold mb-2">
              What We Believe
            </p>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white">
              Statement of Faith
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {beliefs.map((belief) => (
              <div
                key={belief.title}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#D4A853]/50 transition-colors"
              >
                <h3 className="font-heading text-lg font-semibold text-[#D4A853] mb-3">
                  {belief.title}
                </h3>
                <p className="font-body text-sm text-white/70 leading-relaxed">
                  {belief.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#FDF6EC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Separator className="mb-8" />
          <h2 className="font-heading text-2xl font-bold text-[#1B2A4A] mb-3">
            Come As You Are
          </h2>
          <p className="font-body text-base text-gray-500 mb-6 max-w-md mx-auto">
            We welcome everyone. Join us for worship, community, and life-changing
            encounters with God.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <ButtonLink
              href="/contact"
              className="bg-[#1B2A4A] hover:bg-[#2a4070] text-white"
            >
              Get in Touch
              <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonLink>
            <ButtonLink
              href="/events"
              variant="outline"
              className="border-[#1B2A4A] text-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white"
            >
              View Events
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
