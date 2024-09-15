import multer from "multer";
import { bucket } from "../config/firebaseConfig.js"; // Import the Firebase bucket
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Set up Multer for handling file uploads
const storage = multer.memoryStorage(); // Store files in memory

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed (jpg, jpeg, png)"));
    }
  },
}).single("avatar"); // Expect 'avatar' field for file upload

const avatarUploadMiddleware = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Generate a unique filename for the avatar
    const avatarFileName = `Avatar/${uuidv4()}-${Date.now()}-${
      req.file.originalname
    }`;

    try {
      // Create a blob in the bucket for the avatar
      const blob = bucket.file(avatarFileName);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      // Write the file and handle completion or error
      blobStream.on("error", (error) => {
        console.error("Error uploading avatar:", error);
        return res.status(500).json({ message: "Failed to upload avatar" });
      });

      blobStream.on("finish", async () => {
        // Make the file public or generate a signed URL
        const [signedUrl] = await blob.getSignedUrl({
          action: "read",
          expires: "01-01-2030", // Set an appropriate expiration date
        });

        // Add the signed URL to the request object for further processing
        req.avatarUrl = signedUrl;
        next(); // Pass control to the next middleware or route handler
      });

      // Pipe the file buffer into Firebase Cloud Storage
      blobStream.end(req.file.buffer);
    } catch (error) {
      console.error("Error processing avatar upload:", error);
      return res
        .status(500)
        .json({ message: "Error processing avatar upload" });
    }
  });
};

export default avatarUploadMiddleware;
