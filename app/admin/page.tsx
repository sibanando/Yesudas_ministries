import { verifyAdminSession } from "@/lib/dal";
import { prisma } from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { FileText, Calendar, Mail, MessageSquare, Heart, Users, Video } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default async function AdminDashboard() {
  await verifyAdminSession();

  const [blogCount, sermonCount, eventCount, subscriberCount, unreadContacts, donationStats, recentDonations] =
    await Promise.all([
      prisma.blogPost.count({ where: { published: true } }),
      prisma.sermon.count({ where: { published: true } }),
      prisma.churchEvent.count(),
      prisma.newsletterSubscriber.count({ where: { isActive: true } }),
      prisma.contactSubmission.count({ where: { read: false } }),
      prisma.donation.aggregate({ _sum: { amount: true }, _count: true }),
      prisma.donation.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  const totalINR = await prisma.donation.aggregate({
    where: { currency: "INR" },
    _sum: { amount: true },
  });
  const totalUSD = await prisma.donation.aggregate({
    where: { currency: "USD" },
    _sum: { amount: true },
  });

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Dashboard" />
        <main className="flex-1 p-6 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
            <StatsCard title="Blog Posts" value={blogCount} icon={FileText} />
            <StatsCard title="Sermons" value={sermonCount} icon={Video} />
            <StatsCard title="Events" value={eventCount} icon={Calendar} />
            <StatsCard title="Subscribers" value={subscriberCount} icon={Mail} />
            <StatsCard title="Unread Messages" value={unreadContacts} icon={MessageSquare} description="Contact submissions" />
            <StatsCard title="Total Donations" value={donationStats._count} icon={Heart} />
            <StatsCard title="INR Raised" value={`₹${((totalINR._sum.amount ?? 0) / 100).toLocaleString()}`} icon={Users} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Donations */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-[#1B2A4A]">Recent Donations</h2>
                <Link href="/admin/donations" className="text-xs text-[#D4A853] hover:underline">View all</Link>
              </div>
              {recentDonations.length === 0 ? (
                <p className="text-sm text-gray-400">No donations yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {recentDonations.map((d) => (
                    <div key={d.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-gray-800">{d.donorName ?? "Anonymous"}</p>
                        <p className="text-xs text-gray-400">{d.cause} · {d.gateway}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#1B2A4A]">
                          {d.currency === "INR" ? "₹" : "$"}{(d.amount / 100).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {format(new Date(d.createdAt), "dd MMM yyyy")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-heading font-bold text-[#1B2A4A] mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { href: "/admin/blog/new", label: "New Blog Post", icon: FileText },
                  { href: "/admin/sermons/new", label: "New Sermon", icon: Video },
                  { href: "/admin/events/new", label: "New Event", icon: Calendar },
                  { href: "/admin/contacts", label: `${unreadContacts} Unread Messages`, icon: MessageSquare },
                  { href: "/admin/newsletter", label: `${subscriberCount} Subscribers`, icon: Mail },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#1B2A4A]/30 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                  >
                    <item.icon className="h-4 w-4 text-[#D4A853]" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
