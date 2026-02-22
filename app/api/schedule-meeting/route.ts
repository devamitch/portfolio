import { google } from "googleapis";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { name, email, date, time, message, duration } = await req.json();

    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);
    const auth = new google.auth.GoogleAuth({
      credentials: key,
      scopes: ["https://www.googleapis.com/auth/calendar.events"], // Specific scope is safer
    });

    const calendar = google.calendar({ version: "v3", auth });

    // Safely parse Indian Standard Time (IST)
    const [h, m] = time.split(":").map(Number);
    const start = new Date(
      `${date}T${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:00+05:30`,
    );
    const end = new Date(start.getTime() + (duration || 30) * 60000);

    const event = await calendar.events.insert({
      calendarId: process.env.OWNER_CALENDAR_ID!,
      conferenceDataVersion: 1, // Required to generate Google Meet links
      sendUpdates: "all",
      requestBody: {
        summary: `${duration || 30}min Call — ${name}`,
        description: message || "Meeting scheduled via portfolio.",
        start: { dateTime: start.toISOString(), timeZone: "Asia/Kolkata" },
        end: { dateTime: end.toISOString(), timeZone: "Asia/Kolkata" },
        attendees: [
          { email: process.env.OWNER_EMAIL!, organizer: true },
          { email },
        ],
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            conferenceSolutionKey: { type: "hangoutsMeet" }, // Generates the Google Meet
          },
        },
      },
    });

    const meetLink =
      event.data.conferenceData?.entryPoints?.find(
        (e) => e.entryPointType === "video",
      )?.uri ?? "";

    return NextResponse.json({ meetLink, eventId: event.data.id });
  } catch (error) {
    console.error("Meeting Scheduler Error:", error);
    return NextResponse.json(
      { error: "Failed to schedule meeting." },
      { status: 500 },
    );
  }
}
