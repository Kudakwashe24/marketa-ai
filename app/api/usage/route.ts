import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getOrCreateUserPlan } from "@/lib/userPlan";

function getMonthKey() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, config } = await getOrCreateUserPlan(userId);
    const monthKey = getMonthKey();

    const { data: campaignData, error: campaignError } = await supabaseAdmin
      .from("campaign_usage")
      .select("usage_count")
      .eq("user_id", userId)
      .eq("month_key", monthKey)
      .maybeSingle();

    if (campaignError) {
      return NextResponse.json(
        { error: "Failed to fetch campaign usage." },
        { status: 500 }
      );
    }

    const { data: posterData, error: posterError } = await supabaseAdmin
      .from("poster_usage")
      .select("usage_count")
      .eq("user_id", userId)
      .eq("month_key", monthKey)
      .maybeSingle();

    if (posterError) {
      return NextResponse.json(
        { error: "Failed to fetch poster usage." },
        { status: 500 }
      );
    }

    const campaignUsageCount = campaignData?.usage_count ?? 0;
    const posterUsageCount = posterData?.usage_count ?? 0;

    return NextResponse.json({
      plan,
      planName: config.name,
      campaignUsageCount,
      campaignLimit: config.campaignLimit,
      posterUsageCount,
      posterLimit: config.posterLimit,
      templatesEnabled: config.templatesEnabled,
      advancedHistoryEnabled: config.advancedHistoryEnabled,
    });
  } catch (error) {
    console.error("Usage route error:", error);

    return NextResponse.json(
      { error: "Failed to fetch usage." },
      { status: 500 }
    );
  }
}