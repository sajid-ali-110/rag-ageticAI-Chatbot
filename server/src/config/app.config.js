export const config = {
  server: {
    port: process.env.PORT || 3000,
    baseUrl: process.env.BASE_URL || "http://localhost:3000",
    appTitle: process.env.APP_TITLE || "RAG Chatbot",
  },
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
    model: process.env.OPENROUTER_MODEL || "kwaipilot/kat-coder-pro:free",
    // embeddingModel: process.env.OPENROUTER_EMBEDDING_MODEL || "text-embedding-3-small",
    temperature: Number(process.env.TEMPERATURE ?? "0.3"),
  },
  huggingface: {
    apiKey: process.env.HUGGINGFACE_API_KEY,
    embeddingModel: process.env.HUGGINGFACE_EMBEDDING_MODEL,
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY,
    indexName: process.env.PINECONE_INDEX_NAME || process.env.PINECONE_INDEX,
    namespace: process.env.PINECONE_NAMESPACE || "default",
    cloud: process.env.PINECONE_CLOUD,
    region: process.env.PINECONE_REGION,
  },
};

// Optional: Validation check
const requiredKeys = [
  ["openRouter.apiKey", config.openRouter.apiKey],
  ["huggingface.apiKey", config.huggingface.apiKey],
  ["pinecone.apiKey", config.pinecone.apiKey],
  ["pinecone.indexName", config.pinecone.indexName],
];

const missing = requiredKeys.filter(([, val]) => !val).map(([key]) => key);

if (missing.length > 0) {
  console.error(`Missing required configuration: ${missing.join(", ")}`);
  process.exit(1);
}
