import type { MetadataRoute } from "next";
import { getLatestSermons } from "@/lib/youtube";
import { mockBlogPosts } from "@/lib/data";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://fryesudasministries.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/sermons`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/events`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/ministries`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/give`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/gallery`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];

  // Dynamic sermon pages
  let sermonPages: MetadataRoute.Sitemap = [];
  try {
    const sermons = await getLatestSermons(50);
    sermonPages = sermons.map((sermon) => ({
      url: `${BASE_URL}/sermons/${sermon.id}`,
      lastModified: new Date(sermon.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    }));
  } catch {
    // silently skip if YouTube API is unavailable
  }

  const blogPages: MetadataRoute.Sitemap = mockBlogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...sermonPages, ...blogPages];
}
