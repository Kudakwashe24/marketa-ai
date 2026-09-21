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

function normalizeMarketingCopy(value: string) {
  return value
    .replace(/\bWhatApp\b/gi, "WhatsApp")
    .replace(/\bcape town\b/gi, "Cape Town")
    .trim();
}

function cleanSentence(value: string) {
  return normalizeMarketingCopy(value)
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?])/g, "$1")
    .trim();
}

function finishSentence(value: string) {
  const cleaned = cleanSentence(value).replace(/[.!?]+$/, "");
  return cleaned ? `${cleaned}.` : "";
}

function capitalizeSentence(value: string) {
  const sentence = finishSentence(value);
  return sentence ? sentence.charAt(0).toUpperCase() + sentence.slice(1) : "";
}

function formatServices(value: string, fallback: string) {
  const items = value
    .split(/\n|,|\||\//)
    .map((item) => cleanSentence(item))
    .filter(Boolean)
    .slice(0, 3);

  if (items.length === 0) return cleanSentence(fallback);
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;

  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function getPromotionFocus(prompt: string, services: string) {
  const cleaned = cleanSentence(prompt)
    .replace(/^(please\s+)?(promote|advertise|announce|market)\s+/i, "")
    .replace(/^(please\s+)?(help me\s+)?(create|write|generate)\s+/i, "");
  const looksLikeInstruction =
    /\b(social (media )?caption|whatsapp (promotion|promo|message)|ad copy|marketing (campaign|content)|static poster)\b/i.test(
      cleaned
    );

  return looksLikeInstruction || cleaned.length < 8 ? services : cleaned;
}

function getCampaignHashtags(businessType: string, services: string, location: string) {
  const source = `${businessType} ${services}`;
  const tags: string[] = [];

  if (/web development/i.test(source)) tags.push("#WebDevelopment");
  if (/\bseo\b/i.test(source)) tags.push("#SEO");
  if (/salon|barber|hair|braid/i.test(source)) tags.push("#HairCare");
  if (/restaurant|food|catering/i.test(source)) tags.push("#FoodLovers");
  if (/car wash|detailing/i.test(source)) tags.push("#CarCare");
  if (/clothing|boutique|fashion/i.test(source)) tags.push("#ShopLocal");
  if (location) tags.push(`#${location.replace(/[^a-z0-9]/gi, "")}`);
  if (tags.length === 0) tags.push("#SmallBusiness", "#SupportLocal");

  return [...new Set(tags)].slice(0, 3).join(" ");
}

function getBenefitAngle(source: string) {
  if (/web development|website|\bseo\b/i.test(source)) {
    return {
      hook: "Is your business easy to find—and easy to trust—online?",
      benefit:
        "Build a clearer online presence that helps the right customers discover your business and take the next step.",
      headline: "Be easier to find. Easier to choose.",
    };
  }
  if (/salon|barber|hair|braid/i.test(source)) {
    return {
      hook: "Ready to step into your next look with confidence?",
      benefit:
        "Make time for the style and care that helps you look polished and feel your best.",
      headline: "Your next look starts here.",
    };
  }
  if (/restaurant|food|catering|meal/i.test(source)) {
    return {
      hook: "Good food can turn an ordinary day into something worth sharing.",
      benefit:
        "Enjoy a satisfying option made for customers who want flavour, convenience, and a reason to come back.",
      headline: "Make your next meal count.",
    };
  }
  if (/car wash|detailing|vehicle/i.test(source)) {
    return {
      hook: "Your car deserves to look as good as it feels to drive.",
      benefit:
        "Give your vehicle the clean, cared-for finish that makes every trip feel better.",
      headline: "Drive clean. Arrive confident.",
    };
  }
  if (/clothing|boutique|fashion|outfit/i.test(source)) {
    return {
      hook: "The right look does more than fit—it changes how you show up.",
      benefit:
        "Find a style that feels current, confident, and true to you.",
      headline: "Find your next favourite look.",
    };
  }

  return {
    hook: "Looking for a clear, reliable way to move forward?",
    benefit:
      "Get practical support focused on the result you need, without unnecessary complications.",
    headline: "A simpler way to get it done.",
  };
}

function resultEchoesPrompt(result: CampaignResult, prompt: string) {
  const normalizedPrompt = cleanSentence(prompt).toLowerCase();
  if (normalizedPrompt.length < 32) return false;

  return [result.socialCaption, result.whatsappPromo, result.adCopy].some(
    (value) => cleanSentence(value).toLowerCase().includes(normalizedPrompt)
  );
}

const ALLOWED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
]);
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

async function getAttachmentPart(
  attachmentUrl: string,
  allowedUrls: string[]
) {
  if (!attachmentUrl) return null;

  if (!allowedUrls.includes(attachmentUrl)) {
    throw new Error("The attached image does not belong to this business.");
  }

  const response = await fetch(attachmentUrl);
  if (!response.ok) {
    throw new Error("The attached image could not be loaded.");
  }

  const mimeType = response.headers.get("content-type")?.split(";")[0] ?? "";
  if (!ALLOWED_IMAGE_TYPES.has(mimeType)) {
    throw new Error("The attached file must be a PNG, JPG, or WebP image.");
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.byteLength > MAX_IMAGE_SIZE) {
    throw new Error("The attached image must be smaller than 5 MB.");
  }

  return {
    inlineData: {
      data: bytes.toString("base64"),
      mimeType,
    },
  };
}

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

  const validResult = parsed as CampaignResult;

  return {
    socialCaption: normalizeMarketingCopy(validResult.socialCaption),
    whatsappPromo: normalizeMarketingCopy(validResult.whatsappPromo),
    adCopy: normalizeMarketingCopy(validResult.adCopy),
    marketingTip: normalizeMarketingCopy(validResult.marketingTip),
  };
}

