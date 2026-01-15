import { Router } from "express";
import multer from "multer";
import { extractTextFromUpload, ingestText } from "../services/rag/documentProcessor.service.js";
//import { ingestFile } from "../services/rag/documentProcessor.service.js";


export const ingestRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

ingestRouter.post("/ingest", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "file is required" });

    const text = await extractTextFromUpload(req.file);
    if (!text.trim()) return res.status(400).json({ error: "No text found in file" });

    const source = req.file.originalname || "upload";
    const result = await ingestText({ text, source });

    res.json({ ok: true, ...result });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Ingest failed" });
  }
});
