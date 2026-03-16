import { GoogleGenAI } from "@google/genai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getOrCreateUserPlan } from "@/lib/userPlan";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

function getMonthKey() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { config, plan } = await getOrCreateUserPlan(userId);

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
- suitable for Instagram or Facebook post
- no logo
- use visually appealing colors
- make it look like a ready-to-post promotional graphic
- keep text minimal and readable
- include a call to action

Return an image.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: posterPrompt,
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((part) => part.inlineData);

    if (!imagePart?.inlineData?.data || !imagePart.inlineData.mimeType) {
      return NextResponse.json(
        { error: "No image was generated." },
        { status: 500 }
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

    const imageBase64 = imagePart.inlineData.data;
    const mimeType = imagePart.inlineData.mimeType;
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