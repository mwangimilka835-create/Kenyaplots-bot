const admin = require('firebase-admin');

try {
  // New method: use 3 separate env vars instead of 1 JSON
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });

  console.log("✅ Firebase connected successfully!");
} catch (error) {
  console.error("❌ Firebase Error:", error.message);
  process.exit(1);
}
