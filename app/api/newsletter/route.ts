import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    const { email, name } = parsed.data;

    // Persist subscriber to database (upsert — won't fail if already subscribed)
    prisma.newsletterSubscriber
      .upsert({
        where: { email },
        update: { name: name ?? null, isActive: true },
        create: { email, name: name ?? null },
      })
      .catch((err: unknown) => console.error("[Newsletter API] DB write failed:", err));

    // If SMTP is configured, send a welcome email
    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.CONTACT_EMAIL_TO
    ) {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT ?? "587"),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });

      // Notify admin
      await transporter.sendMail({
        from: `"Fr. Yesudas Ministries" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL_TO,
        subject: "[Newsletter] New Subscriber",
        text: `New newsletter subscriber:\nName: ${name ?? "—"}\nEmail: ${email}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#1B2A4A;padding:20px;text-align:center;">
              <h2 style="color:#D4A853;margin:0;font-family:Georgia,serif;">Fr. Yesudas Ministries</h2>
              <p style="color:#fff;margin:4px 0 0;font-size:13px;">New Newsletter Subscriber</p>
            </div>
            <div style="padding:24px;background:#fff;border:1px solid #e8d9c4;">
              <p style="color:#333;"><strong>Name:</strong> ${name ?? "—"}</p>
              <p style="color:#333;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            </div>
          </div>`,
      });

      // Welcome email to subscriber
      await transporter.sendMail({
        from: `"Fr. Yesudas Ministries" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Welcome to the Fr. Yesudas Ministries Newsletter",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:#1B2A4A;padding:24px;text-align:center;">
              <h2 style="color:#D4A853;margin:0;font-family:Georgia,serif;">Fr. Yesudas Ministries</h2>
              <p style="color:#fff;margin:8px 0 0;font-size:14px;">Thank you for subscribing!</p>
            </div>
            <div style="padding:28px;background:#fff;border:1px solid #e8d9c4;">
              <p style="color:#1B2A4A;font-size:16px;">Dear ${name ?? "Friend"},</p>
              <p style="color:#555;line-height:1.7;">Thank you for joining our newsletter family. We will keep you updated with devotionals, ministry news, upcoming events, and testimonies of God's faithfulness.</p>
              <p style="color:#555;line-height:1.7;"><em>"He who began a good work in you will carry it on to completion until the day of Christ Jesus."</em> — Philippians 1:6</p>
              <p style="color:#555;">Blessings,<br/><strong>Fr. Yesudas Ministries</strong></p>
            </div>
            <div style="padding:12px;background:#FDF6EC;text-align:center;font-size:11px;color:#888;">
              You are receiving this because you subscribed at fryesudasministries.com
            </div>
          </div>`,
      });
    } else {
      console.log("[Newsletter] New subscriber:", { name, email });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Newsletter API] Error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
