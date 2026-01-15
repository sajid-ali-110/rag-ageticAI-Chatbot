import "dotenv/config";
import express from "express";
import cors from "cors";

import { config } from "./config/app.config.js";
import { apiRouter } from "./routes/api.routes.js";
import { ingestRouter } from "./routes/ingest.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", apiRouter);
app.use("/api", ingestRouter);

app.get("/", (req, res) => {
  res.send("Agentic RAG API is running");
});

app.listen(config.server.port, () => {
  console.log(`Server running at http://localhost:${config.server.port}`);
});
