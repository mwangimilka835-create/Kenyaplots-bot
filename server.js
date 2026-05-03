
const admin = require('firebase-admin');

try {
  const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountRaw) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is missing in Render Environment!");
  }

  let serviceAccount = JSON.parse(serviceAccountRaw);

  /** 
   * THE FIX: 
   * We replace double-escaped backslashes and ensure 
   * the key has the exact format Firebase expects.
   */
  serviceAccount.private_key = serviceAccount.private_key
    .replace(/\\n/g, '\n')     // Fixes escaped newlines
    .replace(/"/g, '')         // Removes accidental extra quotes
    .trim();                   // Removes accidental spaces

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log("✅ Firebase Admin initialized successfully!");
} catch (error) {
  console.error("❌ Firebase Error:", error.message);
  // Don't crash the whole server yet so you can debug other parts
}

const db = admin.firestore();
