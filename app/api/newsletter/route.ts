import { headers } from "next/headers";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; 
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string) {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  if (record && now > record.resetTime) rateLimitStore.delete(ip);
  const existing = rateLimitStore.get(ip);
  if (!existing) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }
  if (existing.count >= RATE_LIMIT_MAX) return { allowed: false, remaining: 0 };
  existing.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - existing.count };
}

export async function POST(req: Request) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "unknown";

    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many signups. Try again later." },
        { status: 429 },
      );
    }

    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
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
      await db.collection("newsletter").add({
        email,
        subscribedAt: new Date().toISOString(),
        ip,
      });
    } catch (fbErr) {
      console.warn("[newsletter] Firebase fail:", fbErr);
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
        from: `"Portfolio Newsletter" <${process.env.NEXT_PUBLIC_GMAIL_USER}>`,
        to: "amit98ch@gmail.com",
        subject: `New Newsletter Subscriber: ${email}`,
        html: `<p>New subscriber: <b>${email}</b></p><p>IP: ${ip}</p>`,
      });

      await transporter.sendMail({
        from: `"Amit Chakraborty" <${process.env.NEXT_PUBLIC_GMAIL_USER}>`,
        to: email,
        subject: "Welcome to my newsletter!",
        html: `<p>Hi there,</p><p>Thanks for subscribing to my newsletter. I'll share architecture insights and engineering essays occasionally.</p><p>Best,<br/>Amit</p>`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[newsletter] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}