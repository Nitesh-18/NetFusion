import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { bucket } from "../config/firebaseConfig.js";

// Configure Multer storage
const storage = multer.memoryStorage(); // Store files in memory for processing

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov/;
  const extname = allowedTypes.test(file.originalname.toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Images and Videos Only!"), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter,
}).fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

// Middleware to handle file uploads to Firebase Storage
export const uploadToFirebase = async (req, res, next) => {
  try {
    const fileUploads = [];

    if (req.files) {
      for (const [fieldName, files] of Object.entries(req.files)) {
        for (const file of files) {
          const fileName = `${uuidv4()}_${file.originalname}`;
          const blob = bucket.file(fileName);

          // Create a write stream to upload file to Firebase
          const blobStream = blob.createWriteStream({
            metadata: {
              contentType: file.mimetype,
            },
          });

          // Handle file upload
          blobStream.on("error", (err) => {
            next(err);
          });

          blobStream.end(file.buffer);

          fileUploads.push(
            blob
              .getSignedUrl({
                action: "read",
                expires: "03-01-2500",
              })
              .then((url) => ({ fieldName, url }))
          );
        }
      }
    }

    req.uploadedFiles = await Promise.all(fileUploads);
    next();
  } catch (error) {
    next(error);
  }
};

export default upload;
