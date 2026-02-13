import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { name, email, message, subject } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "amit.hellmaker@gmail.com",
      pass: "(Amit@1995#)",
      // pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${process.env.GMAIL_USER}>`,
    to: "amit98ch@gmail.com",
    replyTo: email,
    subject: subject || `Portfolio Contact: ${name}`,
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px; border-radius: 12px; border: 1px solid #333;">
        <div style="border-bottom: 2px solid #DAA520; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #DAA520; margin: 0; font-size: 24px;">New Message — devamit.co.in</h1>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #888; width: 100px; vertical-align: top;">From:</td>
            <td style="padding: 10px 0; color: #fff; font-weight: bold;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #888; vertical-align: top;">Email:</td>
            <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #DAA520;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #888; vertical-align: top;">Subject:</td>
            <td style="padding: 10px 0; color: #fff;">${subject || "General Inquiry"}</td>
          </tr>
        </table>
        <div style="margin-top: 30px; background: #111; padding: 24px; border-radius: 8px; border-left: 3px solid #DAA520;">
          <p style="margin: 0; color: #ccc; line-height: 1.8; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="color: #555; font-size: 12px; margin-top: 30px;">Sent from your portfolio contact form · devamit.co.in</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
