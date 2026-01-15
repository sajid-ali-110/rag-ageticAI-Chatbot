import { config } from "../../config/app.config.js";
import { embeddings } from "./embedding.provider.js";
//import { getPineconeIndex } from "./pinecone.client.js";
import { getPineconeIndex } from "./pinecone.client.js";

export async function upsertChunks({ documentId, docName, chunks }) {
  const index = getPineconeIndex();
  const namespace = config.pinecone.namespace;

  // embedDocuments must exist or we will adjust (see note below)
  const vectors = await embeddings.embedDocuments(chunks);

  const records = chunks.map((text, i) => ({
    id: `${documentId}::${i}`,
    values: vectors[i],
    metadata: {
      documentId,
      docName,
      chunkIndex: i,
      text,
      createdAt: new Date().toISOString(),
    },
  }));

  const batchSize = 80;
  for (let i = 0; i < records.length; i += batchSize) {
    await index.namespace(namespace).upsert(records.slice(i, i + batchSize));
  }

  return { upserted: records.length };
}

export async function querySimilar({ query, topK = 6 }) {
  const index = getPineconeIndex();
  const namespace = config.pinecone.namespace;

  const qVector = await embeddings.embedQuery(query);

  const res = await index.namespace(namespace).query({
    vector: qVector,
    topK,
    includeMetadata: true,
  });

  return (res.matches || []).map((m) => ({
    score: m.score,
    text: m.metadata?.text || "",
    docName: m.metadata?.docName || "",
    documentId: m.metadata?.documentId || "",
    chunkIndex: m.metadata?.chunkIndex ?? 0,
  }));
}
