import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminSessionForApi } from "@/lib/dal";
import { serviceTimeSchema } from "@/lib/validations/admin";
import { revalidateTag } from "next/cache";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = serviceTimeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const serviceTime = await prisma.serviceTime.update({ where: { id }, data: parsed.data });
  revalidateTag("service-times", { expire: 0 });
  return NextResponse.json({ serviceTime });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.serviceTime.delete({ where: { id } });
  revalidateTag("service-times", { expire: 0 });
  return NextResponse.json({ success: true });
}
