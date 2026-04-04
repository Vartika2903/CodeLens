import OpenAI from "openai";

/**
 * Singleton NVIDIA/OpenAI-compatible client targeting Kimi K2 Thinking.
 * Created once at startup and reused for all streaming requests.
 */
const nvidiaClient = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || "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",
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export default nvidiaClient;
