export type PlanKey = "free" | "starter" | "growth" | "pro";

export type PlanConfig = {
  key: PlanKey;
  name: string;
  campaignLimit: number;
  posterLimit: number;
  templatesEnabled: boolean;
  advancedHistoryEnabled: boolean;
};

export const PLAN_CONFIGS: Record<PlanKey, PlanConfig> = {
  free: {
    key: "free",
    name: "Free",
    campaignLimit: 5,
    posterLimit: 0,
    templatesEnabled: false,
    advancedHistoryEnabled: false,
  },
  starter: {
    key: "starter",
    name: "Starter",
    campaignLimit: 30,
    posterLimit: 10,
    templatesEnabled: true,
    advancedHistoryEnabled: true,
  },
  growth: {
    key: "growth",
    name: "Growth",
    campaignLimit: 200,
    posterLimit: 100,
    templatesEnabled: true,
    advancedHistoryEnabled: true,
  },
  pro: {
    key: "pro",
    name: "Pro",
    campaignLimit: -1,
    posterLimit: -1,
    templatesEnabled: true,
    advancedHistoryEnabled: true,
  },
};

export function getPlanConfig(plan: string): PlanConfig {
  const normalized = plan?.toLowerCase() as PlanKey;

  if (normalized in PLAN_CONFIGS) {
    return PLAN_CONFIGS[normalized];
  }

  return PLAN_CONFIGS.free;
}