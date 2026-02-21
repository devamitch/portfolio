// app/api/newsletter/route.ts
// Handles newsletter signups from the portfolio footer

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    // ── Option A: Mailchimp ──────────────────────────────────────────────
    // const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    // const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
    // const MAILCHIMP_DC      = process.env.MAILCHIMP_DC ?? "us1";
    //
    // const response = await fetch(
    //   `https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
    //   {
    //     method: "POST",
    //     headers: {
    //       Authorization: `apikey ${MAILCHIMP_API_KEY}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       email_address: email,
    //       status: "subscribed",
    //       tags:   ["portfolio"],
    //     }),
    //   },
    // );
    //
    // if (!response.ok) {
    //   const err = await response.json();
    //   if (err.title === "Member Exists") {
    //     return NextResponse.json({ success: true, message: "Already subscribed" });
    //   }
    //   throw new Error(err.detail ?? "Mailchimp error");
    // }

    // ── Option B: ConvertKit ─────────────────────────────────────────────
    // await fetch(`https://api.convertkit.com/v3/forms/${process.env.CK_FORM_ID}/subscribe`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     api_key: process.env.CONVERTKIT_API_KEY,
    //     email,
    //     tags: [process.env.CK_TAG_ID],
    //   }),
    // });

    // ── Option C: Simple log (replace with real service) ─────────────────
    console.log("[newsletter] New subscriber:", {
      email,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Subscribed" });
  } catch (error) {
    console.error("[newsletter] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
