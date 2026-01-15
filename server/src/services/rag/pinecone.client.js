import { Pinecone } from "@pinecone-database/pinecone";
import { config } from "../../config/app.config.js";

const pc = new Pinecone({ apiKey: config.pinecone.apiKey });

export function getPineconeIndex() {
  return pc.index(config.pinecone.indexName);
}
