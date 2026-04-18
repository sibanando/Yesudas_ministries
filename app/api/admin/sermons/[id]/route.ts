import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminSessionForApi } from "@/lib/dal";
import { sermonSchema } from "@/lib/validations/admin";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const sermon = await prisma.sermon.findUnique({ where: { id } });
  if (!sermon) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ sermon });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = sermonSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = {
    ...parsed.data,
    duration: parsed.data.duration || null,
    series: parsed.data.series || null,
    viewCount: parsed.data.viewCount || null,
  };

  const sermon = await prisma.sermon.update({ where: { id }, data });
  return NextResponse.json({ sermon });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.sermon.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
