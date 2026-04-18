import { verifyAdminSession } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
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
          <BlogForm id={id} defaultValues={defaultValues} />
        </main>
      </div>
    </div>
  );
}
