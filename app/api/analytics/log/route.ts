import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, visitorId, ...data } = body;

    if (!visitorId) {
      return NextResponse.json({ error: "Missing visitorId" }, { status: 400 });
    }

    try {
      const { getFirestore, FieldValue } =
        await import("firebase-admin/firestore");
      const { initializeApp, getApps, cert } =
        await import("firebase-admin/app");

      if (!getApps().length) {
        const key = Buffer.from(
          process.env.FIREBASE_SERVICE_ACCOUNT_KEY!,
          "base64",
        ).toString("utf-8");
        initializeApp({ credential: cert(JSON.parse(key)) });
      }

      const db = getFirestore();
      const visitorRef = db.collection("visitors").doc(visitorId);

      if (type === "session_start") {
        await visitorRef.set(
          {
            lastSeen: new Date().toISOString(),
            ua: data.ua || "unknown",
            tz: data.tz || "unknown",
            visitCount: FieldValue.increment(1),
          },
          { merge: true },
        );

        await visitorRef.collection("sessions").add({
          ts: new Date().toISOString(),
          ua: data.ua,
        });
      }
    } catch (fbErr) {
      console.warn("[analytics] Firebase failed:", fbErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[analytics] error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
