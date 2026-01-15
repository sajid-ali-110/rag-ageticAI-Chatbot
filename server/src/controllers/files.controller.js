import { ingestFile } from "../services/rag/documentProcessor.service.js";

export async function uploadFile(req, res) {
  try {
    const files = req.files || (req.file ? [req.file] : []);
    if (!files.length)
      return res.status(400).json({ error: "No file uploaded" });

    const results = await Promise.all(
      files.map((file) =>
        ingestFile({
          filePath: file.path,
          originalName: file.originalname,
          mimeType: file.mimetype,
        })
      )
    );

    res.json({ ok: true, results });
  } catch (e) {
    res.status(500).json({ error: e.message || "Upload failed" });
  }
}
