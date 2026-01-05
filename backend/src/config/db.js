const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json");

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  console.log("[INFO] Firebase Admin connected successfully");
} catch (error) {
  console.error("[ERROR] Firebase connection failed:", error);
}

const db = admin.firestore();

module.exports = db;
