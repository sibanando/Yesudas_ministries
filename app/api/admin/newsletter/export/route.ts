import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminSessionForApi } from "@/lib/dal";

export async function GET() {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: { isActive: true },
    orderBy: { subscribedAt: "desc" },
  });

  const rows = [
    ["Email", "Name", "Language", "Subscribed At"].join(","),
    ...subscribers.map((s: { email: string; name: string | null; language: string; subscribedAt: Date }) =>
      [
        `"${s.email}"`,
        `"${s.name ?? ""}"`,
        `"${s.language}"`,
        `"${s.subscribedAt.toISOString()}"`,
      ].join(",")
    ),
  ].join("\n");

  return new NextResponse(rows, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="newsletter-subscribers.csv"',
    },
  });
}
