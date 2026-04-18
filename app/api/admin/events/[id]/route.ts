import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminSessionForApi } from "@/lib/dal";
import { churchEventSchema } from "@/lib/validations/admin";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const event = await prisma.churchEvent.findUnique({ where: { id } });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ event });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = churchEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const event = await prisma.churchEvent.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ event });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.churchEvent.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
