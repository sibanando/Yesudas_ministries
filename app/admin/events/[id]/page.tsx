import { verifyAdminSession } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
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
          <div className="mb-4">
            <Link href="/admin/events" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#1B2A4A] transition-colors">
              <ChevronLeft className="h-4 w-4" /> Back to Events
            </Link>
            <p className="text-xs text-gray-400 mt-1 truncate max-w-xl">Editing: {event.title}</p>
          </div>
          <EventForm id={id} defaultValues={defaultValues} />
        </main>
      </div>
    </div>
  );
}
