import type { Metadata } from "next";
import { YoutubeIcon } from "@/components/shared/SocialIcons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { SermonCard } from "@/components/sermons/SermonCard";
import { YouTubeEmbed } from "@/components/sermons/YouTubeEmbed";
import { prisma } from "@/lib/db";
import { mapSermon } from "@/lib/mappers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sermons",
  description:
    "Watch the latest sermons and messages from Fr. Yesudas Ministries. Spirit-filled teaching from the Word of God.",
};

export default async function SermonsPage() {
  const dbSermons = await prisma.sermon.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
  });
  const sermons = dbSermons.map(mapSermon);
  const [featured, ...rest] = sermons;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-[#1B2A4A] py-14 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-[#D4A853]/20 text-[#D4A853] border-[#D4A853]/30 text-xs tracking-widest uppercase">
              Messages
            </Badge>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-3">
              Sermons
            </h1>
            <p className="font-body text-white/70 text-lg">
              Spirit-filled messages from the Word of God. Watch, be encouraged,
              and share with others.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Sermon */}
      {featured && (
        <section className="py-12 bg-[#FDF6EC]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-body uppercase tracking-widest text-[#D4A853] font-semibold mb-4">
              Latest Message
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              <div className="lg:col-span-3">
                <YouTubeEmbed
                  videoId={featured.id}
                  title={featured.title}
                  thumbnailUrl={featured.thumbnailUrl}
                />
              </div>
              <div className="lg:col-span-2">
                {featured.series && (
                  <Badge className="mb-3 bg-[#1B2A4A] text-white text-xs">
                    {featured.series}
                  </Badge>
                )}
                <h2 className="font-heading text-2xl lg:text-3xl font-bold text-[#1B2A4A] mb-3">
                  {featured.title}
                </h2>
                <p className="font-body text-sm text-gray-600 leading-relaxed mb-5 line-clamp-4">
                  {featured.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {featured.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs font-body"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <ButtonLink
                  href={`/sermons/${featured.id}`}
                  className="bg-[#1B2A4A] hover:bg-[#2a4070] text-white"
                >
                  Watch Full Sermon
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sermon Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-2xl font-bold text-[#1B2A4A]">
              All Messages
            </h2>
            <a
              href="https://www.youtube.com/@fryesudasministries"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-body text-gray-500 hover:text-red-600 transition-colors"
            >
              <YoutubeIcon className="h-4 w-4" />
              <span className="hidden sm:inline">YouTube Channel</span>
            </a>
          </div>
          {rest.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rest.map((sermon) => (
                <SermonCard key={sermon.id} sermon={sermon} />
              ))}
            </div>
          ) : !featured ? (
            <p className="text-center text-gray-400 py-8">No sermons available yet.</p>
          ) : null}
          <div className="mt-10 text-center">
            <a
              href="https://www.youtube.com/@fryesudasministries"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="border-[#1B2A4A] text-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white gap-2"
              >
                <YoutubeIcon className="h-4 w-4" />
                View All on YouTube
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
