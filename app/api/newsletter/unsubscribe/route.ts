import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    await prisma.newsletterSubscriber.updateMany({
      where: { email: parsed.data.email },
      data: { isActive: false, unsubscribedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Newsletter Unsubscribe] Error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
