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

function normalizeGeneratedText(value: string) {
  return cleanContextValue(value)
    .replace(/\bcape town\b/gi, "Cape Town")
    .replace(/\bWhatApp\b/gi, "WhatsApp");
}

const UNSUPPORTED_IDEA_PATTERN =
  /\b(video|videos|reel|reels|film|filming|record|recording|livestream|live stream|animation|podcast|testimonial|before[- ]and[- ]after)\b/i;

function getFallbackIdea(context: DailyIdeaContext) {
  const dayNumber = Math.floor(Date.now() / 86_400_000);
  const businessName = context.businessName || "your business";
  const offering = cleanContextValue(
    context.description || context.businessType
  ).toLowerCase();
  const audience = context.targetAudience
    ? ` for ${normalizeGeneratedText(context.targetAudience)}`
    : "";
  const location = context.location
    ? ` in ${normalizeGeneratedText(context.location)}`
    : "";
  const cta = context.preferredCta
    ? `Finish with “${cleanContextValue(context.preferredCta).replace(
        /\bWhatApp\b/gi,
        "WhatsApp"
      )}”.`
    : "Finish by inviting people to message you for more information.";

  const ideas = [
    {
      title: "Promote One Service",
      idea: `Create a social caption and matching static poster for one ${offering} service from ${businessName}${location}. Focus on one clear customer benefit${audience}. ${cta}`,
    },
    {
      title: "Teach One Useful Tip",
      idea: `Create a short social caption with one practical tip about ${offering}${audience}. Explain how ${businessName} can help, and ${cta.charAt(0).toLowerCase()}${cta.slice(1)}`,
    },
    {
      title: "Highlight a Customer Need",
      idea: `Create a social caption and WhatsApp promotion about one common need ${businessName} solves with ${offering}${audience}. Keep the benefit clear and do not add unprovided claims. ${cta}`,
    },
    {
      title: "Answer a Customer Question",
      idea: `Create a short social caption answering one common question about ${offering}. Mention ${businessName}${location} and ${cta.charAt(0).toLowerCase()}${cta.slice(1)}`,
    },
    {
      title: "Create a Clear Service Ad",
      idea: `Create concise ad copy and a static branded poster for ${businessName}'s ${offering}${audience}. Use only the business details already provided, explain one clear benefit, and ${cta.charAt(0).toLowerCase()}${cta.slice(1)}`,
    },
  ];

  const idea = ideas[dayNumber % ideas.length];

  return {
    title: normalizeGeneratedText(idea.title),
    idea: normalizeGeneratedText(idea.idea),
  };
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
- Only suggest content Marketa AI can directly generate now: a social media caption, WhatsApp promotion, ad copy, marketing tip, or static branded poster
- Do not suggest videos, reels, filming, recording, live streams, animation, podcasts, or any other unsupported media
- Do not require a customer result, testimonial, before-and-after example, photo, or other asset that was not provided
- Make the idea suitable for social media or WhatsApp and immediately usable in Marketa AI
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

    const normalizedIdea = normalizeGeneratedText(parsed.idea);

    if (UNSUPPORTED_IDEA_PATTERN.test(normalizedIdea)) {
      throw new Error("Gemini suggested content Marketa cannot generate.");
    }

    return NextResponse.json({
      title: normalizeGeneratedText(parsed.title),
      idea: normalizedIdea,
    });
  } catch (error) {
    console.warn("Using profile-aware fallback daily idea:", error);
    return NextResponse.json(getFallbackIdea(fallbackContext));
  }
}
