import { verifyAdminSession } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { format } from "date-fns";

export default async function AdminDonationsPage() {
  await verifyAdminSession();

  const [donations, inrTotal, usdTotal] = await Promise.all([
    prisma.donation.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.donation.aggregate({ where: { currency: "INR" }, _sum: { amount: true }, _count: true }),
    prisma.donation.aggregate({ where: { currency: "USD" }, _sum: { amount: true }, _count: true }),
  ]);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Donations" />
        <main className="flex-1 p-6">
          {/* Totals */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-1">INR Total ({inrTotal._count} donations)</p>
              <p className="font-heading text-2xl font-bold text-[#1B2A4A]">
                ₹{((inrTotal._sum.amount ?? 0) / 100).toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm text-gray-500 mb-1">USD Total ({usdTotal._count} donations)</p>
              <p className="font-heading text-2xl font-bold text-[#1B2A4A]">
                ${((usdTotal._sum.amount ?? 0) / 100).toLocaleString()}
              </p>
            </div>
          </div>

          {donations.length === 0 ? (
            <p className="text-sm text-gray-400">No donations recorded yet.</p>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Donor</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Cause</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Gateway</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Date</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {donations.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{d.donorName ?? "Anonymous"}</p>
                        {d.donorEmail && <p className="text-xs text-gray-400">{d.donorEmail}</p>}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#1B2A4A]">
                        {d.currency === "INR" ? "₹" : "$"}{(d.amount / 100).toLocaleString()}
                        {d.frequency === "monthly" && (
                          <span className="ml-1 text-xs text-[#D4A853]">/mo</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell capitalize">{d.cause}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-[#1B2A4A]/10 text-[#1B2A4A] capitalize">
                          {d.gateway}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">
                        {format(new Date(d.createdAt), "dd MMM yyyy")}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${d.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {d.status}
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
