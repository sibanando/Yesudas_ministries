import { unstable_cache } from "next/cache";
import { google } from "googleapis";
import type { Sermon } from "@/types/sermon";
import { mockSermons } from "@/lib/data";

function getYouTubeClient() {
  return google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
  });
}

/**
 * Gets the uploads playlist ID for the channel.
 * Costs 1 quota unit. Cached for 24 hours.
 */
export const getUploadsPlaylistId = unstable_cache(
  async (): Promise<string | null> => {
    try {
      const youtube = getYouTubeClient();
      const res = await youtube.channels.list({
        part: ["contentDetails"],
        id: [process.env.YOUTUBE_CHANNEL_ID!],
      });
      return (
        res.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? null
      );
    } catch (error) {
      console.error("[YouTube] Failed to get uploads playlist ID:", error);
      return null;
    }
  },
  ["youtube-uploads-playlist-id"],
  { revalidate: 86400, tags: ["youtube"] }
);

/**
 * Gets the latest sermons from the channel's uploads playlist.
 * Costs 1 quota unit. Cached for 1 hour.
 */
const _getLatestSermonsFromYouTube = unstable_cache(
  async (maxResults: number): Promise<Sermon[]> => {
    try {
      const youtube = getYouTubeClient();
      const playlistId = await getUploadsPlaylistId();
      if (!playlistId) return [];

      const res = await youtube.playlistItems.list({
        part: ["snippet", "contentDetails"],
        playlistId,
        maxResults,
      });

      const items = res.data.items ?? [];
      return items.map((item) => ({
        id: item.contentDetails?.videoId ?? item.snippet?.resourceId?.videoId ?? "",
        title: item.snippet?.title ?? "Untitled",
        description: item.snippet?.description ?? "",
        thumbnailUrl:
          item.snippet?.thumbnails?.high?.url ??
          item.snippet?.thumbnails?.default?.url ??
          "",
        publishedAt: item.snippet?.publishedAt ?? new Date().toISOString(),
        tags: [],
      }));
    } catch (error) {
      console.error("[YouTube] Failed to fetch sermons:", error);
      return [];
    }
  },
  ["youtube-latest-sermons"],
  { revalidate: 3600, tags: ["youtube", "sermons"] }
);

/**
 * Public function: returns latest sermons.
 * Falls back to mock data if no API key is set or API fails.
 */
export async function getLatestSermons(maxResults = 8): Promise<Sermon[]> {
  if (!process.env.YOUTUBE_API_KEY) {
    return mockSermons.slice(0, maxResults);
  }
  const sermons = await _getLatestSermonsFromYouTube(maxResults);
  return sermons.length > 0 ? sermons : mockSermons.slice(0, maxResults);
}

/**
 * Gets a single sermon by video ID from YouTube.
 * Falls back to mock data.
 */
export async function getSermonById(videoId: string): Promise<Sermon | null> {
  if (!process.env.YOUTUBE_API_KEY) {
    return mockSermons.find((s) => s.id === videoId) ?? mockSermons[0];
  }

  try {
    const youtube = getYouTubeClient();
    const res = await youtube.videos.list({
      part: ["snippet", "contentDetails", "statistics"],
      id: [videoId],
    });

    const video = res.data.items?.[0];
    if (!video) return null;

    return {
      id: video.id ?? videoId,
      title: video.snippet?.title ?? "Untitled",
      description: video.snippet?.description ?? "",
      thumbnailUrl:
        video.snippet?.thumbnails?.maxres?.url ??
        video.snippet?.thumbnails?.high?.url ??
        "",
      publishedAt: video.snippet?.publishedAt ?? new Date().toISOString(),
      duration: formatDuration(video.contentDetails?.duration),
      tags: video.snippet?.tags ?? [],
      viewCount: video.statistics?.viewCount ?? undefined,
    };
  } catch (error) {
    console.error("[YouTube] Failed to fetch sermon by ID:", error);
    return mockSermons.find((s) => s.id === videoId) ?? null;
  }
}

/**
 * Checks if the channel is currently live streaming.
 * Costs 100 quota units. Cached for 30 minutes.
 * Only enable this in production when expected to be useful.
 */
export const getLiveStream = unstable_cache(
  async () => {
    if (!process.env.YOUTUBE_API_KEY) return null;

    try {
      const youtube = getYouTubeClient();
      const res = await youtube.search.list({
        part: ["snippet"],
        channelId: process.env.YOUTUBE_CHANNEL_ID!,
        eventType: "live",
        type: ["video"],
        maxResults: 1,
      });
      const item = res.data.items?.[0];
      if (!item) return null;

      return {
        videoId: item.id?.videoId ?? "",
        title: item.snippet?.title ?? "Live Stream",
        thumbnailUrl: item.snippet?.thumbnails?.high?.url ?? "",
      };
    } catch (error) {
      console.error("[YouTube] Failed to check live stream:", error);
      return null;
    }
  },
  ["youtube-live-stream"],
  { revalidate: 1800, tags: ["youtube", "live"] }
);

/** Converts ISO 8601 duration (e.g. PT1H5M30S) to human-readable format */
function formatDuration(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return undefined;
  const h = parseInt(match[1] ?? "0");
  const m = parseInt(match[2] ?? "0");
  const s = parseInt(match[3] ?? "0");
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}
