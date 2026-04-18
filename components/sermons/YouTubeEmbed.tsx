"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  thumbnailUrl?: string;
  className?: string;
}

export function YouTubeEmbed({
  videoId,
  title,
  thumbnailUrl,
  className = "",
}: YouTubeEmbedProps) {
  const [loaded, setLoaded] = useState(false);

  const thumbnail =
    thumbnailUrl ||
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

  if (loaded) {
    return (
      <div className={`relative aspect-video w-full overflow-hidden rounded-xl ${className}`}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setLoaded(true)}
      className={`group relative aspect-video w-full overflow-hidden rounded-xl bg-black cursor-pointer ${className}`}
      aria-label={`Play: ${title}`}
    >
      <Image
        src={thumbnail}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
        priority
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-[#D4A853] shadow-2xl transition-transform duration-200 group-hover:scale-110">
          <Play className="h-7 w-7 sm:h-9 sm:w-9 text-[#1B2A4A] fill-current ml-1" />
        </div>
      </div>
      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <p className="font-body text-sm text-white line-clamp-2">{title}</p>
      </div>
    </button>
  );
}
