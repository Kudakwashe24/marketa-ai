import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import {
  normalizePlanKey,
  PLAN_CONFIGS,
  PlanConfig,
  PlanKey,
} from "@/lib/plans";

export async function getOrCreateUserPlan(
  userId: string
): Promise<{ plan: PlanKey; config: PlanConfig }> {
  const supabaseAdmin = getSupabaseAdmin();

  // Multiple dashboard requests can reach this function at the same time for
  // a brand-new user. An idempotent upsert prevents those requests from
  // racing to insert the same profile, while ignoreDuplicates preserves any
  // existing paid plan.
  const { error: ensureProfileError } = await supabaseAdmin
    .from("user_profiles")
    .upsert(
      {
        user_id: userId,
        plan: "free",
      },
      {
        onConflict: "user_id",
        ignoreDuplicates: true,
      }
    );

  if (ensureProfileError) {
    throw new Error("Failed to create user profile.");
  }

  const { data, error } = await supabaseAdmin
    .from("user_profiles")
    .select("plan")
    .eq("user_id", userId)
    .single();

  if (error || !data?.plan) {
    throw new Error("Failed to fetch user plan.");
  }

  const normalizedPlan = normalizePlanKey(data.plan);

  return {
    plan: normalizedPlan,
    config: PLAN_CONFIGS[normalizedPlan],
  };
}
