// Import necessary modules
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { llm } from "./llm.provider.js";
import { querySimilar } from "./vectorStore.service.js";

// Define a prompt template for the RAG system
const ragPrompt = PromptTemplate.fromTemplate(`
You are a helpful AI assistant.

Your task is to answer questions using strictly the provided context retrieved from the vector database.

Rules:
- Use the information present in the context to answer the question.
- If the context does not contain enough information to answer the question, respond with:
  "I am not certain based on the provided context."
- Keep answers clear, factual, and concise.

Context:
{context}

User Question:
{question}

Answer:
`);

// Create a processing chain that combines the prompt, LLM, and output parser
const chain = RunnableSequence.from([ragPrompt, llm, new StringOutputParser()]);

// Main RAG function that handles user questions
export async function askRag(question, topK = 4) {
  // 1. Search for relevant context using vector similarity
  const results = await querySimilar({ query: question, topK });

  // 2. Format the context for the LLM
  const context =
    results.length > 0
      ? results.map((d, i) => `(${i + 1}) ${d.text}`).join("\n\n")
      : "No relevant documents found.";

  console.log(`[RAG] Question: ${question}`);
  console.log(`[RAG] Retrieved ${results.length} chunks.`);
  if (results.length > 0) {
    console.log(`[RAG] Context Snippet: ${results[0].text.substring(0, 200)}...`);
  }

  // 3. Generate an answer using the LLM with the retrieved context
  const answer = await chain.invoke({ context, question });

  // 4. Return the answer and source documents
  return {
    answer,
    sources: results.map((d) => d.docName).filter(Boolean),
  };
}