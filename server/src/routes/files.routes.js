import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { uploadFile } from "../controllers/files.controller.js";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "storage", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
});

router.post("/upload", upload.array("file"), uploadFile);

export default router;
