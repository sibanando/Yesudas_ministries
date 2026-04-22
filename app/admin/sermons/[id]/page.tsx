import { verifyAdminSession } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SermonForm } from "@/components/admin/SermonForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSermonPage({ params }: PageProps) {
  await verifyAdminSession();
  const { id } = await params;

  const sermon = await prisma.sermon.findUnique({ where: { id } });
  if (!sermon) notFound();

  const defaultValues = {
    videoId: sermon.videoId,
    title: sermon.title,
    description: sermon.description,
    thumbnailUrl: sermon.thumbnailUrl,
    publishedAt: sermon.publishedAt,
    duration: sermon.duration ?? "",
    tags: (sermon.tags as string[]).join(", "),
    series: sermon.series ?? "",
    viewCount: sermon.viewCount ?? "",
    published: sermon.published,
    sortOrder: sermon.sortOrder,
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Edit Sermon" />
        <main className="flex-1 p-6">
          <div className="mb-4">
            <Link href="/admin/sermons" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1B2A4A] transition-colors">
              <ChevronLeft className="h-4 w-4" /> Back to Sermons
            </Link>
            <p className="text-xs text-gray-400 mt-1 truncate max-w-xl">Editing: {sermon.title}</p>
          </div>
          <SermonForm id={id} defaultValues={defaultValues} />
        </main>
      </div>
    </div>
  );
}
