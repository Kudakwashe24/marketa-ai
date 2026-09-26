export type PlanKey = "free" | "starter" | "growth" | "pro";

export const PLAN_KEYS: PlanKey[] = ["free", "starter", "growth", "pro"];

export const PLAN_MONTHLY_PRICES: Record<PlanKey, number> = {
  free: 0,
  starter: 9,
  growth: 19,
  pro: 39,
};

export function isPlanKey(value: unknown): value is PlanKey {
  return typeof value === "string" && PLAN_KEYS.includes(value as PlanKey);
}

export function normalizePlanKey(value: unknown): PlanKey {
  if (typeof value !== "string") return "free";

  const normalizedValue = value.toLowerCase();
  return isPlanKey(normalizedValue) ? normalizedValue : "free";
}

export type PlanConfig = {
  name: string;
  campaignLimit: number;
  posterLimit: number;
  templatesEnabled: boolean;
  advancedHistoryEnabled: boolean;
};

export const PLAN_CONFIGS: Record<PlanKey, PlanConfig> = {
  free: {
    name: "Free",
    campaignLimit: 5,
    posterLimit: 3,
    templatesEnabled: false,
    advancedHistoryEnabled: false,
  },
  starter: {
    name: "Starter",
    campaignLimit: 30,
    posterLimit: 20,
    templatesEnabled: true,
    advancedHistoryEnabled: true,
  },
  growth: {
    name: "Growth",
    campaignLimit: 200,
    posterLimit: 100,
    templatesEnabled: true,
    advancedHistoryEnabled: true,
  },
  pro: {
    name: "Pro",
    campaignLimit: -1,
    posterLimit: -1,
    templatesEnabled: true,
    advancedHistoryEnabled: true,
  },
};
