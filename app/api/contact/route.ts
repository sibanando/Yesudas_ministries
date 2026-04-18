import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = parsed.data;

    // Send email via Nodemailer if SMTP is configured
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
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Fr. Yesudas Ministries Contact" <${process.env.SMTP_USER}>`,
        to: process.env.CONTACT_EMAIL_TO,
        replyTo: email,
        subject: `[Contact Form] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ""}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1B2A4A; padding: 20px; text-align: center;">
              <h2 style="color: #D4A853; margin: 0; font-family: Georgia, serif;">
                Fr. Yesudas Ministries
              </h2>
              <p style="color: #fff; margin: 4px 0 0; font-size: 13px;">New Contact Form Message</p>
            </div>
            <div style="padding: 24px; background: #fff; border: 1px solid #e8d9c4;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
                <tr>
                  <td style="padding: 6px 0; font-weight: 600; color: #1B2A4A; width: 100px;">Name:</td>
                  <td style="padding: 6px 0; color: #333;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-weight: 600; color: #1B2A4A;">Email:</td>
                  <td style="padding: 6px 0; color: #333;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                ${phone ? `<tr><td style="padding: 6px 0; font-weight: 600; color: #1B2A4A;">Phone:</td><td style="padding: 6px 0; color: #333;">${phone}</td></tr>` : ""}
                <tr>
                  <td style="padding: 6px 0; font-weight: 600; color: #1B2A4A;">Subject:</td>
                  <td style="padding: 6px 0; color: #333;">${subject}</td>
                </tr>
              </table>
              <div style="border-top: 1px solid #e8d9c4; padding-top: 16px;">
                <p style="font-weight: 600; color: #1B2A4A; margin-bottom: 8px;">Message:</p>
                <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            <div style="padding: 12px; background: #FDF6EC; text-align: center; font-size: 12px; color: #888;">
              Sent from the contact form at fryesudasministries.com
            </div>
          </div>
        `,
      });
    } else {
      // Log to console in development when SMTP is not configured
      console.log("[Contact Form] New submission:", {
        name,
        email,
        phone,
        subject,
        message,
      });
    }

    // Persist to database (non-blocking — don't fail the request if DB is down)
    prisma.contactSubmission
      .create({ data: { name, email, phone: phone ?? null, subject, message } })
      .catch((err: unknown) => console.error("[Contact API] DB write failed:", err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Contact API] Error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
