import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminSessionForApi } from "@/lib/dal";

export async function GET() {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ submissions });
}
