import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import path from "path";
import { fileURLToPath } from "url";

// Get the current directory of the script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your Firebase service account key
const serviceAccount = path.join(__dirname, "../config/serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "netfusion-7c638.appspot.com", // Replace with your Firebase Storage bucket name
});

const bucket = getStorage().bucket();

export { bucket };
