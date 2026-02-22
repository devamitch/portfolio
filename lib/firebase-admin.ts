import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let adminApp: App;

function getAdminApp(): App {
  if (getApps().length) return getApps()[0];

  const serviceAccount = JSON.parse(
    process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY ?? "{}",
  );

  adminApp = initializeApp({
    credential: cert(serviceAccount),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, 
  });

  return adminApp;
}

export const adminDb = getFirestore(getAdminApp());

export const COLLECTIONS = {
  aiChats: "ai_chat_logs",
  contacts: "contacts",
  pitches: "pitches",
} as const;

export function withMeta(data: Record<string, unknown>, ip?: string) {
  return {
    ...data,
    createdAt: new Date().toISOString(),
    ip: ip ?? "unknown",
  };
}