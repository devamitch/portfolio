import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { visitorId, name, interest } = body;

    if (!visitorId || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    try {
      const { getFirestore } = await import("firebase-admin/firestore");
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
      await db.collection("visitors").doc(visitorId).set(
        {
          name,
          interest,
          profileComplete: true,
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );
    } catch (fbErr) {
      console.warn("[profile] Firebase failed:", fbErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[profile] error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
