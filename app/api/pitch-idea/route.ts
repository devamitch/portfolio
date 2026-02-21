// app/api/pitch-idea/route.ts
// Handles "Pitch Your Idea" form submissions from the portfolio

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, idea, budget, timeline, category, stage } =
      await req.json();

    // Validate required fields
    if (!name || !email || !idea) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, idea" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    // ── Option A: Send email via Resend (recommended) ──────────────────
    // Uncomment and configure if using Resend:
    //
    // import { Resend } from "resend";
    // const resend = new Resend(process.env.RESEND_API_KEY);
    //
    // await resend.emails.send({
    //   from:    "noreply@devamitch.in",
    //   to:      process.env.OWNER_EMAIL ?? "amit98ch@gmail.com",
    //   subject: `[Portfolio] New Idea Pitch: ${name} — ${category ?? "General"}`,
    //   html: `
    //     <h2>New Idea Pitch from Portfolio</h2>
    //     <table>
    //       <tr><td><strong>Name:</strong></td><td>${name}</td></tr>
    //       <tr><td><strong>Email:</strong></td><td>${email}</td></tr>
    //       <tr><td><strong>Category:</strong></td><td>${category ?? "Not specified"}</td></tr>
    //       <tr><td><strong>Stage:</strong></td><td>${stage ?? "Not specified"}</td></tr>
    //       <tr><td><strong>Budget:</strong></td><td>${budget ?? "Not specified"}</td></tr>
    //       <tr><td><strong>Timeline:</strong></td><td>${timeline ?? "Not specified"}</td></tr>
    //     </table>
    //     <h3>Idea:</h3>
    //     <p>${idea.replace(/\n/g, "<br>")}</p>
    //   `,
    // });

    // ── Option B: Log for now (replace with real email service) ─────────
    console.log("[pitch-idea] New submission:", {
      name,
      email,
      category,
      stage,
      budget,
      timeline,
      ideaLength: idea.length,
      timestamp: new Date().toISOString(),
    });

    // ── Send auto-reply to the submitter ─────────────────────────────────
    // await resend.emails.send({
    //   from:    "amit@devamitch.in",
    //   to:      email,
    //   subject: "Your idea pitch was received — Amit Chakraborty",
    //   html: `
    //     <p>Hi ${name},</p>
    //     <p>I've received your idea pitch and will review it within 48 hours.</p>
    //     <p>Best,<br>Amit</p>
    //   `,
    // });

    return NextResponse.json({ success: true, message: "Pitch received" });
  } catch (error) {
    console.error("[pitch-idea] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
