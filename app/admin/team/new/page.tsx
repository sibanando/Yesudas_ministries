import { verifyAdminSession } from "@/lib/dal";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";

export default async function NewTeamMemberPage() {
  await verifyAdminSession();
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Add Team Member" />
        <main className="flex-1 p-6"><TeamMemberForm /></main>
      </div>
    </div>
  );
}
