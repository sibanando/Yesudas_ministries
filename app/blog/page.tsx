import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/blog/BlogCard";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { prisma } from "@/lib/db";
import { mapBlogPost } from "@/lib/mappers";
import type { BlogPost } from "@/types/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Devotionals, teachings, testimonies and ministry updates from Fr. Yesudas Ministries.",
};

const categoryLabels: Record<BlogPost["category"] | "all", string> = {
  all: "All Posts",
  devotional: "Devotionals",
  teaching: "Teachings",
  testimony: "Testimonies",
  "ministry-update": "Ministry Updates",
};

const categories = ["all", "devotional", "teaching", "testimony", "ministry-update"] as const;

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const categoryParam = params.category as BlogPost["category"] | undefined;

  const rows = await prisma.blogPost.findMany({
    where: {
      published: true,
      ...(categoryParam ? { category: categoryParam } : {}),
    },
    orderBy: { date: "desc" },
  });

  const sorted = rows.map(mapBlogPost);
  const activeCategory: BlogPost["category"] | "all" = categoryParam ?? "all";
  const [featured, ...rest] = sorted;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-[#1B2A4A] py-14 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge className="mb-4 bg-[#D4A853]/20 text-[#D4A853] border-[#D4A853]/30 text-xs tracking-widest uppercase">
              From the Ministry
            </Badge>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-3">
              Blog
            </h1>
            <p className="font-body text-white/70 text-lg">
              Devotionals, Bible teachings, testimonies, and updates from our
              ministry. Be encouraged and grow in faith.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-border/50 sticky top-16 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
            {categories.map((cat) => (
              <a
                key={cat}
                href={cat === "all" ? "/blog" : `/blog?category=${cat}`}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-body font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-[#1B2A4A] text-white"
                    : "bg-[#FDF6EC] text-[#1B2A4A] hover:bg-[#1B2A4A]/10"
                }`}
              >
                {categoryLabels[cat]}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-12 lg:py-16 bg-[#FDF6EC] flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {sorted.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-body text-gray-400 text-lg">
                No posts in this category yet.
              </p>
            </div>
          ) : (
            <>
              {featured && (
                <div className="mb-10">
                  <p className="text-xs font-body uppercase tracking-widest text-[#D4A853] font-semibold mb-4">
                    Latest Post
                  </p>
                  <BlogCard post={featured} featured />
                </div>
              )}
              {rest.length > 0 && (
                <>
                  <p className="text-xs font-body uppercase tracking-widest text-[#D4A853] font-semibold mb-6">
                    More Posts
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((post) => (
                      <BlogCard key={post.slug} post={post} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>

      <NewsletterSignup />
    </div>
  );
}
