import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getOrCreateUserPlan } from "@/lib/userPlan";
import { getBusinessProfile } from "@/lib/businessProfile";

function getMonthKey() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

type CampaignResult = {
  socialCaption: string;
  whatsappPromo: string;
  adCopy: string;
  marketingTip: string;
};

function parseCampaignResult(text: string): CampaignResult {
  const withoutFences = text
    .trim()
    .replace(/^\`\`\`(?:json)?\s*/i, "")
    .replace(/\s*\`\`\`$/i, "");
  const start = withoutFences.indexOf("{");
  const end = withoutFences.lastIndexOf("}");

  if (start === -1 || end === -1 || end < start) {
    throw new Error("Gemini did not return a JSON object.");
  }

  const parsed = JSON.parse(
    withoutFences.slice(start, end + 1)
  ) as Partial<CampaignResult>;
  const fields: Array<keyof CampaignResult> = [
    "socialCaption",
    "whatsappPromo",
    "adCopy",
    "marketingTip",
  ];

  for (const field of fields) {
    if (typeof parsed[field] !== "string" || !parsed[field]?.trim()) {
      throw new Error(`Gemini returned an invalid ${field}.`);
    }
  }

  return parsed as CampaignResult;
}

function createFallbackCampaign({
  businessName,
  businessType,
  prompt,
  preferredCta,
  phone,
  website,
  instagram,
}: {
  businessName: string;
  businessType: string;
  prompt: string;
  preferredCta: string;
  phone: string;
  website: string;
  instagram: string;
}): CampaignResult {
  const name = businessName || businessType;
  const cta = preferredCta || "Contact us today";
  const contact = phone || website || instagram;
  const contactText = contact ? ` ${contact}` : "";

  return {
    socialCaption: `${prompt}\n\n${name} is ready to help. ${cta}.${contactText}\n\n#SmallBusiness #SupportLocal`,
    whatsappPromo: `Hi! ${name} has an offer for you: ${prompt} ${cta}.${contactText}`,
    adCopy: `${prompt}\n\nChoose ${name} for your ${businessType.toLowerCase()} needs. ${cta}.`,
    marketingTip:
      "Share this campaign on your social feed and WhatsApp Status, then follow up with anyone who replies or asks for more information.",
  };
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { config, plan } = await getOrCreateUserPlan(userId);
    const supabaseAdmin = getSupabaseAdmin();

    const body = await req.json();
    const prompt = body.prompt;
    const requestedBusinessType =
      typeof body.businessType === "string"
        ? body.businessType.trim().slice(0, 100)
        : "";

    let businessProfile: Awaited<ReturnType<typeof getBusinessProfile>> = null;

    try {
      businessProfile = await getBusinessProfile(userId);
    } catch (profileError) {
      // Campaign generation remains available while a new installation is
      // waiting for the business profile migration to be applied.
      console.warn("Business profile unavailable:", profileError);
    }

    const businessType =
      requestedBusinessType ||
      businessProfile?.customBusinessType ||
      businessProfile?.businessType ||
      "Local Service Business";

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    const monthKey = getMonthKey();

    const { data: usageRow, error: usageError } = await supabaseAdmin
      .from("campaign_usage")
      .select("id, usage_count")
      .eq("user_id", userId)
      .eq("month_key", monthKey)
      .maybeSingle();

    if (usageError) {
      console.error("Usage fetch error:", usageError);
      return NextResponse.json(
        { error: "Failed to check usage." },
        { status: 500 }
      );
    }

    const currentUsage = usageRow?.usage_count ?? 0;

    if (config.campaignLimit !== -1 && currentUsage >= config.campaignLimit) {
      return NextResponse.json(
        {
          error: `You have reached your ${config.name} plan monthly campaign limit.`,
          usageCount: currentUsage,
          limit: config.campaignLimit,
          plan,
        },
        { status: 403 }
      );
    }

    const fullPrompt = `
You are Marketa AI, an AI marketing assistant.

Business type:
${businessType}

Promotion request:
${prompt}

Saved business profile:
- Business name: ${businessProfile?.businessName || "Not provided"}
- Description: ${businessProfile?.description || "Not provided"}
- Target audience: ${businessProfile?.targetAudience || "Not provided"}
- Location: ${businessProfile?.location || "Not provided"}
- Phone or WhatsApp: ${businessProfile?.phone || "Not provided"}
- Website: ${businessProfile?.website || "Not provided"}
- Instagram: ${businessProfile?.instagram || "Not provided"}
- Brand voice: ${businessProfile?.brandVoice || "Professional and friendly"}
- Preferred call to action: ${businessProfile?.preferredCta || "Not provided"}

Generate marketing content tailored specifically for this business and its customers.

Return valid JSON with these exact fields:

{
  "socialCaption": "...",
  "whatsappPromo": "...",
  "adCopy": "...",
  "marketingTip": "..."
}

Rules:
- Keep the tone professional, simple, and practical
- Make the content relevant to the business type
- Make the output useful for small businesses
- Use the saved business name, location, contact details, and preferred call to action naturally when relevant
- Never invent contact details, prices, locations, opening hours, or claims that were not provided
- No markdown
- No code fences
- Return JSON only
`;

    let parsed: CampaignResult;

    try {
      const response = await getGeminiClient().models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      parsed = parseCampaignResult(response.text ?? "");
    } catch (generationError) {
      console.warn("Using fallback campaign:", generationError);
      parsed = createFallbackCampaign({
        businessName: businessProfile?.businessName || "",
        businessType,
        prompt: prompt.trim(),
        preferredCta: businessProfile?.preferredCta || "",
        phone: businessProfile?.phone || "",
        website: businessProfile?.website || "",
        instagram: businessProfile?.instagram || "",
      });
    }

    if (usageRow) {
      const { error: updateError } = await supabaseAdmin
        .from("campaign_usage")
        .update({
          usage_count: currentUsage + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", usageRow.id);

      if (updateError) {
        console.error("Usage update error:", updateError);
      }
    } else {
      const { error: insertError } = await supabaseAdmin
        .from("campaign_usage")
        .insert({
          user_id: userId,
          month_key: monthKey,
          usage_count: 1,
        });

      if (insertError) {
        console.error("Usage insert error:", insertError);
      }
    }

    const { error: historyInsertError } = await supabaseAdmin
      .from("campaign_history")
      .insert({
        user_id: userId,
        prompt: `${businessType}: ${prompt}`,
        social_caption: parsed.socialCaption,
        whatsapp_promo: parsed.whatsappPromo,
        ad_copy: parsed.adCopy,
        marketing_tip: parsed.marketingTip,
      });

    if (historyInsertError) {
      console.error("History insert error:", historyInsertError);
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Gemini generation error:", error);

    return NextResponse.json(
      { error: "Failed to generate campaign." },
      { status: 500 }
    );
  }
}
