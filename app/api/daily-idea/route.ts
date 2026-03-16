import { GoogleGenAI } from "@google/genai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prompt = `
You are Marketa AI, an AI marketing assistant for businesses.

Generate one practical daily marketing idea for a small business owner.

Rules:
- Keep it short
- Keep it useful
- Keep it beginner-friendly
- Make it suitable for social media or WhatsApp promotion
- Return valid JSON only
- Do not use markdown
- Do not use code fences

Return this exact JSON shape:
{
  "title": "string",
  "idea": "string"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text ?? "";
    const parsed = JSON.parse(text.trim());

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Daily idea error:", error);

    return NextResponse.json(
      { error: "Failed to generate daily idea." },
      { status: 500 }
    );
  }
}