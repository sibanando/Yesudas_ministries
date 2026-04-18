import { verifyAdminSession } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
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
          <SermonForm id={id} defaultValues={defaultValues} />
        </main>
      </div>
    </div>
  );
}
