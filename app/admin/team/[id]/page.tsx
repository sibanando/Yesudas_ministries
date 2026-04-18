import { verifyAdminSession } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";

interface PageProps { params: Promise<{ id: string }>; }

export default async function EditTeamMemberPage({ params }: PageProps) {
  await verifyAdminSession();
  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) notFound();

  const defaultValues = {
    name: member.name,
    role: member.role,
    bio: member.bio,
    imageUrl: member.imageUrl,
    email: member.email ?? "",
    sortOrder: member.sortOrder,
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Edit Team Member" />
        <main className="flex-1 p-6"><TeamMemberForm id={id} defaultValues={defaultValues} /></main>
      </div>
    </div>
  );
}
