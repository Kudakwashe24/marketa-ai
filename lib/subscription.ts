import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function getUserSubscription(userId: string) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("subscriptions")
    .select("plan")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return "free";
  }

  return data.plan || "free";
}
