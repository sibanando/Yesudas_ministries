"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Ministry { id: string; name: string; leader: string; schedule: string; }

export default function AdminMinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/ministries").then((r) => r.json()).then((d) => setMinistries(d.ministries ?? [])).finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/ministries/${deleteId}`, { method: "DELETE" });
    setDeleting(false); setDeleteId(null);
    if (res.ok) { toast.success("Ministry deleted."); setMinistries((m) => m.filter((x) => x.id !== deleteId)); }
    else toast.error("Failed to delete.");
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Ministries" />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">{ministries.length} ministr{ministries.length !== 1 ? "ies" : "y"}</p>
            <Link href="/admin/ministries/new" className="flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white text-sm font-medium rounded-lg hover:bg-[#2a4070] transition-colors">
              <Plus className="h-4 w-4" /> New Ministry
            </Link>
          </div>
          {loading ? <p className="text-sm text-gray-400">Loading…</p> : ministries.length === 0 ? <p className="text-sm text-gray-400">No ministries yet.</p> : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Leader</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Schedule</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ministries.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{m.name}</td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{m.leader}</td>
                      <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{m.schedule}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <Link href={`/admin/ministries/${m.id}`} className="p-1.5 text-gray-400 hover:text-[#1B2A4A] transition-colors"><Pencil className="h-4 w-4" /></Link>
                          <button onClick={() => setDeleteId(m.id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
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
      <ConfirmDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)} title="Delete Ministry" description="This will permanently delete the ministry." onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
