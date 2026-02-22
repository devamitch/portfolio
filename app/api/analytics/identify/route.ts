import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { visitorId, metadata } = body;
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "unknown";

    const { getFirestore } = await import("firebase-admin/firestore");
    const { initializeApp, getApps, cert } = await import("firebase-admin/app");

    if (!getApps().length) {
      const key = Buffer.from(
        process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY!,
        "base64",
      ).toString("utf-8");
      initializeApp({ credential: cert(JSON.parse(key)) });
    }

    const db = getFirestore();
    const visitorsColl = db.collection("visitors");

    let profileData = null;

    if (visitorId) {
      const doc = await visitorsColl.doc(visitorId).get();
      if (doc.exists) {
        profileData = { id: doc.id, ...doc.data() };
      }
    }

    if (!profileData && ip !== "unknown") {
      const q = await visitorsColl
        .where("lastIp", "==", ip.split(",")[0].trim())
        .orderBy("lastSeen", "desc")
        .limit(1)
        .get();

      if (!q.empty) {
        const doc = q.docs[0];
        profileData = { id: doc.id, ...doc.data() };
      }
    }

    if (profileData && metadata) {
      await visitorsColl.doc(profileData.id).set(
        {
          lastSeen: new Date().toISOString(),
          lastIp: ip.split(",")[0].trim(),
          ...metadata,
        },
        { merge: true },
      );
    }

    return NextResponse.json({
      success: true,
      identified: !!profileData,
      profile: profileData,
      ip: ip.split(",")[0].trim(),
    });
  } catch (err) {
    console.error("[identify] error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
