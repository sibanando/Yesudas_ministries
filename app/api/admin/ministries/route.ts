import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminSessionForApi } from "@/lib/dal";
import { ministrySchema } from "@/lib/validations/admin";

export async function GET() {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ministries = await prisma.ministry.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json({ ministries });
}

export async function POST(req: NextRequest) {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = ministrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const ministry = await prisma.ministry.create({ data: parsed.data });
  return NextResponse.json({ ministry }, { status: 201 });
}
