import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminSessionForApi } from "@/lib/dal";
import { sermonSchema } from "@/lib/validations/admin";

export async function GET() {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sermons = await prisma.sermon.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      videoId: true,
      title: true,
      publishedAt: true,
      series: true,
      published: true,
      sortOrder: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ sermons });
}

export async function POST(req: NextRequest) {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = sermonSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.sermon.findUnique({ where: { videoId: parsed.data.videoId } });
  if (existing) {
    return NextResponse.json({ error: "A sermon with this video ID already exists." }, { status: 409 });
  }

  const data = {
    ...parsed.data,
    duration: parsed.data.duration || null,
    series: parsed.data.series || null,
    viewCount: parsed.data.viewCount || null,
  };

  const sermon = await prisma.sermon.create({ data });
  return NextResponse.json({ sermon }, { status: 201 });
}
