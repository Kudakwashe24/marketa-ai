import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { getBusinessProfile } from "@/lib/businessProfile";
import { PLAN_CONFIGS } from "@/lib/plans";
import { getOrCreateUserPlan } from "@/lib/userPlan";

const FALLBACK_IDEAS = [
  {
    title: "Show the Result",
    idea: "Share one before-and-after result from your business today and add a simple call to action inviting customers to enquire or book.",
  },
  {
    title: "Ask Your Customers",
    idea: "Post a quick this-or-that question related to your products or services and invite customers to reply on WhatsApp or social media.",
  },
  {
    title: "Behind the Scenes",
    idea: "Show a short behind-the-scenes photo or video of how you prepare your product or deliver your service, then explain what makes your process special.",
  },
  {
    title: "Customer Favourite",
    idea: "Highlight your most popular product or service, explain why customers love it, and finish with a clear call to action.",
  },
  {
    title: "Limited-Time Reminder",
    idea: "Choose one offer to promote today, give it a clear deadline, and share it on both your social media story and WhatsApp Status.",
  },
];

function getFallbackIdea(businessType: string) {
  const dayNumber = Math.floor(Date.now() / 86_400_000);
  const fallback = FALLBACK_IDEAS[dayNumber % FALLBACK_IDEAS.length];

  return {
    title: fallback.title,
    idea: `${fallback.idea} Tailor it to your ${businessType.toLowerCase()} customers.`,
  };
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan } = await getOrCreateUserPlan(userId);
    const planConfig = PLAN_CONFIGS[plan];

    const { searchParams } = new URL(req.url);
    let savedBusinessType = "";

    try {
      const profile = await getBusinessProfile(userId);
      savedBusinessType =
        profile?.customBusinessType || profile?.businessType || "";
    } catch (profileError) {
      console.warn("Daily idea business profile unavailable:", profileError);
    }

    const businessType =
      searchParams.get("businessType") ||
      savedBusinessType ||
      "Local Service Business";

    const prompt = planConfig.personalizedDailyIdea
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

    const response = await getGeminiClient().models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text ?? "";
    const parsed = JSON.parse(text.trim());

    if (
      typeof parsed?.title !== "string" ||
      typeof parsed?.idea !== "string"
    ) {
      throw new Error("Gemini returned an invalid daily idea.");
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.warn("Using fallback daily idea:", error);
    return NextResponse.json(getFallbackIdea("small business"));
  }
}
