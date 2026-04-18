import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminSessionForApi } from "@/lib/dal";
import { churchEventSchema } from "@/lib/validations/admin";

export async function GET() {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const events = await prisma.churchEvent.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = churchEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const event = await prisma.churchEvent.create({ data: parsed.data });
  return NextResponse.json({ event }, { status: 201 });
}
