import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { PLAN_CONFIGS, PlanConfig, PlanKey } from "@/lib/plans";

export async function getOrCreateUserPlan(
  userId: string
): Promise<{ plan: PlanKey; config: PlanConfig }> {
  const { data, error } = await supabaseAdmin
    .from("user_profiles")
    .select("plan")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to fetch user plan.");
  }

  if (data?.plan) {
    const normalizedPlan = normalizePlan(data.plan);

    return {
      plan: normalizedPlan,
      config: PLAN_CONFIGS[normalizedPlan],
    };
  }

  const { data: inserted, error: insertError } = await supabaseAdmin
    .from("user_profiles")
    .insert({
      user_id: userId,
      plan: "free",
    })
    .select("plan")
    .single();

  if (insertError) {
    throw new Error("Failed to create user profile.");
  }

  const normalizedPlan = normalizePlan(inserted.plan);

  return {
    plan: normalizedPlan,
    config: PLAN_CONFIGS[normalizedPlan],
  };
}

function normalizePlan(plan: string): PlanKey {
  const value = plan.toLowerCase();

  if (value === "starter") return "starter";
  if (value === "growth") return "growth";
  if (value === "pro") return "pro";

  return "free";
}