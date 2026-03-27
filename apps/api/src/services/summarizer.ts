import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT =
  "You are a nonpartisan civic assistant. Summarize this bill in 3 sentences in plain English that any citizen can understand. Focus on what it does, who it affects, and any major controversy.";

export async function summarizeBill(billText: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is required for bill summarization");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite",
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent(billText);
  return result.response.text();
}
