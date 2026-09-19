import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK safely
if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
      : undefined;

    if (clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      // Fallback for development without service account JSON
      admin.initializeApp({
        projectId: projectId || "smart-chef-app",
      });
    }
  } catch (error) {
    console.warn("[Firebase Admin] Initialization notice:", error);
  }
}

export const adminAuth = admin.apps.length ? admin.auth() : null;
export default admin;
