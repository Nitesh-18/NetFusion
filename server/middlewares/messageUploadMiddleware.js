import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { bucket } from "../config/firebaseConfig.js";

// Configure Multer storage
const storage = multer.memoryStorage(); // Store files in memory for processing

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov/;
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype) {
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
}).single("media"); // Accept a single file for media

// Middleware to handle file uploads to Firebase Storage
export const uploadMessageMedia = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(err);
    }
    try {
      if (req.file) {
        const file = req.file;
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

        const url = await blob.getSignedUrl({
          action: "read",
          expires: "03-01-2500",
        });

        req.mediaUrl = url[0]; // Store the media URL
      }

      next();
    } catch (error) {
      next(error);
    }
  });
};

export default upload;
