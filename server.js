const admin = require('firebase-admin');

try {
  // 1. Get the string from Render
  let serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

  // 2. Fix the private key formatting (Crucial Step!)
  // This ensures the \n characters are treated as real new lines
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log("✅ Firebase connected successfully!");
} catch (error) {
  console.error("❌ Firebase Error:", error.message);
}
