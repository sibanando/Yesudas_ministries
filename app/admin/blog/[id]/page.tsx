import { verifyAdminSession } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { BlogForm } from "@/components/admin/BlogForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: PageProps) {
  await verifyAdminSession();
  const { id } = await params;

  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  const defaultValues = {
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    author: post.author,
    authorRole: post.authorRole ?? "",
    readTime: post.readTime,
    tags: (post.tags as string[]).join(", "),
    category: post.category as "devotional" | "testimony" | "ministry-update" | "teaching",
    content: post.content ?? "",
    published: post.published,
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Edit Blog Post" />
        <main className="flex-1 p-6">
          <div className="mb-4">
            <Link href="/admin/blog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1B2A4A] transition-colors">
              <ChevronLeft className="h-4 w-4" /> Back to Blog Posts
            </Link>
            <p className="text-xs text-gray-400 mt-1 truncate max-w-xl">Editing: {post.title}</p>
          </div>
          <BlogForm id={id} defaultValues={defaultValues} />
        </main>
      </div>
    </div>
  );
}
