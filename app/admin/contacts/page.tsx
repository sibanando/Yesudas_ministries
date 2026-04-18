"use client";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { format } from "date-fns";
import { MailOpen } from "lucide-react";
import { toast } from "sonner";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/contacts")
      .then((r) => r.json())
      .then((d) => setSubmissions(d.submissions ?? []))
      .finally(() => setLoading(false));
  }, []);

  const markRead = async (id: string) => {
    await fetch(`/api/admin/contacts/${id}`, { method: "PATCH" });
    setSubmissions((s) => s.map((x) => (x.id === id ? { ...x, read: true } : x)));
    toast.success("Marked as read.");
  };

  const unread = submissions.filter((s) => !s.read).length;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Contact Submissions" />
        <main className="flex-1 p-6">
          <p className="text-sm text-gray-500 mb-6">
            {unread} unread · {submissions.length} total
          </p>
          {loading ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : submissions.length === 0 ? (
            <p className="text-sm text-gray-400">No contact submissions yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {submissions.map((s) => (
                <div
                  key={s.id}
                  className={`bg-white rounded-xl border p-5 ${!s.read ? "border-[#D4A853]/50" : "border-gray-200"}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {!s.read && (
                          <span className="w-2 h-2 rounded-full bg-[#D4A853] shrink-0" />
                        )}
                        <p className="font-semibold text-gray-900 text-sm">{s.name}</p>
                        <span className="text-gray-400 text-xs">·</span>
                        <a href={`mailto:${s.email}`} className="text-xs text-blue-600 hover:underline">{s.email}</a>
                        {s.phone && <span className="text-xs text-gray-400">{s.phone}</span>}
                      </div>
                      <p className="text-sm font-medium text-[#1B2A4A] mb-1">{s.subject}</p>
                      {expanded === s.id ? (
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{s.message}</p>
                      ) : (
                        <p className="text-sm text-gray-500 truncate max-w-xl">{s.message}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="text-xs text-gray-400">
                        {format(new Date(s.createdAt), "dd MMM yyyy")}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                          className="text-xs text-gray-500 hover:text-[#1B2A4A] transition-colors"
                        >
                          {expanded === s.id ? "Collapse" : "Expand"}
                        </button>
                        {!s.read && (
                          <button
                            onClick={() => markRead(s.id)}
                            className="flex items-center gap-1 text-xs text-[#D4A853] hover:text-[#b8912e] transition-colors"
                          >
                            <MailOpen className="h-3 w-3" />
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
