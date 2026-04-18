import { verifyAdminSession } from "@/lib/dal";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SermonForm } from "@/components/admin/SermonForm";

export default async function NewSermonPage() {
  await verifyAdminSession();
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="New Sermon" />
        <main className="flex-1 p-6">
          <SermonForm />
        </main>
      </div>
    </div>
  );
}
