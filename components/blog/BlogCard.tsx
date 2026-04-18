import Link from "next/link";
import { Calendar, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/types/blog";
import { format } from "date-fns";

const categoryLabels: Record<BlogPost["category"], string> = {
  devotional: "Devotional",
  testimony: "Testimony",
  "ministry-update": "Ministry Update",
  teaching: "Teaching",
};

const categoryColors: Record<BlogPost["category"], string> = {
  devotional: "bg-[#D4A853]/20 text-[#D4A853] border-[#D4A853]/30",
  testimony: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "ministry-update": "bg-blue-50 text-blue-700 border-blue-200",
  teaching: "bg-[#1B2A4A]/10 text-[#1B2A4A] border-[#1B2A4A]/20",
};

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group flex flex-col bg-white rounded-2xl overflow-hidden border border-border/50",
        "hover:border-[#D4A853] hover:shadow-md transition-all duration-300",
        featured && "lg:flex-row"
      )}
    >
      {/* Cover image placeholder */}
      <div
        className={cn(
          "relative bg-[#1B2A4A]/10 overflow-hidden shrink-0",
          featured ? "lg:w-2/5 aspect-[4/3] lg:aspect-auto" : "aspect-[16/9]"
        )}
      >
        {post.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1B2A4A] to-[#2a4070]">
            <div className="text-center px-6">
              <p className="font-heading text-[#D4A853] text-xs uppercase tracking-widest mb-2">
                {categoryLabels[post.category]}
              </p>
              <p className="font-heading text-white text-lg font-semibold leading-snug line-clamp-3">
                {post.title}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge className={cn("text-xs border font-body", categoryColors[post.category])}>
            {categoryLabels[post.category]}
          </Badge>
        </div>

        <h3
          className={cn(
            "font-heading font-bold text-[#1B2A4A] leading-snug mb-2 group-hover:text-[#D4A853] transition-colors",
            featured ? "text-xl lg:text-2xl" : "text-lg"
          )}
        >
          {post.title}
        </h3>

        <p className="font-body text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4 flex-1">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-body mt-auto">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {format(new Date(post.date), "MMM d, yyyy")}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
          {post.tags[0] && (
            <span className="flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" />
              {post.tags[0]}
            </span>
          )}
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
          <div className="h-7 w-7 rounded-full bg-[#D4A853]/20 flex items-center justify-center flex-shrink-0">
            <span className="font-heading text-[#D4A853] text-xs font-bold">
              {post.author.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-body text-xs font-semibold text-[#1B2A4A]">{post.author}</p>
            {post.authorRole && (
              <p className="font-body text-xs text-gray-400">{post.authorRole}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
