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

// Configure multer for multiple file uploads
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter,
}).array("media", 10); // Accept up to 10 files for media

// Middleware to handle file uploads to Firebase Storage
export const uploadMessageMedia = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(err);
    }
    try {
      if (req.files) {
        const mediaUrls = await Promise.all(
          req.files.map(async (file) => {
            const fileName = `${uuidv4()}_${file.originalname}`;
            const blob = bucket.file(fileName);

            // Create a write stream to upload file to Firebase
            const blobStream = blob.createWriteStream({
              metadata: {
                contentType: file.mimetype,
              },
            });

            // Handle file upload
            await new Promise((resolve, reject) => {
              blobStream.on("error", (err) => reject(err));
              blobStream.end(file.buffer);
              resolve();
            });

            const url = await blob.getSignedUrl({
              action: "read",
              expires: "03-01-2500",
            });

            return url[0]; // Return the media URL
          })
        );

        req.mediaUrls = mediaUrls; // Store the array of media URLs
      }

      next();
    } catch (error) {
      next(error);
    }
  });
};

export default upload;
