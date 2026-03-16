import { GoogleGenAI } from "@google/genai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const FREE_PLAN_LIMIT = 5;

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

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const prompt = body.prompt;

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

    if (currentUsage >= FREE_PLAN_LIMIT) {
      return NextResponse.json(
        {
          error: "You have reached your monthly campaign limit.",
          usageCount: currentUsage,
          limit: FREE_PLAN_LIMIT,
        },
        { status: 403 }
      );
    }

    const fullPrompt = `
You are Marketa AI, an AI marketing assistant for businesses.

A user will give you something they want to promote.

Generate a response in valid JSON format only with these exact keys:
- socialCaption
- whatsappPromo
- adCopy
- marketingTip

Rules:
- Keep the tone professional, simple, and practical.
- Make the output useful for small businesses.
- Do not include markdown.
- Do not include code fences.
- Return JSON only.

User prompt:
${prompt}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    const text = response.text ?? "";
    const parsed = JSON.parse(text.trim()) as CampaignResult;

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
        prompt,
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