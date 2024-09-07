import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// Configure Multer storage
const storage = multer.memoryStorage(); // Store files in memory for processing

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
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

export default upload;
