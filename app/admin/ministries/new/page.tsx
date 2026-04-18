import { verifyAdminSession } from "@/lib/dal";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MinistryForm } from "@/components/admin/MinistryForm";

export default async function NewMinistryPage() {
  await verifyAdminSession();
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="New Ministry" />
        <main className="flex-1 p-6"><MinistryForm /></main>
      </div>
    </div>
  );
}
