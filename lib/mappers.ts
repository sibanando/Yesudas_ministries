import type { BlogPost } from "@/types/blog";
import type { ChurchEvent } from "@/types/event";
import type { Ministry, TeamMember } from "@/types/ministry";
import type { Sermon } from "@/types/sermon";
import type {
  BlogPost as PrismaBlogPost,
  ChurchEvent as PrismaChurchEvent,
  Ministry as PrismaMinistry,
  TeamMember as PrismaTeamMember,
  Sermon as PrismaSermon,
} from "@/lib/generated/prisma";

export function mapBlogPost(p: PrismaBlogPost): BlogPost {
  return {
    slug: p.slug,
    title: p.title,
    date: p.date,
    excerpt: p.excerpt,
    author: p.author,
    authorRole: p.authorRole ?? undefined,
    authorImageUrl: p.authorImageUrl ?? undefined,
    coverImageUrl: p.coverImageUrl ?? undefined,
    readTime: p.readTime,
    tags: p.tags as string[],
    category: p.category as BlogPost["category"],
    content: p.content ?? undefined,
  };
}

export function mapEvent(e: PrismaChurchEvent): ChurchEvent {
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    date: e.date,
    time: e.time,
    endTime: e.endTime ?? undefined,
    location: e.location,
    type: e.type as ChurchEvent["type"],
    imageUrl: e.imageUrl ?? undefined,
    isRecurring: e.isRecurring,
    registrationUrl: e.registrationUrl ?? undefined,
  };
}

export function mapMinistry(m: PrismaMinistry): Ministry {
  return {
    id: m.id,
    name: m.name,
    description: m.description,
    fullDescription: m.fullDescription ?? undefined,
    imageUrl: m.imageUrl,
    leader: m.leader,
    leaderImageUrl: m.leaderImageUrl ?? undefined,
    schedule: m.schedule,
    contactEmail: m.contactEmail ?? undefined,
    tags: m.tags as string[],
  };
}

export function mapTeamMember(t: PrismaTeamMember): TeamMember {
  return {
    id: t.id,
    name: t.name,
    role: t.role,
    bio: t.bio,
    imageUrl: t.imageUrl,
    email: t.email ?? undefined,
  };
}

export function mapSermon(s: PrismaSermon): Sermon {
  return {
    id: s.videoId,
    title: s.title,
    description: s.description,
    thumbnailUrl: s.thumbnailUrl,
    publishedAt: s.publishedAt,
    duration: s.duration ?? undefined,
    tags: s.tags as string[],
    series: s.series ?? undefined,
    viewCount: s.viewCount ?? undefined,
  };
}
