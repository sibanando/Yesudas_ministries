import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminSessionForApi } from "@/lib/dal";
import { ministrySchema } from "@/lib/validations/admin";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const ministry = await prisma.ministry.findUnique({ where: { id } });
  if (!ministry) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ministry });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = ministrySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const ministry = await prisma.ministry.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ ministry });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.ministry.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
