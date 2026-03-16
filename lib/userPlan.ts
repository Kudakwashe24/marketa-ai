import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getPlanConfig, PlanConfig } from "@/lib/plans";

export async function getOrCreateUserPlan(
  userId: string
): Promise<{ plan: string; config: PlanConfig }> {
  const { data, error } = await supabaseAdmin
    .from("user_profiles")
    .select("plan")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to fetch user plan.");
  }

  if (data?.plan) {
    return {
      plan: data.plan,
      config: getPlanConfig(data.plan),
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

  return {
    plan: inserted.plan,
    config: getPlanConfig(inserted.plan),
  };
}