function createFallbackCampaign({
  businessName,
  businessType,
  prompt,
  description,
  targetAudience,
  location,
  preferredCta,
  phone,
  website,
  instagram,
}: {
  businessName: string;
  businessType: string;
  prompt: string;
  description: string;
  targetAudience: string;
  location: string;
  preferredCta: string;
  phone: string;
  website: string;
  instagram: string;
}): CampaignResult {
  const name = businessName || businessType;
  const cta = cleanSentence(preferredCta || "Message us to get started");
  const contact = phone || website || instagram;
  const contactText = contact ? ` ${cleanSentence(contact)}` : "";
  const services = formatServices(description, businessType);
  const focus = getPromotionFocus(prompt, services);
  const audience = targetAudience
    ? cleanSentence(targetAudience)
    : "people who value reliable service";
  const localContext = location ? ` in ${cleanSentence(location)}` : "";
  const hashtags = getCampaignHashtags(businessType, services, location);
  const ctaLine = `${finishSentence(cta)}${contactText}`.trim();
  const angle = getBenefitAngle(`${businessType} ${services} ${focus}`);
  const focusLine =
    focus === services ? angle.benefit : capitalizeSentence(focus);

  return {
    socialCaption: `✨ ${angle.hook}\n\n${focusLine} ${name} provides ${services.toLowerCase()}${localContext} for ${audience}.\n\n${ctaLine}\n\n${hashtags}`,
    whatsappPromo: `Hi 👋 ${angle.hook}\n\n${focusLine} ${name} offers ${services.toLowerCase()}${localContext}.\n\n${ctaLine}`,
    adCopy: `🚀 ${angle.headline}\n\n${focusLine}\n\n${name} · ${finishSentence(services)}\n${ctaLine}`,
    marketingTip: `💡 Lead with the customer need this campaign solves, then keep one clear action: ${cta.toLowerCase()}. Share the social caption on your feed and the shorter version on WhatsApp Status.`,
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
    const attachmentUrl =
      typeof body.attachmentUrl === "string"
        ? body.attachmentUrl.trim().slice(0, 2_000)
        : "";
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

Uploaded image:
${attachmentUrl ? "A business image is attached to this request." : "No image attached."}

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
- Write finished, publication-ready marketing copy—not instructions, notes, or a summary of the request
- Never repeat or closely paraphrase the user's full prompt
- Lead with a customer-facing hook or benefit instead of saying the business “has an offer for you”
- Social caption: 45–90 words, natural line breaks, a clear benefit, one CTA, and 2–4 relevant hashtags
- WhatsApp promotion: 30–65 words, conversational, direct, and ready to send
- Ad copy: a short headline, 1–3 concise supporting lines, and a CTA
- Marketing tip: one specific, actionable recommendation tied to this campaign; avoid generic advice
- Keep the tone professional, simple, persuasive, and practical
- Make the content relevant to the business type
- Make the output useful for small businesses
- Use 1 to 3 relevant emojis naturally in the social caption and up to 2 in the WhatsApp promotion
- The ad copy may use 1 relevant emoji; keep the marketing tip clear and practical
- Use the saved business name, location, contact details, and preferred call to action naturally when relevant
- If an image is attached, use visible details from it to improve the campaign, but do not guess anything that is not clearly shown
- Only produce services Marketa offers: social captions, WhatsApp promotions, ad copy, marketing guidance, and static poster-ready copy
- Do not promise video creation, reels, animation, photography, website building, ad management, or any other service unless the user's own business is explicitly promoting that service
- Never invent contact details, prices, locations, opening hours, or claims that were not provided
- No markdown
- No code fences
- Return JSON only
`;

    let parsed: CampaignResult;

    try {
      const attachmentPart = await getAttachmentPart(attachmentUrl, [
        businessProfile?.logoUrl || "",
        ...(businessProfile?.brandImages || []),
      ]);
      const response = await getGeminiClient().models.generateContent({
        model: "gemini-2.5-flash",
        contents: attachmentPart
          ? [
              {
                role: "user",
                parts: [{ text: fullPrompt }, attachmentPart],
              },
            ]
          : fullPrompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      parsed = parseCampaignResult(response.text ?? "");
      if (resultEchoesPrompt(parsed, prompt)) {
        throw new Error("Gemini repeated the campaign request instead of writing copy.");
      }
    } catch (generationError) {
      console.warn("Using fallback campaign:", generationError);
      parsed = createFallbackCampaign({
        businessName: businessProfile?.businessName || "",
        businessType,
        prompt: prompt.trim(),
        description: businessProfile?.description || "",
        targetAudience: businessProfile?.targetAudience || "",
        location: businessProfile?.location || "",
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
