import { headers } from "next/headers";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; 
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string) {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  if (record && now > record.resetTime) rateLimitStore.delete(ip);
  const existing = rateLimitStore.get(ip);
  if (!existing) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }
  if (existing.count >= RATE_LIMIT_MAX) return { allowed: false };
  existing.count++;
  return { allowed: true };
}

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "unknown";

    if (!checkRateLimit(ip).allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const { name, email, idea, budget, timeline } = body;

    if (!name || !email || !idea) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 },
      );
    }

    try {
      const { getFirestore } = await import("firebase-admin/firestore");
      const { initializeApp, getApps, cert } =
        await import("firebase-admin/app");

      if (!getApps().length) {
        const key = Buffer.from(
          process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY!,
          "base64",
        ).toString("utf-8");
        initializeApp({ credential: cert(JSON.parse(key)) });
      }

      const db = getFirestore();
      await db.collection("pitches").add({
        name,
        email,
        idea,
        budget,
        timeline,
        status: "new",
        submittedAt: new Date().toISOString(),
        ip,
      });
    } catch (fbErr) {
      console.warn("[pitch] Firebase fail:", fbErr);
    }

    if (
      process.env.NEXT_PUBLIC_GMAIL_USER &&
      process.env.NEXT_PUBLIC_GMAIL_PASS
    ) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.NEXT_PUBLIC_GMAIL_USER,
          pass: process.env.NEXT_PUBLIC_GMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Portfolio Pitch" <${process.env.NEXT_PUBLIC_GMAIL_USER}>`,
        to: "amit98ch@gmail.com",
        subject: `New Pitch Idea from ${name}`,
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h2>New Pitch Idea</h2>
            <p><b>Name:</b> ${name}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Budget:</b> ${budget || "N/A"}</p>
            <p><b>Timeline:</b> ${timeline || "N/A"}</p>
            <div style="padding: 20px; background: #f5f5f5; border-left: 4px solid #C9A84C;">
              <p><b>Idea:</b></p>
              <p style="white-space: pre-wrap;">${idea}</p>
            </div>
          </div>
        `,
      });

      await transporter.sendMail({
        from: `"Amit Chakraborty" <${process.env.NEXT_PUBLIC_GMAIL_USER}>`,
        to: email,
        subject: "Thanks for sharing your idea!",
        html: `<p>Hi ${name.split(" ")[0]},</p><p>Thanks for pitching your idea! I've received it and will review it soon. I'll get back to you within 48 hours.</p><p>Best,<br/>Amit</p>`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[pitch] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}