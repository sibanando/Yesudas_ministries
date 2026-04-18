import {
  ArrowRight,
  Play,
  Calendar,
  Users,
  Heart,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { YoutubeIcon } from "@/components/shared/SocialIcons";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import { SermonCard } from "@/components/sermons/SermonCard";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { prisma } from "@/lib/db";
import { mapSermon, mapEvent, mapMinistry } from "@/lib/mappers";
import { format } from "date-fns";

const ministryIcons: Record<string, React.ReactNode> = {
  worship: <Heart className="h-6 w-6" />,
  youth: <Users className="h-6 w-6" />,
  prayer: <BookOpen className="h-6 w-6" />,
  outreach: <ArrowRight className="h-6 w-6" />,
  children: <Users className="h-6 w-6" />,
};

function getMinistryIcon(name: string): React.ReactNode {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(ministryIcons)) {
    if (lower.includes(key)) return icon;
  }
  return <Heart className="h-6 w-6" />;
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [rawSermons, rawEvents, rawMinistries] = await Promise.all([
    prisma.sermon.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
      take: 3,
    }),
    prisma.churchEvent.findMany({
      orderBy: { date: "asc" },
    }),
    prisma.ministry.findMany(),
  ]);

  const sermons = rawSermons.map(mapSermon);
  const upcomingEvents = rawEvents
    .map(mapEvent)
    .filter((e) => new Date(e.date) >= new Date())
    .slice(0, 3);
  const ministries = rawMinistries.map(mapMinistry);

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative min-h-[80vh] flex items-center bg-[#1B2A4A] overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A853' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-[#D4A853]/20 text-[#D4A853] border-[#D4A853]/30 font-body text-xs tracking-widest uppercase">
              Welcome to Our Ministry
            </Badge>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Proclaiming the{" "}
              <span className="text-[#D4A853]">Gospel</span> of
              <br />
              Jesus Christ
            </h1>
            <p className="font-body text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
              Fr. Yesudas Ministries reaches the unreached, heals the broken, and builds
              up the Body of Christ through the power of the Holy Spirit.
            </p>
            <div className="flex flex-wrap gap-4">
              <ButtonLink
                href="/sermons"
                size="lg"
                className="bg-[#D4A853] hover:bg-[#e8c27a] text-[#1B2A4A] font-semibold"
              >
                <Play className="mr-2 h-4 w-4 fill-current" />
                Watch Sermons
              </ButtonLink>
              <ButtonLink
                href="/about"
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent"
              >
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        </div>
        {/* Decorative gold bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4A853] via-[#e8c27a] to-[#D4A853]" />
      </section>

      {/* ── Latest Sermons ── */}
      <section className="py-16 lg:py-20 bg-[#FDF6EC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-xs font-body uppercase tracking-widest text-[#D4A853] font-semibold mb-2">
                Recent Messages
              </p>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-[#1B2A4A]">
                Latest Sermons
              </h2>
            </div>
            <ButtonLink
              href="/sermons"
              variant="outline"
              className="hidden sm:flex border-[#1B2A4A] text-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white"
            >
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </ButtonLink>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((sermon) => (
              <SermonCard key={sermon.id} sermon={sermon} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <ButtonLink
              href="/sermons"
              variant="outline"
              className="border-[#1B2A4A] text-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white"
            >
              View All Sermons
              <ChevronRight className="ml-1 h-4 w-4" />
            </ButtonLink>
          </div>

          <div className="mt-10 flex justify-center">
            <a
              href="https://www.youtube.com/@fryesudasministries"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-body text-[#1B2A4A]/60 hover:text-red-600 transition-colors"
            >
              <YoutubeIcon className="h-4 w-4" />
              Subscribe on YouTube for new sermons every week
            </a>
          </div>
        </div>
      </section>

      {/* ── About Snippet ── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-body uppercase tracking-widest text-[#D4A853] font-semibold mb-2">
                About Us
              </p>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-[#1B2A4A] mb-5">
                A Ministry Built on Prayer &amp; the Word
              </h2>
              <p className="font-body text-base text-gray-600 leading-relaxed mb-4">
                Fr. Yesudas Ministries was founded with a simple yet profound calling — to
                proclaim the Gospel of Jesus Christ to every person, regardless of
                background, language, or status.
              </p>
              <p className="font-body text-base text-gray-600 leading-relaxed mb-8">
                Through decades of ministry, we have witnessed thousands come to faith,
                countless healings, and communities transformed by God&apos;s grace.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-8">
                {[
                  { num: "25+", label: "Years of Ministry" },
                  { num: "50K+", label: "Lives Touched" },
                  { num: "5", label: "Active Ministries" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-heading text-3xl font-bold text-[#D4A853]">
                      {stat.num}
                    </p>
                    <p className="font-body text-xs text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <ButtonLink
                href="/about"
                className="bg-[#1B2A4A] hover:bg-[#2a4070] text-white"
              >
                Our Story
                <ArrowRight className="ml-2 h-4 w-4" />
              </ButtonLink>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-[#1B2A4A] to-[#2a4070] flex flex-col items-center justify-center text-white p-8">
                <div className="text-6xl mb-4">&#10013;</div>
                <p className="font-heading text-2xl font-bold text-center mb-2">Fr. Yesudas Ministries</p>
                <p className="font-body text-sm text-white/70 text-center">Proclaiming the Gospel of Jesus Christ</p>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#D4A853] text-[#1B2A4A] rounded-xl px-6 py-4 shadow-lg hidden lg:block">
                <p className="font-heading text-2xl font-bold">25+</p>
                <p className="font-body text-xs font-semibold">Years Serving</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ── */}
      <section className="py-16 lg:py-20 bg-[#FDF6EC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-xs font-body uppercase tracking-widest text-[#D4A853] font-semibold mb-2">
                What&apos;s Coming Up
              </p>
              <h2 className="font-heading text-3xl lg:text-4xl font-bold text-[#1B2A4A]">
                Upcoming Events
              </h2>
            </div>
            <ButtonLink
              href="/events"
              variant="outline"
              className="hidden sm:flex border-[#1B2A4A] text-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white"
            >
              All Events
              <ChevronRight className="ml-1 h-4 w-4" />
            </ButtonLink>
          </div>

          <div className="flex flex-col gap-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-5 bg-white rounded-xl p-5 shadow-sm border border-border/50 hover:shadow-md transition-shadow"
              >
                {/* Date block */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-[#1B2A4A] text-white">
                  <span className="font-heading text-lg font-bold leading-none">
                    {format(new Date(event.date), "dd")}
                  </span>
                  <span className="font-body text-xs uppercase tracking-wider text-[#D4A853]">
                    {format(new Date(event.date), "MMM")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-heading text-base font-semibold text-[#1B2A4A] truncate">
                      {event.title}
                    </h3>
                    {event.isRecurring && (
                      <Badge variant="secondary" className="text-xs shrink-0">
                        Weekly
                      </Badge>
                    )}
                  </div>
                  <p className="font-body text-sm text-gray-500">
                    {event.time}
                    {event.endTime && ` – ${event.endTime}`} &middot; {event.location}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Calendar className="h-5 w-5 text-[#D4A853]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ministries Grid ── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-body uppercase tracking-widest text-[#D4A853] font-semibold mb-2">
              Get Involved
            </p>
            <h2 className="font-heading text-3xl lg:text-4xl font-bold text-[#1B2A4A] mb-4">
              Our Ministries
            </h2>
            <p className="font-body text-base text-gray-500">
              Discover the many ways you can connect, serve, and grow within our community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((ministry) => (
              <div
                key={ministry.id}
                className="group relative bg-[#FDF6EC] rounded-xl p-6 border border-border/50 hover:border-[#D4A853] hover:shadow-md transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B2A4A] text-[#D4A853] mb-4 group-hover:bg-[#D4A853] group-hover:text-[#1B2A4A] transition-colors">
                  {getMinistryIcon(ministry.name)}
                </div>
                <h3 className="font-heading text-lg font-semibold text-[#1B2A4A] mb-2">
                  {ministry.name}
                </h3>
                <p className="font-body text-sm text-gray-500 leading-relaxed mb-4">
                  {ministry.description}
                </p>
                <p className="font-body text-xs text-[#D4A853] font-semibold">
                  {ministry.schedule}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <ButtonLink
              href="/ministries"
              variant="outline"
              className="border-[#1B2A4A] text-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white"
            >
              Explore All Ministries
              <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <NewsletterSignup />

      {/* ── CTA Section ── */}
      <section className="py-16 lg:py-20 bg-[#1B2A4A]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-4">
            Partner With Us in Ministry
          </h2>
          <p className="font-body text-lg text-white/70 mb-8 max-w-xl mx-auto">
            Your generous giving enables us to reach more lives with the Gospel, care for
            the poor, and build up the Body of Christ.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <ButtonLink
              href="/give"
              size="lg"
              className="bg-[#D4A853] hover:bg-[#e8c27a] text-[#1B2A4A] font-semibold"
            >
              <Heart className="mr-2 h-4 w-4" />
              Give Today
            </ButtonLink>
            <ButtonLink
              href="/contact"
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white bg-transparent"
            >
              Connect With Us
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
