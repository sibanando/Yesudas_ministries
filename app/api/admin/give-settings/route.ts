import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAdminSessionForApi } from "@/lib/dal";
import { giveSettingsSchema } from "@/lib/validations/admin";
import { revalidateTag } from "next/cache";

const GIVE_KEYS = [
  "give_preset_amounts_inr",
  "give_preset_amounts_usd",
  "give_causes",
  "give_enable_razorpay",
  "give_enable_stripe",
  "give_enable_upi",
  "give_upi_id",
  "give_bank_account_name",
  "give_bank_account_number",
  "give_bank_ifsc",
  "give_bank_name",
];

export async function GET() {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await prisma.siteSettings.findMany({ where: { key: { in: GIVE_KEYS } } });
  const settings = Object.fromEntries(rows.map((r: any) => [r.key, r.value]));
  return NextResponse.json({ settings });
}

export async function PUT(req: NextRequest) {
  const session = await verifyAdminSessionForApi();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = giveSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await Promise.all(
    Object.entries(parsed.data).map(([key, value]) =>
      prisma.siteSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );

  revalidateTag("give-settings", { expire: 0 });
  return NextResponse.json({ success: true });
}
