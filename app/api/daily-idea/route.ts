import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { getBusinessProfile } from "@/lib/businessProfile";

type DailyIdeaContext = {
  businessName: string;
  businessType: string;
  description: string;
  targetAudience: string;
  location: string;
  brandVoice: string;
  preferredCta: string;
};

const DEFAULT_CONTEXT: DailyIdeaContext = {
  businessName: "",
  businessType: "Local Service Business",
  description: "",
  targetAudience: "",
  location: "",
  brandVoice: "Friendly",
  preferredCta: "",
};

function cleanContextValue(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getFallbackIdea(context: DailyIdeaContext) {
  const dayNumber = Math.floor(Date.now() / 86_400_000);
  const businessName = context.businessName || "your business";
  const offering = cleanContextValue(
    context.description || context.businessType
  ).toLowerCase();
  const audience = context.targetAudience
    ? ` for ${cleanContextValue(context.targetAudience)}`
    : "";
  const location = context.location
    ? ` in ${cleanContextValue(context.location)}`
    : "";
  const cta = context.preferredCta
    ? `Finish with “${cleanContextValue(context.preferredCta).replace(
        /\bWhatApp\b/gi,
        "WhatsApp"
      )}”.`
    : "Finish by inviting people to message you for more information.";

  const ideas = [
    {
      title: "Show a Real Result",
      idea: `Share one recent result or before-and-after example from ${businessName}. Explain how your ${offering} helped the customer${location}. ${cta}`,
    },
    {
      title: "Teach One Useful Tip",
      idea: `Post one quick tip about ${offering}${audience}. Keep it practical, explain how ${businessName} can help, and ${cta.charAt(0).toLowerCase()}${cta.slice(1)}`,
    },
    {
      title: "Behind Your Process",
      idea: `Show a short photo or video of how ${businessName} delivers ${offering}. Highlight one detail that makes your work valuable${audience}. ${cta}`,
    },
    {
      title: "Answer a Customer Question",
      idea: `Choose one question customers often ask about ${offering} and answer it in a short post. Mention ${businessName}${location} and ${cta.charAt(0).toLowerCase()}${cta.slice(1)}`,
    },
    {
      title: "Promote One Clear Offer",
      idea: `Create a simple limited-time offer around one part of your ${offering}${audience}. State the benefit clearly, add a deadline, and ${cta.charAt(0).toLowerCase()}${cta.slice(1)}`,
    },
  ];

  return ideas[dayNumber % ideas.length];
}

export async function GET(req: Request) {
  let fallbackContext = DEFAULT_CONTEXT;

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    let profile: Awaited<ReturnType<typeof getBusinessProfile>> = null;

    try {
      profile = await getBusinessProfile(userId);
    } catch (profileError) {
      console.warn("Daily idea business profile unavailable:", profileError);
    }

    const requestedBusinessType =
      searchParams.get("businessType")?.trim().slice(0, 100) || "";
    const businessType =
      profile?.customBusinessType ||
      profile?.businessType ||
      requestedBusinessType ||
      DEFAULT_CONTEXT.businessType;

    fallbackContext = {
      businessName: profile?.businessName || "",
      businessType,
      description: profile?.description || "",
      targetAudience: profile?.targetAudience || "",
      location: profile?.location || "",
      brandVoice: profile?.brandVoice || "Friendly",
      preferredCta: profile?.preferredCta || "",
    };

    const prompt = `
You are Marketa AI, an AI marketing assistant.

Create one practical marketing idea for this specific business:
- Business name: ${fallbackContext.businessName || "Not provided"}
- Business type: ${fallbackContext.businessType}
- Products or services: ${fallbackContext.description || "Not provided"}
- Ideal customers: ${fallbackContext.targetAudience || "Not provided"}
- Location: ${fallbackContext.location || "Not provided"}
- Brand voice: ${fallbackContext.brandVoice}
- Preferred call to action: ${fallbackContext.preferredCta || "Not provided"}

Rules:
- Make the idea clearly relevant to the saved products, services, and customers
- Mention the business name or a real service when that information is available
- Give one action the owner can complete today
- Make it suitable for social media or WhatsApp
- Keep it short, useful, and beginner-friendly
- Never invent prices, products, customer results, or business details
- Do not say “tailor this to your business”
- Return valid JSON only, without markdown or code fences

Return this exact JSON shape:
{
  "title": "string",
  "idea": "string"
}
`;

    const response = await getGeminiClient().models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse((response.text ?? "").trim());

    if (
      typeof parsed?.title !== "string" ||
      typeof parsed?.idea !== "string"
    ) {
      throw new Error("Gemini returned an invalid daily idea.");
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.warn("Using profile-aware fallback daily idea:", error);
    return NextResponse.json(getFallbackIdea(fallbackContext));
  }
}
