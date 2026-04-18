export interface Sermon {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  duration?: string;
  tags: string[];
  series?: string;
  viewCount?: string;
}
