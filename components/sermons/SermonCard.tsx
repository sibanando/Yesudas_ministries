import Link from "next/link";
import Image from "next/image";
import { Clock, Play, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Sermon } from "@/types/sermon";
import { formatDistanceToNow } from "date-fns";

interface SermonCardProps {
  sermon: Sermon;
}

export function SermonCard({ sermon }: SermonCardProps) {
  const timeAgo = formatDistanceToNow(new Date(sermon.publishedAt), {
    addSuffix: true,
  });

  return (
    <Link href={`/sermons/${sermon.id}`} className="group block">
      <Card className="overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 bg-card h-full">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-[#1B2A4A]/10">
          <Image
            src={sermon.thumbnailUrl}
            alt={sermon.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4A853]/90 backdrop-blur-sm">
              <Play className="h-5 w-5 text-[#1B2A4A] fill-current ml-0.5" />
            </div>
          </div>
          {/* Duration badge */}
          {sermon.duration && (
            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/80 px-2 py-0.5 text-xs text-white font-mono">
              <Clock className="h-2.5 w-2.5" />
              {sermon.duration}
            </div>
          )}
          {/* Series badge */}
          {sermon.series && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-[#1B2A4A]/90 text-white text-xs px-2 py-0.5">
                {sermon.series}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-heading text-base font-semibold text-[#1B2A4A] line-clamp-2 mb-2 group-hover:text-[#D4A853] transition-colors">
            {sermon.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 font-body leading-relaxed">
            {sermon.description}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground font-body">
            <span>{timeAgo}</span>
            {sermon.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <span>{sermon.tags[0]}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
