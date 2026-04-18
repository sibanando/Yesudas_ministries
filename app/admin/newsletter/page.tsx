import { verifyAdminSession } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Download } from "lucide-react";
import { format } from "date-fns";

export default async function AdminNewsletterPage() {
  await verifyAdminSession();

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  const active = subscribers.filter((s) => s.isActive).length;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Newsletter Subscribers" />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500">
              {active} active · {subscribers.length} total
            </p>
            <a
              href="/api/admin/newsletter/export"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </a>
          </div>

          {subscribers.length === 0 ? (
            <p className="text-sm text-gray-400">No subscribers yet.</p>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Name</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Language</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Subscribed</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {subscribers.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{s.email}</td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{s.name ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-500 hidden lg:table-cell uppercase text-xs">{s.language}</td>
                      <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">
                        {format(new Date(s.subscribedAt), "dd MMM yyyy")}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${s.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
                          {s.isActive ? "Active" : "Unsubscribed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
