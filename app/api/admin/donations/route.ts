import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminSessionForApi } from "@/lib/dal";

export async function GET() {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [donations, totals] = await Promise.all([
    prisma.donation.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.donation.groupBy({
      by: ["currency"],
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  return NextResponse.json({ donations, totals });
}
