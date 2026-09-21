import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getBusinessProfile } from "@/lib/businessProfile";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getOrCreateUserPlan } from "@/lib/userPlan";

const POSTER_TEMPLATES = new Set(["bold", "clean", "photo"]);

function getMonthKey() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function cleanText(value: unknown, maxLength: number) {
  return String(value ?? "")
    .replace(/[#*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cleanHeadlineCandidate(value: string) {
  const firstSentence = cleanText(value, 140)
    .split(/(?<=[.!?])\s+/)[0]
    .replace(/^[^\p{L}\p{N}%]+/gu, "")
    .replace(/^promote\s+(?:(?:my|our|a|an|the)\s+)?/i, "")
    .replace(/^(?:hi|hello|hey)[!,.:\s-]+/i, "")
    .replace(/[.!?]+$/, "")
    .trim();

  if (!firstSentence) return "";
  return `${firstSentence.charAt(0).toUpperCase()}${firstSentence.slice(1)}`;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getHeadline(adCopy: string, prompt: string) {
  const adHeadline = adCopy
    .split(/\n+/)
    .map(cleanHeadlineCandidate)
    .find((line) => line.length >= 4 && line.length <= 110);

  const fallback = cleanHeadlineCandidate(prompt).slice(0, 110);
  return adHeadline || fallback || "A special offer for you";
}

function getSupportingText(
  socialCaption: string,
  whatsappPromo: string,
  headline: string
) {
  const source = socialCaption || whatsappPromo;
  const withoutHashtags = source.replace(
    /(?:^|\s)#[\p{L}\p{N}_-]+/gu,
    " "
  );
  const withoutGreeting = withoutHashtags.replace(
    /^(?:hi|hello|hey)(?:\s+there)?[!,.:\s-]+/i,
    ""
  );
  const withoutHeadline = withoutGreeting
    .replace(new RegExp(escapeRegExp(headline), "i"), "")
    .replace(/^promote\s+(?:(?:my|our|a|an|the)\s+)?/i, "")
    .replace(/^[!,.\s:-]+/, "")
    .replace(/\bWhatApp\b/gi, "WhatsApp");

  return (
    cleanText(withoutHeadline, 190) ||
    "Discover our latest offer and get in touch today."
  );
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { config, plan } = await getOrCreateUserPlan(userId);
    const supabaseAdmin = getSupabaseAdmin();
    const monthKey = getMonthKey();

    const { data: usageRow, error: usageError } = await supabaseAdmin
      .from("poster_usage")
      .select("id, usage_count")
      .eq("user_id", userId)
      .eq("month_key", monthKey)
      .maybeSingle();

    if (usageError) {
      return NextResponse.json(
        { error: "Failed to check poster usage." },
        { status: 500 }
      );
    }

    const currentUsage = usageRow?.usage_count ?? 0;

    if (config.posterLimit !== -1 && currentUsage >= config.posterLimit) {
      return NextResponse.json(
        {
          error: `You have reached your ${config.name} plan monthly poster limit.`,
          usageCount: currentUsage,
          limit: config.posterLimit,
          plan,
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const prompt = cleanText(body.prompt, 500);
    const socialCaption = String(body.socialCaption ?? "")
      .trim()
      .slice(0, 2_000);
    const whatsappPromo = String(body.whatsappPromo ?? "")
      .trim()
      .slice(0, 2_000);
    const adCopy = String(body.adCopy ?? "").trim().slice(0, 2_000);

    if (!prompt) {
      return NextResponse.json(
        { error: "Generate a campaign before creating a poster." },
        { status: 400 }
      );
    }

    const requestedTemplate = String(body.template ?? "bold");
    const template = POSTER_TEMPLATES.has(requestedTemplate)
      ? requestedTemplate
      : "bold";
    const profile = await getBusinessProfile(userId);
    const requestedBrandImageUrl = cleanText(body.brandImageUrl, 2_000);
    const brandImageUrl =
      requestedBrandImageUrl &&
      profile?.brandImages.includes(requestedBrandImageUrl)
        ? requestedBrandImageUrl
        : profile?.brandImages[0] || "";
    const fallbackBusinessType = cleanText(body.businessType, 120);
    const headline = getHeadline(adCopy, prompt);

    const poster = {
      template,
      businessName:
        profile?.businessName || fallbackBusinessType || "Your Business",
      businessType:
        profile?.customBusinessType ||
        profile?.businessType ||
        fallbackBusinessType ||
        "Local Business",
      headline,
      supportingText: getSupportingText(
        socialCaption,
        whatsappPromo,
        headline
      ),
      cta: profile?.preferredCta || "Contact us today",
      phone: profile?.phone || "",
      instagram: profile?.instagram || "",
      website: profile?.website || "",
      location: profile?.location || "",
      primaryColor: profile?.primaryColor || "#4f46e5",
      secondaryColor: profile?.secondaryColor || "#0f172a",
      logoUrl: profile?.logoUrl || "",
      brandImageUrl,
      watermark: plan === "free",
    };

    if (usageRow) {
      const { error: updateError } = await supabaseAdmin
        .from("poster_usage")
        .update({
          usage_count: currentUsage + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", usageRow.id);

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabaseAdmin
        .from("poster_usage")
        .insert({
          user_id: userId,
          month_key: monthKey,
          usage_count: 1,
        });

      if (insertError) throw insertError;
    }

    return NextResponse.json({ poster });
  } catch (error) {
    console.error("Template poster generation error:", error);
    return NextResponse.json(
      { error: "Failed to create your branded poster." },
      { status: 500 }
    );
  }
}
