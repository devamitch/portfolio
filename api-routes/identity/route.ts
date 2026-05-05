import { headers } from "next/headers";
import { NextResponse } from "next/server";

const isDevelopment = process.env.NODE_ENV === "development";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { visitorId, metadata } = body;
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "unknown";

    // DEVELOPMENT MODE: Skip Firebase
    if (isDevelopment) {
      console.log("[identify] Dev mode - skipping Firebase");
      return NextResponse.json({
        success: true,
        identified: false, // Always treat as new in dev
        profile: null,
        ip: "dev-local",
      });
    }

    // PRODUCTION MODE: Use Firebase
    const { getFirestore } = await import("firebase-admin/firestore");
    const { initializeApp, getApps, cert } = await import("firebase-admin/app");

    if (!getApps().length) {
      const key = Buffer.from(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY!,
        "base64",
      ).toString("utf-8");
      initializeApp({ credential: cert(JSON.parse(key)) });
    }

    const db = getFirestore();
    const visitorsColl = db.collection("visitors");

    let profileData = null;

    // Try to find by visitorId first
    if (visitorId) {
      const doc = await visitorsColl.doc(visitorId).get();
      if (doc.exists) {
        profileData = { id: doc.id, ...doc.data() };
      }
    }

    // Fallback: Try to find by IP
    if (!profileData && ip !== "unknown") {
      const cleanIp = ip.split(",")[0].trim();
      const q = await visitorsColl
        .where("lastIp", "==", cleanIp)
        .orderBy("lastSeen", "desc")
        .limit(1)
        .get();

      if (!q.empty) {
        const doc = q.docs[0];
        profileData = { id: doc.id, ...doc.data() };
      }
    }

    // Update metadata if profile found
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

    // Create new visitor if not found
    if (!profileData) {
      const newId = `visitor-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      await visitorsColl.doc(newId).set({
        createdAt: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        lastIp: ip.split(",")[0].trim(),
        ...metadata,
      });
      profileData = { id: newId };
    }

    return NextResponse.json({
      success: true,
      identified: !!profileData.name, // Only identified if name is set
      profile: profileData,
      ip: ip.split(",")[0].trim(),
    });
  } catch (err) {
    console.error("[identify] error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
