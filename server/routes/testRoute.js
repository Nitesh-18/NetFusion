import express from "express";
import { uploadToFirebase } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/upload", uploadToFirebase, (req, res) => {
  res.json({ uploadedFiles: req.uploadedFiles });
});

export default router;
