import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body.prompt;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    const fullPrompt = `
You are Marketa AI, an AI marketing assistant for businesses.

A user will give you something they want to promote.

Generate a response in valid JSON format only with these exact keys:
- socialCaption
- whatsappPromo
- adCopy
- marketingTip

Rules:
- Keep the tone professional, simple, and practical.
- Make the output useful for small businesses.
- Do not include markdown.
- Do not include code fences.
- Return JSON only.

User prompt:
${prompt}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    const text = response.text ?? "";

    const cleanedText = text.trim();

    const parsed = JSON.parse(cleanedText);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Gemini generation error:", error);

    return NextResponse.json(
      { error: "Failed to generate campaign." },
      { status: 500 }
    );
  }
}