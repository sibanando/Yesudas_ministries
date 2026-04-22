"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Member { id: string; name: string; role: string; sortOrder: number; }

export default function AdminTeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/team")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((d) => setMembers(d.members ?? []))
      .catch(() => toast.error("Failed to load team members. Please refresh."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/team/${deleteId}`, { method: "DELETE" });
    setDeleting(false); setDeleteId(null);
    if (res.ok) { toast.success("Member removed."); setMembers((m) => m.filter((x) => x.id !== deleteId)); }
    else toast.error("Failed to delete.");
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Team Members" />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">{members.length} member{members.length !== 1 ? "s" : ""}</p>
            <Link href="/admin/team/new" className="flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white text-sm font-medium rounded-lg hover:bg-[#2a4070] transition-colors">
              <Plus className="h-4 w-4" /> Add Member
            </Link>
          </div>
          {loading ? <p className="text-sm text-gray-400">Loading…</p> : members.length === 0 ? <p className="text-sm text-gray-400">No team members yet.</p> : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Order</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{m.name}</td>
                      <td className="px-4 py-3 text-gray-500">{m.role}</td>
                      <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{m.sortOrder}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <Link href={`/admin/team/${m.id}`} className="p-1.5 text-gray-400 hover:text-[#1B2A4A] transition-colors"><Pencil className="h-4 w-4" /></Link>
                          <button onClick={() => setDeleteId(m.id)} disabled={deleting} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-40"><Trash2 className="h-4 w-4" /></button>
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
      <ConfirmDialog open={Boolean(deleteId)} onOpenChange={(open) => !open && setDeleteId(null)} title="Remove Team Member" description="This will permanently remove this team member." onConfirm={handleDelete} loading={deleting} />
    </div>
  );
}
