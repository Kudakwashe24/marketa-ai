import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PLAN_CONFIGS } from "@/lib/plans";
import { getUserSubscription } from "@/lib/subscription";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's plan
    const plan =
      (await getUserSubscription(userId)) as keyof typeof PLAN_CONFIGS;

    const planConfig = PLAN_CONFIGS[plan];

    // Get business type from query
    const { searchParams } = new URL(req.url);
    const businessType =
      searchParams.get("businessType") || "Local Service Business";

    // Different prompt depending on plan
    const prompt = planConfig.personalizedDailyIdea
      ? `
You are Marketa AI, an AI marketing assistant.

Give ONE daily marketing idea specifically for a ${businessType}.

Respond ONLY in JSON like this:

{
"title": "Short catchy title",
"idea": "A clear marketing action the business owner can take today"
}
`
      : `
You are Marketa AI.

Give ONE simple daily marketing idea for a local business.

Respond ONLY in JSON like this:

{
"title": "Short catchy title",
"idea": "A simple marketing action"
}
`;

    const model = ai.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        title: "Today's Marketing Idea",
        idea: text,
      };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Daily idea error:", error);

    return NextResponse.json(
      { error: "Failed to generate daily idea." },
      { status: 500 }
    );
  }
}