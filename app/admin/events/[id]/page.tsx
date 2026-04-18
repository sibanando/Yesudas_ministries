import { verifyAdminSession } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EventForm } from "@/components/admin/EventForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  await verifyAdminSession();
  const { id } = await params;

  const event = await prisma.churchEvent.findUnique({ where: { id } });
  if (!event) notFound();

  const defaultValues = {
    title: event.title,
    description: event.description,
    date: event.date,
    time: event.time,
    endTime: event.endTime ?? "",
    location: event.location,
    type: event.type as "sunday-service" | "special" | "retreat" | "prayer" | "youth" | "community",
    imageUrl: event.imageUrl ?? "",
    isRecurring: event.isRecurring,
    registrationUrl: event.registrationUrl ?? "",
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Edit Event" />
        <main className="flex-1 p-6">
          <EventForm id={id} defaultValues={defaultValues} />
        </main>
      </div>
    </div>
  );
}
