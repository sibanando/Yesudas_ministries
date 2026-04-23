import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminSessionForApi } from "@/lib/dal";
import { serviceTimeSchema } from "@/lib/validations/admin";
import { revalidateTag } from "next/cache";

export async function GET() {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const serviceTimes = await prisma.serviceTime.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ serviceTimes });
}

export async function POST(req: NextRequest) {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = serviceTimeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const serviceTime = await prisma.serviceTime.create({ data: parsed.data });
  revalidateTag("service-times", { expire: 0 });
  return NextResponse.json({ serviceTime }, { status: 201 });
}
