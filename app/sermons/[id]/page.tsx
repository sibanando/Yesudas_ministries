import type { Metadata } from "next";
import { ArrowLeft, Calendar, Tag, Eye } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import { YouTubeEmbed } from "@/components/sermons/YouTubeEmbed";
import { SermonCard } from "@/components/sermons/SermonCard";
import { prisma } from "@/lib/db";
import { mapSermon } from "@/lib/mappers";
import { format } from "date-fns";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const dbSermon = await prisma.sermon.findUnique({ where: { videoId: id } });
  if (!dbSermon) return { title: "Sermon Not Found" };

  const sermon = mapSermon(dbSermon);
  return {
    title: sermon.title,
    description: sermon.description.slice(0, 160),
    openGraph: {
      title: sermon.title,
      description: sermon.description.slice(0, 160),
      images: sermon.thumbnailUrl ? [{ url: sermon.thumbnailUrl }] : [],
      type: "video.other",
    },
    twitter: {
      card: "summary_large_image",
      title: sermon.title,
      description: sermon.description.slice(0, 160),
      images: sermon.thumbnailUrl ? [sermon.thumbnailUrl] : [],
    },
  };
}

export default async function SermonPage({ params }: Props) {
  const { id } = await params;

  const [dbSermon, dbRelated] = await Promise.all([
    prisma.sermon.findUnique({ where: { videoId: id } }),
    prisma.sermon.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
      take: 4,
    }),
  ]);

  if (!dbSermon || !dbSermon.published) notFound();

  const sermon = mapSermon(dbSermon);
  const related = dbRelated.map(mapSermon).filter((s) => s.id !== id).slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Back nav */}
      <div className="bg-[#1B2A4A] py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ButtonLink
            href="/sermons"
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            All Sermons
          </ButtonLink>
        </div>
      </div>

      {/* Main content */}
      <section className="py-10 bg-[#FDF6EC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Video embed */}
            <YouTubeEmbed
              videoId={sermon.id}
              title={sermon.title}
              thumbnailUrl={sermon.thumbnailUrl}
              className="mb-8 shadow-2xl"
            />

            {/* Sermon metadata */}
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
              {sermon.series && (
                <Badge className="mb-3 bg-[#1B2A4A] text-white text-xs">
                  {sermon.series}
                </Badge>
              )}
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1B2A4A] mb-4">
                {sermon.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-body mb-5">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#D4A853]" />
                  {format(new Date(sermon.publishedAt), "MMMM d, yyyy")}
                </span>
                {sermon.duration && (
                  <span className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                    {sermon.duration}
                  </span>
                )}
                {sermon.viewCount && (
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-[#D4A853]" />
                    {parseInt(sermon.viewCount).toLocaleString()} views
                  </span>
                )}
              </div>

              {/* Tags */}
              {sermon.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <Tag className="h-3.5 w-3.5 text-gray-400" />
                  {sermon.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs font-body">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Description */}
              {sermon.description && (
                <>
                  <div className="h-px bg-border mb-5" />
                  <p className="font-body text-base text-gray-600 leading-relaxed whitespace-pre-line">
                    {sermon.description}
                  </p>
                </>
              )}
            </div>

            {/* Schema.org JSON-LD */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "VideoObject",
                  name: sermon.title,
                  description: sermon.description,
                  thumbnailUrl: sermon.thumbnailUrl,
                  uploadDate: sermon.publishedAt,
                  embedUrl: `https://www.youtube.com/embed/${sermon.id}`,
                  contentUrl: `https://www.youtube.com/watch?v=${sermon.id}`,
                }),
              }}
            />
          </div>
        </div>
      </section>

      {/* Related Sermons */}
      {related.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-bold text-[#1B2A4A] mb-6">
              More Sermons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((s) => (
                <SermonCard key={s.id} sermon={s} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <ButtonLink
                href="/sermons"
                variant="outline"
                className="border-[#1B2A4A] text-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white"
              >
                View All Sermons
              </ButtonLink>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
