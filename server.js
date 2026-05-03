const admin = require('firebase-admin');

try {
  const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountRaw) {
    throw new Error("The environment variable FIREBASE_SERVICE_ACCOUNT is missing on Render!");
  }

  // Parse the JSON string
  let serviceAccount = JSON.parse(serviceAccountRaw);

  // Fix the private key formatting
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  console.log("✅ Firebase connected successfully!");
} catch (error) {
  // This will now print a much more helpful error in your Render logs
  console.error("❌ Firebase Error:", error.message);
  process.exit(1); // Stop the server if Firebase fails
}
