import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

export function getGeminiApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY.");
  }

  return apiKey;
}

export function getGeminiClient() {
  if (client) return client;

  client = new GoogleGenAI({ apiKey: getGeminiApiKey() });
  return client;
}
