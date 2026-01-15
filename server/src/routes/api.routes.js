import { Router } from "express";
import { askRag } from "../services/rag/rag.service.js";
import filesRoutes from "./files.routes.js";

export const apiRouter = Router();

// Mount file routes
apiRouter.use("/files", filesRoutes);

apiRouter.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

apiRouter.post("/ask", async (req, res) => {
  try {
    const { question, topK } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Question is required" });
    }

    const result = await askRag(question, Number(topK ?? 4));

    res.json(result);
  } catch (err) {
    console.error("RAG error:", err);
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});
