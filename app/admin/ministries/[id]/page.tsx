import { verifyAdminSession } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MinistryForm } from "@/components/admin/MinistryForm";

interface PageProps { params: Promise<{ id: string }>; }

export default async function EditMinistryPage({ params }: PageProps) {
  await verifyAdminSession();
  const { id } = await params;
  const ministry = await prisma.ministry.findUnique({ where: { id } });
  if (!ministry) notFound();

  const defaultValues = {
    name: ministry.name,
    description: ministry.description,
    fullDescription: ministry.fullDescription ?? "",
    imageUrl: ministry.imageUrl,
    leader: ministry.leader,
    leaderImageUrl: ministry.leaderImageUrl ?? "",
    schedule: ministry.schedule,
    contactEmail: ministry.contactEmail ?? "",
    tags: (ministry.tags as string[]).join(", "),
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Edit Ministry" />
        <main className="flex-1 p-6"><MinistryForm id={id} defaultValues={defaultValues} /></main>
      </div>
    </div>
  );
}
