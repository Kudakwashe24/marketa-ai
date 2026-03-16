import { GoogleGenAI } from "@google/genai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PLAN_CONFIG } from "@/lib/plans";
import { getUserPlan } from "@/lib/subscription";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = await getUserPlan(userId);
    const config = PLAN_CONFIG[plan];

    const { searchParams } = new URL(req.url);
    const businessType =
      searchParams.get("businessType") || "Local Service Business";

    const prompt = config.personalizedDailyIdea
      ? `
You are Marketa AI, an AI marketing assistant for businesses.

Generate one practical daily marketing idea specifically for this business type:
${businessType}

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
`
      : `
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