import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getGeminiApiKey } from "@/lib/gemini";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getOrCreateUserPlan } from "@/lib/userPlan";

function getMonthKey() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

type GeminiImageInteraction = {
  output_image?: {
    data?: string;
    mime_type?: string;
  };
  error?: {
    message?: string;
  };
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { config, plan } = await getOrCreateUserPlan(userId);
    const supabaseAdmin = getSupabaseAdmin();

    if (config.posterLimit === 0) {
      return NextResponse.json(
        {
          error: `${config.name} plan does not include poster generation.`,
          plan,
        },
        { status: 403 }
      );
    }

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

    const businessType = body.businessType || "Local Service Business";
    const prompt = body.prompt || "";
    const socialCaption = body.socialCaption || "";
    const whatsappPromo = body.whatsappPromo || "";
    const adCopy = body.adCopy || "";

    if (!prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required to generate a poster." },
        { status: 400 }
      );
    }

    const posterPrompt = `
Create a clean, modern, professional square social media marketing poster for a small business.

Business type:
${businessType}

Promotion:
${prompt}

Reference campaign content:
Social caption: ${socialCaption}
WhatsApp promo: ${whatsappPromo}
Ad copy: ${adCopy}

Poster requirements:
- 1:1 square social media poster
- modern and eye-catching design
- professional business marketing style
- bold headline
- short supporting text
- clean layout with strong visual hierarchy
- suitable for Instagram or Facebook
- no logo
- use visually appealing colors
- make it look like a ready-to-post promotional graphic
- keep text minimal and readable
- include a clear call to action

Return one image only.
`;

    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/interactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": getGeminiApiKey(),
        },
        body: JSON.stringify({
          model: "gemini-3.1-flash-lite-image",
          input: posterPrompt,
          response_format: {
            type: "image",
            mime_type: "image/png",
            aspect_ratio: "1:1",
            image_size: "1K",
          },
        }),
      }
    );

    const imageResult =
      (await geminiResponse.json()) as GeminiImageInteraction;

    if (!geminiResponse.ok) {
      console.error("Gemini image API error:", {
        status: geminiResponse.status,
        message: imageResult.error?.message,
      });

      return NextResponse.json(
        {
          error:
            "Poster generation is temporarily unavailable. Please try again.",
        },
        { status: 502 }
      );
    }

    const imageBase64 = imageResult.output_image?.data;
    const mimeType = imageResult.output_image?.mime_type || "image/png";

    if (!imageBase64) {
      return NextResponse.json(
        { error: "No image was generated." },
        { status: 502 }
      );
    }

    if (usageRow) {
      const { error: updateError } = await supabaseAdmin
        .from("poster_usage")
        .update({
          usage_count: currentUsage + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", usageRow.id);

      if (updateError) {
        console.error("Poster usage update error:", updateError);
      }
    } else {
      const { error: insertError } = await supabaseAdmin
        .from("poster_usage")
        .insert({
          user_id: userId,
          month_key: monthKey,
          usage_count: 1,
        });

      if (insertError) {
        console.error("Poster usage insert error:", insertError);
      }
    }

    const imageUrl = `data:${mimeType};base64,${imageBase64}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Poster generation error:", error);

    return NextResponse.json(
      { error: "Failed to generate poster." },
      { status: 500 }
    );
  }
}
