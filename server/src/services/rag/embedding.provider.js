import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { config } from "../../config/app.config.js";

if (!config.huggingface.apiKey) {
  console.warn(
    "WARNING: HUGGINGFACE_API_KEY is not set. Embeddings will fail."
  );
}

export const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: config.huggingface.apiKey,
  model: config.huggingface.embeddingModel,
});
