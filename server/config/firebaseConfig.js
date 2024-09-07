import admin from "firebase-admin";
import serviceAccount from "../utils/fb.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "netfusion-7c638.appspot.com",
});

const bucket = admin.storage().bucket();
export default bucket;
