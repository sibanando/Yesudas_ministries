import { z } from "zod";

const tagsField = z
  .string()
  .transform((s) => s.split(",").map((t) => t.trim()).filter(Boolean));

export const blogPostSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1).max(200),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  excerpt: z.string().min(1).max(500),
  author: z.string().min(1),
  authorRole: z.string().optional(),
  authorImageUrl: z.string().optional(),
  coverImageUrl: z.string().optional(),
  readTime: z.string().min(1),
  tags: tagsField,
  category: z.enum(["devotional", "testimony", "ministry-update", "teaching"]),
  content: z.string().optional(),
  published: z.boolean().default(true),
});

export const churchEventSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  time: z.string().min(1),
  endTime: z.string().optional(),
  location: z.string().min(1),
  type: z.enum(["sunday-service", "special", "retreat", "prayer", "youth", "community"]),
  imageUrl: z.string().optional(),
  isRecurring: z.boolean().default(false),
  registrationUrl: z.string().optional(),
});

export const ministrySchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  fullDescription: z.string().optional(),
  imageUrl: z.string().min(1),
  leader: z.string().min(1),
  leaderImageUrl: z.string().optional(),
  schedule: z.string().min(1),
  contactEmail: z.string().email().optional().or(z.literal("")),
  tags: tagsField,
});

export const teamMemberSchema = z.object({
  name: z.string().min(1).max(200),
  role: z.string().min(1),
  bio: z.string().min(1),
  imageUrl: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  sortOrder: z.number().int().default(0),
});

export const sermonSchema = z.object({
  videoId: z.string().min(1, "YouTube video ID is required"),
  title: z.string().min(1).max(300),
  description: z.string().min(1),
  thumbnailUrl: z.string().min(1),
  publishedAt: z.string().min(1),
  duration: z.string().optional().or(z.literal("")),
  tags: tagsField,
  series: z.string().optional().or(z.literal("")),
  viewCount: z.string().optional().or(z.literal("")),
  published: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
export type ChurchEventInput = z.infer<typeof churchEventSchema>;
export type MinistryInput = z.infer<typeof ministrySchema>;
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
export type SermonInput = z.infer<typeof sermonSchema>;
