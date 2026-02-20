import { google } from "googleapis";
export async function POST(req: Request) {
  const { name, email, date, time, message, duration } = await req.json();
  const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);
  const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
  const calendar = google.calendar({ version: "v3", auth });
  const [h, m] = time.split(":").map(Number);
  const start = new Date(`${date}T00:00:00`);
  start.setHours(h, m, 0, 0);
  const end = new Date(start.getTime() + duration * 60000);
  const event = await calendar.events.insert({
    calendarId: process.env.OWNER_CALENDAR_ID!,
    conferenceDataVersion: 1,
    sendUpdates: "all",
    requestBody: {
      summary: `${duration}min Call — ${name}`,
      description: message || "Meeting scheduled via portfolio.",
      start: { dateTime: start.toISOString(), timeZone: "Asia/Kolkata" },
      end: { dateTime: end.toISOString(), timeZone: "Asia/Kolkata" },
      attendees: [
        { email: process.env.OWNER_EMAIL!, organizer: true },
        { email },
      ],
      conferenceData: {
        createRequest: { requestId: `meet-${Date.now()}-${Math.random()}` },
      },
    },
  });
  const meetLink = event.data.conferenceData?.entryPoints?.[0]?.uri ?? "";
  return Response.json({ meetLink, eventId: event.data.id });
}
