import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const FREE_PLAN_LIMIT = 5;

function getMonthKey() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const monthKey = getMonthKey();

  const { data, error } = await supabaseAdmin
    .from("campaign_usage")
    .select("usage_count")
    .eq("user_id", userId)
    .eq("month_key", monthKey)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch usage." },
      { status: 500 }
    );
  }

  const usageCount = data?.usage_count ?? 0;

  return NextResponse.json({
    usageCount,
    limit: FREE_PLAN_LIMIT,
    remaining: Math.max(FREE_PLAN_LIMIT - usageCount, 0),
    plan: "Free",
  });
}