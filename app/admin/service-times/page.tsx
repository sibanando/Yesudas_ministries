"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

interface ServiceTime {
  id: string;
  day: string;
  time: string;
  label: string;
  sortOrder: number;
}

const EMPTY_FORM = { day: "", time: "", label: "", sortOrder: 0 };

export default function AdminServiceTimesPage() {
  const [items, setItems] = useState<ServiceTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/service-times")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d) => setItems(d.serviceTimes ?? []))
      .catch(() => toast.error("Failed to load service times."))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!addForm.day || !addForm.time || !addForm.label) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/service-times", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...addForm, sortOrder: Number(addForm.sortOrder) }),
    });
    setSaving(false);
    if (res.ok) {
      const { serviceTime } = await res.json();
      setItems((prev) => [...prev, serviceTime].sort((a, b) => a.sortOrder - b.sortOrder));
      setAddForm(EMPTY_FORM);
      setShowAdd(false);
      toast.success("Service time added.");
    } else {
      toast.error("Failed to add service time.");
    }
  };

  const startEdit = (item: ServiceTime) => {
    setEditingId(item.id);
    setEditForm({ day: item.day, time: item.time, label: item.label, sortOrder: item.sortOrder });
  };

  const handleEdit = async () => {
    if (!editingId) return;
    if (!editForm.day || !editForm.time || !editForm.label) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSaving(true);
    const res = await fetch(`/api/admin/service-times/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editForm, sortOrder: Number(editForm.sortOrder) }),
    });
    setSaving(false);
    if (res.ok) {
      const { serviceTime } = await res.json();
      setItems((prev) =>
        prev.map((x) => (x.id === editingId ? serviceTime : x)).sort((a, b) => a.sortOrder - b.sortOrder)
      );
      setEditingId(null);
      toast.success("Service time updated.");
    } else {
      toast.error("Failed to update service time.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/service-times/${deleteId}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteId(null);
    if (res.ok) {
      setItems((prev) => prev.filter((x) => x.id !== deleteId));
      toast.success("Service time deleted.");
    } else {
      toast.error("Failed to delete service time.");
    }
  };

  const inputCls =
    "w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A4A]";

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Service Times" />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{items.length} service time{items.length !== 1 ? "s" : ""}</p>
            {!showAdd && (
              <button
                onClick={() => { setShowAdd(true); setEditingId(null); }}
                className="flex items-center gap-2 px-4 py-2 bg-[#1B2A4A] text-white text-sm font-medium rounded-lg hover:bg-[#2a4070] transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Service Time
              </button>
            )}
          </div>

          {showAdd && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
              <p className="text-sm font-semibold text-[#1B2A4A] mb-3">New Service Time</p>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  placeholder="Day (e.g. Sunday)"
                  value={addForm.day}
                  onChange={(e) => setAddForm((f) => ({ ...f, day: e.target.value }))}
                  className={inputCls}
                />
                <input
                  placeholder="Time (e.g. 9:00 AM – 11:00 AM)"
                  value={addForm.time}
                  onChange={(e) => setAddForm((f) => ({ ...f, time: e.target.value }))}
                  className={inputCls}
                />
                <input
                  placeholder="Label (e.g. Main Worship Service)"
                  value={addForm.label}
                  onChange={(e) => setAddForm((f) => ({ ...f, label: e.target.value }))}
                  className={inputCls}
                />
                <input
                  type="number"
                  placeholder="Sort order"
                  value={addForm.sortOrder}
                  onChange={(e) => setAddForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                  className={inputCls}
                />
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={handleAdd}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1B2A4A] text-white text-sm rounded-lg hover:bg-[#2a4070] disabled:opacity-40 transition-colors"
                >
                  <Check className="h-4 w-4" /> Save
                </button>
                <button
                  onClick={() => { setShowAdd(false); setAddForm(EMPTY_FORM); }}
                  className="flex items-center gap-1.5 px-4 py-1.5 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="h-4 w-4" /> Cancel
                </button>
              </div>
            </div>
          )}

          {loading ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-gray-400">No service times yet. Add one above.</p>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Day</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Time</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Label</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell w-20">Order</th>
                    <th className="px-4 py-3 w-24" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) =>
                    editingId === item.id ? (
                      <tr key={item.id} className="bg-blue-50">
                        <td className="px-4 py-2">
                          <input
                            value={editForm.day}
                            onChange={(e) => setEditForm((f) => ({ ...f, day: e.target.value }))}
                            className={inputCls}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            value={editForm.time}
                            onChange={(e) => setEditForm((f) => ({ ...f, time: e.target.value }))}
                            className={inputCls}
                          />
                        </td>
                        <td className="px-4 py-2 hidden md:table-cell">
                          <input
                            value={editForm.label}
                            onChange={(e) => setEditForm((f) => ({ ...f, label: e.target.value }))}
                            className={inputCls}
                          />
                        </td>
                        <td className="px-4 py-2 hidden lg:table-cell">
                          <input
                            type="number"
                            value={editForm.sortOrder}
                            onChange={(e) => setEditForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                            className={inputCls}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={handleEdit}
                              disabled={saving}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded disabled:opacity-40 transition-colors"
                              title="Save"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 text-gray-400 hover:bg-gray-100 rounded transition-colors"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{item.day}</td>
                        <td className="px-4 py-3 text-gray-500">{item.time}</td>
                        <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{item.label}</td>
                        <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">{item.sortOrder}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => startEdit(item)}
                              className="p-1.5 text-gray-400 hover:text-[#1B2A4A] transition-colors"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteId(item.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
      <ConfirmDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Service Time"
        description="This will permanently delete this service time."
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
