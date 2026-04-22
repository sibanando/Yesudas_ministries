"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

interface SermonRow {
  id: string;
  videoId: string;
  title: string;
  publishedAt: string;
  series: string | null;
  published: boolean;
  sortOrder: number;
}

export default function AdminSermonsPage() {
  const router = useRouter();
  const [sermons, setSermons] = useState<SermonRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/sermons")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.json();
      })
      .then((d) => setSermons(d.sermons ?? []))
      .catch(() => toast.error("Failed to load sermons. Please refresh."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/sermons/${deleteId}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteId(null);
    if (res.ok) {
      toast.success("Sermon deleted.");
      setSermons((s) => s.filter((x) => x.id !== deleteId));
    } else {
      toast.error("Failed to delete sermon.");
    }
  };

  const filtered = sermons.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.series ?? "").toLowerCase().includes(search.toLowerCase()) ||
      s.videoId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Sermons" />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <p className="text-sm text-gray-500">{sermons.length} sermon{sermons.length !== 1 ? "s" : ""}</p>
            <div className="flex items-center gap-3 flex-1 justify-end">
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search sermons…"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]"
                />
              </div>
              <Link
                href="/admin/sermons/new"
                className="flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white text-sm font-medium rounded-lg hover:bg-[#2a4070] transition-colors whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                New Sermon
              </Link>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-gray-400">{search ? "No sermons match your search." : "No sermons yet."}</p>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Series</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((sermon) => (
                    <tr key={sermon.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 truncate max-w-xs">{sermon.title}</p>
                        <p className="text-xs text-gray-400 truncate">{sermon.videoId}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {sermon.series ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-[#1B2A4A]/10 text-[#1B2A4A]">
                            {sermon.series}
                          </span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                        {new Date(sermon.publishedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${sermon.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {sermon.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <Link href={`/admin/sermons/${sermon.id}`} className="p-1.5 text-gray-400 hover:text-[#1B2A4A] transition-colors">
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteId(sermon.id)}
                            disabled={deleting}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-40"
                          >
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
        title="Delete Sermon"
        description="This will permanently delete the sermon. This action cannot be undone."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
