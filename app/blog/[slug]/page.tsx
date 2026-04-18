import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { NewsletterSignup } from "@/components/shared/NewsletterSignup";
import { BlogCard } from "@/components/blog/BlogCard";
import { prisma } from "@/lib/db";
import { mapBlogPost } from "@/lib/mappers";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const row = await prisma.blogPost.findUnique({ where: { slug, published: true } });
  if (!row) return {};
  return {
    title: row.title,
    description: row.excerpt,
    openGraph: {
      title: row.title,
      description: row.excerpt,
      type: "article",
      publishedTime: row.date,
      authors: [row.author],
    },
  };
}

const categoryLabels: Record<string, string> = {
  devotional: "Devotional",
  testimony: "Testimony",
  "ministry-update": "Ministry Update",
  teaching: "Teaching",
};

const categoryColors: Record<string, string> = {
  devotional: "bg-[#D4A853]/20 text-[#D4A853] border-[#D4A853]/30",
  testimony: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "ministry-update": "bg-blue-50 text-blue-700 border-blue-200",
  teaching: "bg-[#1B2A4A]/10 text-[#1B2A4A] border-[#1B2A4A]/20",
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  const [row, relatedRows] = await Promise.all([
    prisma.blogPost.findUnique({ where: { slug, published: true } }),
    prisma.blogPost.findMany({
      where: { published: true, slug: { not: slug } },
      orderBy: { date: "desc" },
      take: 10,
    }),
  ]);

  if (!row) notFound();

  const post = mapBlogPost(row);
  const related = relatedRows
    .map(mapBlogPost)
    .filter((p) => p.category === post.category || p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-[#1B2A4A] py-14 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/60 hover:text-[#D4A853] text-sm font-body transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <div className="max-w-3xl">
            <Badge className={`mb-4 text-xs border ${categoryColors[post.category]}`}>
              {categoryLabels[post.category]}
            </Badge>
            <h1 className="font-heading text-3xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm font-body text-white/60">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {format(new Date(post.date), "MMMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Article */}
      <section className="py-12 lg:py-16 bg-[#FDF6EC]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Main content */}
            <article className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-border/50">
                {/* Author bar */}
                <div className="flex items-center gap-3 pb-6 mb-6 border-b border-border/50">
                  <div className="h-10 w-10 rounded-full bg-[#D4A853]/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-heading text-[#D4A853] text-sm font-bold">
                      {post.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-[#1B2A4A]">{post.author}</p>
                    {post.authorRole && (
                      <p className="font-body text-xs text-gray-400">{post.authorRole}</p>
                    )}
                  </div>
                </div>

                {/* Post excerpt (lead) */}
                <p className="font-body text-lg text-gray-600 leading-relaxed mb-8 italic border-l-4 border-[#D4A853] pl-5">
                  {post.excerpt}
                </p>

                {post.content ? (
                  <div
                    className="prose prose-lg prose-slate max-w-none
                      prose-headings:font-heading prose-headings:text-[#1B2A4A]
                      prose-a:text-[#D4A853] prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-[#1B2A4A]
                      prose-li:marker:text-[#D4A853]"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                ) : (
                  <p className="font-body text-base text-gray-600 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border/50">
                    <Tag className="h-4 w-4 text-gray-400 mt-0.5" />
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs font-body capitalize">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1 flex flex-col gap-6">
              <div className="bg-[#1B2A4A] rounded-2xl p-6 text-white">
                <h3 className="font-heading text-sm font-semibold text-[#D4A853] uppercase tracking-wider mb-4">
                  About the Author
                </h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-[#D4A853]/30 flex items-center justify-center flex-shrink-0">
                    <span className="font-heading text-[#D4A853] text-sm font-bold">
                      {post.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-white">{post.author}</p>
                    {post.authorRole && (
                      <p className="font-body text-xs text-white/60">{post.authorRole}</p>
                    )}
                  </div>
                </div>
                <p className="font-body text-xs text-white/70 leading-relaxed">
                  Fr. Yesudas Ministries reaches the unreached with the Gospel of Jesus Christ through teaching, prayer, and compassion.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/50">
                <h3 className="font-heading text-sm font-semibold text-[#1B2A4A] uppercase tracking-wider mb-4">
                  Browse by Category
                </h3>
                <div className="flex flex-col gap-2">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <Link
                      key={key}
                      href={`/blog?category=${key}`}
                      className="font-body text-sm text-gray-600 hover:text-[#D4A853] transition-colors py-1 border-b border-border/40 last:border-0"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-[#FDF6EC] rounded-2xl p-6 border border-[#D4A853]/30">
                <h3 className="font-heading text-sm font-semibold text-[#1B2A4A] mb-2">
                  Partner with Us
                </h3>
                <p className="font-body text-xs text-gray-500 mb-4 leading-relaxed">
                  Your giving enables us to reach more lives with the Gospel.
                </p>
                <ButtonLink
                  href="/give"
                  className="w-full bg-[#D4A853] hover:bg-[#e8c27a] text-[#1B2A4A] font-semibold text-sm justify-center"
                >
                  Give Today
                </ButtonLink>
              </div>
            </aside>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <p className="text-xs font-body uppercase tracking-widest text-[#D4A853] font-semibold mb-6">
                You May Also Like
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => (
                  <BlogCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <NewsletterSignup />
    </div>
  );
}
