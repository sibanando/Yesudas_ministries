export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  authorRole?: string;
  authorImageUrl?: string;
  coverImageUrl?: string;
  readTime: string;
  tags: string[];
  category: "devotional" | "testimony" | "ministry-update" | "teaching";
  content?: string; // HTML string for full post
}
