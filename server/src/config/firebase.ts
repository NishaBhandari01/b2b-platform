import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

let storageBucket: any = null;
let isFirebaseConfigured = false;

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET;

  if (projectId && clientEmail && privateKey && bucketName) {
    const app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
      storageBucket: bucketName,
    });
    storageBucket = getStorage(app).bucket();
    isFirebaseConfigured = true;
    console.log("Firebase Admin successfully initialized.");
  } else {
    console.warn("Firebase credentials not fully provided. Falling back to local storage.");
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin:", error);
}

// Helper to get the actual storage bucket
export const getBucket = () => {
  if (!isFirebaseConfigured) return null;
  return storageBucket;
};

export { isFirebaseConfigured };
