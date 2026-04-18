import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminSessionForApi } from "@/lib/dal";

export async function GET() {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [blogCount, eventCount, subscriberCount, unreadContacts, donationStats] =
    await Promise.all([
      prisma.blogPost.count({ where: { published: true } }),
      prisma.churchEvent.count(),
      prisma.newsletterSubscriber.count({ where: { isActive: true } }),
      prisma.contactSubmission.count({ where: { read: false } }),
      prisma.donation.aggregate({ _sum: { amount: true }, _count: true }),
    ]);

  return NextResponse.json({
    blogCount,
    eventCount,
    subscriberCount,
    unreadContacts,
    donationCount: donationStats._count,
    donationTotal: donationStats._sum.amount ?? 0,
  });
}
