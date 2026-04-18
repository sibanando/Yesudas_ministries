"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
  isRecurring: boolean;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/events")
      .then((r) => r.json())
      .then((d) => setEvents(d.events ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/events/${deleteId}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteId(null);
    if (res.ok) {
      toast.success("Event deleted.");
      setEvents((e) => e.filter((x) => x.id !== deleteId));
    } else {
      toast.error("Failed to delete event.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Events" />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">{events.length} event{events.length !== 1 ? "s" : ""}</p>
            <Link href="/admin/events/new" className="flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white text-sm font-medium rounded-lg hover:bg-[#2a4070] transition-colors">
              <Plus className="h-4 w-4" /> New Event
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-gray-400">No events yet.</p>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Location</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Type</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{event.title}</p>
                        {event.isRecurring && <span className="text-xs text-[#D4A853]">Recurring</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{event.date} · {event.time}</td>
                      <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{event.location}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-[#1B2A4A]/10 text-[#1B2A4A] capitalize">
                          {event.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <Link href={`/admin/events/${event.id}`} className="p-1.5 text-gray-400 hover:text-[#1B2A4A] transition-colors">
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button onClick={() => setDeleteId(event.id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Event"
        description="This will permanently delete the event."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
