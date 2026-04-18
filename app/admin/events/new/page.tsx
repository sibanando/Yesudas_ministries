import { verifyAdminSession } from "@/lib/dal";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EventForm } from "@/components/admin/EventForm";

export default async function NewEventPage() {
  await verifyAdminSession();
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="New Event" />
        <main className="flex-1 p-6">
          <EventForm />
        </main>
      </div>
    </div>
  );
}
