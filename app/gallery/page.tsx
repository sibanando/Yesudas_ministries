import type { Metadata } from "next";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ImageIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos and memories from Fr. Yesudas Ministries — worship services, outreach, retreats, and community events.",
};

type Album = {
  title: string;
  tag: string;
  images: { src: string; alt: string }[];
};

const albums: Album[] = [
  {
    title: "Worship Services",
    tag: "Worship",
    images: [
      { src: "/images/gallery/worship-1.jpg", alt: "Sunday worship service" },
      { src: "/images/gallery/worship-2.jpg", alt: "Praise and worship" },
      { src: "/images/gallery/worship-3.jpg", alt: "Congregation in prayer" },
    ],
  },
  {
    title: "Community Outreach",
    tag: "Outreach",
    images: [
      { src: "/images/gallery/outreach-1.jpg", alt: "Food distribution" },
      { src: "/images/gallery/outreach-2.jpg", alt: "Medical camp" },
      { src: "/images/gallery/outreach-3.jpg", alt: "Village ministry" },
    ],
  },
  {
    title: "Youth Ministry",
    tag: "Youth",
    images: [
      { src: "/images/gallery/youth-1.jpg", alt: "Youth retreat" },
      { src: "/images/gallery/youth-2.jpg", alt: "Youth worship night" },
      { src: "/images/gallery/youth-3.jpg", alt: "Youth camp activity" },
    ],
  },
  {
    title: "Special Events",
    tag: "Events",
    images: [
      { src: "/images/gallery/event-1.jpg", alt: "Easter celebration" },
      { src: "/images/gallery/event-2.jpg", alt: "Christmas service" },
      { src: "/images/gallery/event-3.jpg", alt: "Annual convention" },
    ],
  },
];

function GalleryImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl bg-[#1B2A4A]/10">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-[#1B2A4A]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
        <p className="text-white text-xs font-body">{alt}</p>
      </div>
      {/* Placeholder shown when image fails */}
      <div className="absolute inset-0 flex items-center justify-center text-[#1B2A4A]/20 pointer-events-none">
        <ImageIcon className="h-10 w-10" />
      </div>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-[#1B2A4A] py-14 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-[#D4A853]/20 text-[#D4A853] border-[#D4A853]/30 text-xs tracking-widest uppercase">
              Memories
            </Badge>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-3">
              Gallery
            </h1>
            <p className="font-body text-white/70 text-lg">
              A glimpse into the life and work of Fr. Yesudas Ministries — in worship,
              service, and community.
            </p>
          </div>
        </div>
      </section>

      {/* Albums */}
      <section className="py-14 bg-[#FDF6EC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {albums.map((album) => (
            <div key={album.title} className="mb-14 last:mb-0">
              <div className="flex items-center gap-3 mb-6">
                <Badge className="bg-[#1B2A4A] text-white text-xs">
                  {album.tag}
                </Badge>
                <h2 className="font-heading text-2xl font-bold text-[#1B2A4A]">
                  {album.title}
                </h2>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
                {album.images.map((img) => (
                  <GalleryImage key={img.src} src={img.src} alt={img.alt} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* YouTube CTA */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl font-bold text-[#1B2A4A] mb-3">
            Watch Our Services on YouTube
          </h2>
          <p className="font-body text-gray-500 mb-6 max-w-md mx-auto">
            Can&apos;t make it in person? Join us online through our YouTube channel
            for live and recorded services.
          </p>
          <a
            href="https://www.youtube.com/@fryesudasministries"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1B2A4A] hover:bg-[#2a4070] text-white font-body font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
          >
            Visit our YouTube Channel
          </a>
        </div>
      </section>
    </div>
  );
}
