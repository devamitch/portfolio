import { headers } from "next/headers";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; 
const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const MAX_FILES = 3;
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const rateLimitStore = new Map<
  string,
  { count: number; resetTime: number; blocked: boolean }
>();

function checkRateLimit(ip: string) {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (record && now > record.resetTime) {
    rateLimitStore.delete(ip);
  }

  const existing = rateLimitStore.get(ip);

  if (existing?.blocked) {
    return { allowed: false, remaining: 0, blocked: true };
  }

  if (!existing) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
      blocked: false,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, blocked: false };
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    existing.blocked = true;
    return { allowed: false, remaining: 0, blocked: true };
  }

  existing.count++;
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX - existing.count,
    blocked: false,
  };
}

function sanitizeInput(input: string, maxLength = 5000) {
  return input
    .trim()
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/\0/g, "")
    .substring(0, maxLength);
}

function validateEmail(email: string) {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email) || email.length > 254) return false;

  const disposable = [
    "tempmail.com",
    "10minutemail.com",
    "guerrillamail.com",
    "mailinator.com",
    "throwaway.email",
    "temp-mail.org",
  ];

  const domain = email.split("@")[1]?.toLowerCase();
  return !disposable.includes(domain);
}

function detectSpam(
  name: string,
  email: string,
  message: string,
  company?: string,
) {
  let score = 0;
  const reasons: string[] = [];

  const spamKeywords = [
    { words: ["viagra", "casino", "lottery", "prize"], weight: 10 },
    { words: ["click here", "act now", "limited time"], weight: 5 },
    { words: ["free money", "earn money", "make money fast"], weight: 8 },
    { words: ["crypto investment", "bitcoin investment"], weight: 6 },
  ];

  const text = `${name} ${email} ${message} ${company || ""}`.toLowerCase();

  for (const { words, weight } of spamKeywords) {
    for (const word of words) {
      if (text.includes(word)) {
        score += weight;
        reasons.push(word);
      }
    }
  }

  const links = (message.match(/https?:\/\
  if (links > 3) score += links * 2;

  if (message.length < 10) score += 4;

  return { isSpam: score >= 15, score, reason: reasons.join(", ") };
}

function validateFile(file: { name: string; type: string; size: number }) {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { valid: false, error: `File type not allowed: ${file.type}` };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File too large. Max 5MB.` };
  }

  const suspicious = [
    /\.exe$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.sh$/i,
    /\.php$/i,
    /\.js$/i,
    /\.jar$/i,
  ];

  if (suspicious.some((p) => p.test(file.name))) {
    return { valid: false, error: "Suspicious file extension" };
  }

  return { valid: true };
}

function generateAdminEmailHTML(
  name: string,
  email: string,
  message: string,
  subject: string,
  company: string,
  role: string,
  timestamp: string,
) {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#060606;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;">
  <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width:660px;margin:40px auto;">
    <tr><td style="padding:0 20px;">
      <table width="100%" style="background:#0D0D0D;border-top:3px solid #C9A84C;border-radius:12px 12px 0 0;">
        <tr><td style="padding:40px;">
          <div style="display:inline-block;font-size:22px;font-weight:900;color:#fff;letter-spacing:-0.04em;margin-bottom:8px;">
            <span style="color:#C9A84C">A</span>C<span style="color:rgba(201,168,76,0.5)">.</span>
          </div>
          <h1 style="margin:0;font-size:28px;font-weight:900;color:#fff;letter-spacing:-0.03em;">New Contact Message</h1>
          <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.45);font-family:monospace;letter-spacing:0.1em;">PORTFOLIO · devamit.co.in</p>
          <div style="margin-top:20px;display:inline-block;padding:8px 16px;border:1px solid rgba(201,168,76,0.3);background:rgba(201,168,76,0.08);">
            <span style="font-size:11px;color:#C9A84C;font-family:monospace;letter-spacing:0.2em;">⏱ ${timestamp}</span>
          </div>
        </td></tr>
      </table>

      <table width="100%" style="background:#fff;">
        <tr><td style="padding:36px 40px;">
          <table width="100%" style="background:#f8f8f6;border-left:3px solid #C9A84C;padding:28px;">
            <tr><td style="padding:28px;">
              <p style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.3em;font-family:monospace;margin:0 0 6px;">From</p>
              <p style="font-size:24px;font-weight:900;color:#111;margin:0 0 20px;">${name}</p>
              <p style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.3em;font-family:monospace;margin:0 0 6px;">Email</p>
              <a href="mailto:${email}" style="font-size:15px;color:#C9A84C;font-weight:600;text-decoration:none;display:inline-block;padding:8px 14px;background:rgba(201,168,76,0.1);margin-bottom:20px;">${email}</a>
              ${company ? `<p style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.3em;font-family:monospace;margin:0 0 6px;">Company</p><p style="font-size:15px;color:#333;font-weight:600;margin:0 0 20px;">${company}</p>` : ""}
              ${role ? `<p style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.3em;font-family:monospace;margin:0 0 6px;">Role</p><p style="font-size:15px;color:#333;font-weight:600;margin:0 0 20px;">${role}</p>` : ""}
              <p style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.3em;font-family:monospace;margin:0 0 6px;">Subject</p>
              <p style="font-size:15px;color:#333;font-weight:600;margin:0;">${subject || "General Inquiry"}</p>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 40px 36px;">
          <p style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:0.3em;font-family:monospace;margin:0 0 12px;">Message</p>
          <div style="border:1px solid #e8e8e5;padding:24px;font-size:14px;line-height:1.8;color:#333;white-space:pre-wrap;">${message}</div>
          <div style="margin-top:28px;text-align:center;">
            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || "Your message to Amit")}" 
               style="display:inline-block;padding:16px 36px;background:linear-gradient(135deg,#DAA520,#F5C842,#B8860B);color:#000;font-size:11px;font-weight:800;letter-spacing:0.25em;text-transform:uppercase;text-decoration:none;">
              Reply to ${name.split(" ")[0]} →
            </a>
          </div>
        </td></tr>
      </table>

      <table width="100%" style="background:#0D0D0D;border-radius:0 0 12px 12px;border-top:1px solid rgba(255,255,255,0.06);">
        <tr><td style="padding:24px 40px;text-align:center;">
          <p style="font-size:11px;color:rgba(255,255,255,0.28);font-family:monospace;margin:0;">
            devamit.co.in · Portfolio Contact System · © ${new Date().getFullYear()} Amit Chakraborty
          </p>
        </td></tr>
      </table>

    </td></tr>
  </table>
</body>
</html>`;
}

function generateThankYouEmailHTML(name: string) {
  const firstName = name.split(" ")[0];
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#060606;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;">
  <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width:620px;margin:40px auto;">
    <tr><td style="padding:0 20px;">
      <table width="100%" style="background:#0D0D0D;border-top:3px solid #C9A84C;border-radius:12px 12px 0 0;">
        <tr><td style="padding:48px 48px 36px;text-align:center;">
          <div style="font-size:26px;font-weight:900;color:#fff;letter-spacing:-0.04em;margin-bottom:24px;">
            <span style="color:#C9A84C">A</span>C<span style="color:rgba(201,168,76,0.5)">.</span>
          </div>
          <h1 style="margin:0;font-size:30px;font-weight:900;color:#fff;letter-spacing:-0.03em;line-height:1.1;">
            Got your message,<br/><span style="color:#C9A84C">${firstName}.</span>
          </h1>
        </td></tr>
      </table>

      <table width="100%" style="background:#fff;">
        <tr><td style="padding:40px 48px;">
          <p style="font-size:16px;color:#222;line-height:1.75;margin:0 0 20px;font-weight:400;">
            Thanks for reaching out through my portfolio.
          </p>
          <p style="font-size:15px;color:#555;line-height:1.75;margin:0 0 24px;font-weight:300;">
            I read every message personally — no auto-responders, no templated replies. I'll get back to you within <strong style="color:#111">24 hours</strong>, usually sooner.
          </p>
          <div style="padding:20px 24px;border-left:3px solid #C9A84C;background:#f8f8f6;margin:28px 0;">
            <p style="font-size:14px;color:#444;line-height:1.7;margin:0;font-style:italic;">
              "I architect systems that outlast the hype. If we're a good fit, I want to know — and I'll make sure you do too."
            </p>
            <p style="font-size:11px;color:#999;margin:10px 0 0;font-family:monospace;letter-spacing:0.1em;">— Amit Chakraborty</p>
          </div>
          <p style="font-size:14px;color:#777;line-height:1.7;margin:0 0 32px;font-weight:300;">
            In the meantime, feel free to check out my work at <a href="https://devamit.co.in" style="color:#C9A84C;text-decoration:none;font-weight:600;">devamit.co.in</a> or connect on <a href="https://www.linkedin.com/in/devamitch/" style="color:#C9A84C;text-decoration:none;font-weight:600;">LinkedIn</a>.
          </p>
          <div style="text-align:center;">
            <a href="https://devamit.co.in" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#DAA520,#F5C842,#B8860B);color:#000;font-size:11px;font-weight:800;letter-spacing:0.25em;text-transform:uppercase;text-decoration:none;">
              View Portfolio →
            </a>
          </div>
        </td></tr>
      </table>

      <table width="100%" style="background:#0D0D0D;border-radius:0 0 12px 12px;border-top:1px solid rgba(255,255,255,0.06);">
        <tr><td style="padding:28px 48px;">
          <p style="font-size:12px;color:rgba(255,255,255,0.3);font-family:monospace;margin:0 0 8px;text-align:center;">
            Amit Chakraborty · Principal Mobile Architect · VP Engineering
          </p>
          <p style="font-size:11px;color:rgba(255,255,255,0.18);font-family:monospace;margin:0;text-align:center;">
            Kolkata, India · Remote Worldwide · devamit.co.in
          </p>
        </td></tr>
      </table>

    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    const headersList = await headers();
    const ip =
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";

    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: rateLimit.blocked
            ? "Your IP has been temporarily blocked. Please try again in 1 hour."
            : "Too many requests. Please wait.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": RATE_LIMIT_MAX.toString(),
            "X-RateLimit-Remaining": "0",
            "Retry-After": "3600",
          },
        },
      );
    }

    const body = await req.json();
    const { name, email, message, subject, company, role, files } = body;

    if (!name || !email || !message) {
      console.error("❌ Missing required fields");
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 },
      );
    }

    const sName = sanitizeInput(name, 100);
    const sEmail = sanitizeInput(email, 254);
    const sMessage = sanitizeInput(message, 5000);
    const sSubject = subject ? sanitizeInput(subject, 200) : "";
    const sCompany = company ? sanitizeInput(company, 150) : "";
    const sRole = role ? sanitizeInput(role, 100) : "";

    if (!validateEmail(sEmail)) {
      console.error("❌ Invalid email:", sEmail);
      return NextResponse.json(
        { error: "Invalid or disposable email address" },
        { status: 400 },
      );
    }

    if (sMessage.length < 10) {
      console.error("❌ Message too short");
      return NextResponse.json({ error: "Message too short" }, { status: 400 });
    }

    const spam = detectSpam(sName, sEmail, sMessage, sCompany);
    if (spam.isSpam) {
      console.warn(`⚠️ SPAM detected: ${sEmail} — score ${spam.score}`);
      return NextResponse.json(
        {
          error:
            "Message flagged as spam. Contact amit98ch@gmail.com directly.",
        },
        { status: 400 },
      );
    }

    const validatedFiles: Array<{
      filename: string;
      size: number;
      data: string;
    }> = [];

    if (files && Array.isArray(files)) {
      if (files.length > MAX_FILES) {
        console.error("❌ Too many files:", files.length);
        return NextResponse.json(
          { error: `Max ${MAX_FILES} files allowed` },
          { status: 400 },
        );
      }

      for (const f of files) {
        const v = validateFile(f);
        if (!v.valid) {
          console.error("❌ Invalid file:", f.name, v.error);
          return NextResponse.json({ error: v.error }, { status: 400 });
        }
        validatedFiles.push({
          filename: sanitizeInput(f.name, 255),
          size: f.size,
          data: f.data,
        });
      }
    }

    if (
      !process.env.NEXT_PUBLIC_GMAIL_USER ||
      !process.env.NEXT_PUBLIC_GMAIL_PASS
    ) {
      console.error("❌ Gmail credentials not configured");
      return NextResponse.json(
        {
          error: "Email service not configured. Please contact administrator.",
        },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NEXT_PUBLIC_GMAIL_USER,
        pass: process.env.NEXT_PUBLIC_GMAIL_PASS,
      },
    });

    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error("❌ Email verification failed:", verifyError);
      throw new Error(
        "Email configuration invalid. Check NEXT_PUBLIC_GMAIL_USER and NEXT_PUBLIC_GMAIL_PASS.",
      );
    }

    const timestamp = new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });

    const attachments = validatedFiles.map((f) => ({
      filename: f.filename,
      content: f.data.split(",")[1],
      encoding: "base64" as const,
    }));

    try {
      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.NEXT_PUBLIC_GMAIL_USER}>`,
        to: "amit98ch@gmail.com",
        replyTo: sEmail,
        subject:
          sSubject ||
          `New Contact: ${sName}${sCompany ? ` (${sCompany})` : ""}`,
        html: generateAdminEmailHTML(
          sName,
          sEmail,
          sMessage,
          sSubject,
          sCompany,
          sRole,
          timestamp,
        ),
        attachments: attachments.length > 0 ? attachments : undefined,
      });
    } catch (emailError) {
      console.error("❌ Failed to send admin email:", emailError);
      throw new Error("Failed to send notification email");
    }

    try {
      await transporter.sendMail({
        from: `"Amit Chakraborty" <${process.env.NEXT_PUBLIC_GMAIL_USER}>`,
        to: sEmail,
        subject: `Got your message — Amit Chakraborty`,
        html: generateThankYouEmailHTML(sName),
      });
    } catch (err) {
      console.warn("⚠️ Thank-you email failed (non-critical):", err);
    }

    const processingTime = Date.now() - startTime;

    return NextResponse.json(
      {
        success: true,
        message:
          "Message sent. Check your inbox — I've sent a confirmation too.",
        processingTime,
      },
      {
        status: 200,
        headers: { "X-RateLimit-Remaining": rateLimit.remaining.toString() },
      },
    );
  } catch (error) {
    console.error("\n💥 ===== CONTACT FORM ERROR =====");
    console.error(
      "Error type:",
      error instanceof Error ? error.name : typeof error,
    );
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error),
    );
    console.error(
      "Stack trace:",
      error instanceof Error ? error.stack : "No stack trace",
    );
    console.error("=====================================\n");

    return NextResponse.json(
      {
        error:
          "Unexpected error. Please try again or contact amit98ch@gmail.com directly.",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 },
    );
  }
}

// ─── GET Handler 
export async function GET() {
  return NextResponse.json({
    status: "operational",
    service: "Simple Portfolio Contact API (No reCAPTCHA)",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
}