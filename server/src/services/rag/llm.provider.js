import { ChatOpenAI } from "@langchain/openai";
import { config } from "../../config/app.config.js";

export const llm = new ChatOpenAI({
  apiKey: config.openRouter.apiKey,
  modelName: config.openRouter.model,
  temperature: config.openRouter.temperature,
  maxTokens: 1000,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": config.server.baseUrl,
      "X-Title": config.server.appTitle,
    },
  },
});
